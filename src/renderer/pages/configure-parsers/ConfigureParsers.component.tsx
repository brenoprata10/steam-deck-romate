import {useCallback, useContext, useState} from 'react'
import {useMount} from 'react-use'
import {CommonDispatchContext} from 'renderer/context'
import useCustomParsers from 'renderer/hooks/useCustomParsers'
import {EAction} from 'renderer/reducer'
import TParserConfig from 'renderer/types/TParserConfig'
import Button, {EButtonVariant} from 'renderer/uikit/button/Button.component'
import Modal from 'renderer/uikit/modal/Modal.component'
import {generateId} from 'renderer/utils/generate-id'
import styles from './ConfigureParsers.module.scss'
import ParserForm from 'renderer/pages/configure-parsers/parser-form/ParserForm.component'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faWarning} from '@fortawesome/free-solid-svg-icons'
import {useNavigate} from 'react-router-dom'
import {getRoutePath} from 'renderer/route'
import ERoute from 'renderer/enums/ERoute'
import {getGamesFromParsers} from 'renderer/utils/parser'
import ELocalStorageKey from 'renderer/enums/ELocalStorageKey'

const ConfigureParsers = () => {
	const navigate = useNavigate()
	const customParsers = useCustomParsers()
	const dispatch = useContext(CommonDispatchContext)
	const [selectedParserId, setSelectedParser] = useState<string | undefined>()
	const selectedParser = customParsers?.find(({id}) => id === selectedParserId)
	const customParsersCount = customParsers?.length ?? 0

	useMount(() => {
		if (!customParsers || customParsers?.length === 0) {
			addEmptyParser()
		} else {
			setSelectedParser(customParsers?.[0].id)
		}
	})

	const handleBackNavigation = useCallback(() => {
		dispatch({type: EAction.SET_CUSTOM_PARSERS, payload: []})
		navigate(getRoutePath(ERoute.SETUP))
	}, [navigate, dispatch])

	const deleteSelectedParser = () => {
		setSelectedParser(customParsers?.find((parser) => parser.id !== selectedParserId)?.id)
		dispatch({
			type: EAction.SET_CUSTOM_PARSERS,
			payload: customParsers?.filter((parser) => parser.id !== selectedParserId) ?? []
		})
	}

	const addParser = useCallback(
		(parser: TParserConfig) => {
			dispatch({type: EAction.SET_CUSTOM_PARSERS, payload: [...(customParsers ?? []), parser]})
			setSelectedParser(parser.id)
		},
		[customParsers, dispatch]
	)

	const addEmptyParser = useCallback(
		() =>
			addParser({
				id: generateId().toString(),
				name: `Parser #${customParsersCount + 1}`,
				supportedFileTypes: ['zip', 'iso'],
				romDirectory: '<ROM_DIRECTORY>',
				executable: {path: '${filePath}'}
			}),
		[addParser, customParsersCount]
	)

	const onEditParser = useCallback(
		(parser: TParserConfig) =>
			dispatch({
				type: EAction.SET_CUSTOM_PARSERS,
				payload: customParsers?.map((customParser) => (customParser.id === parser.id ? parser : customParser)) ?? []
			}),
		[customParsers, dispatch]
	)
	const handleSave = useCallback(() => {
		if (!customParsers) {
			throw Error('Parser is not configured.')
		}

		const games = getGamesFromParsers(customParsers.map((parser) => ({...parser, category: parser.name})))

		if (games.length === 0) {
			alert('No games were found within your parsers configuration, check your configuration.')
			return
		}

		localStorage.setItem(ELocalStorageKey.CUSTOM_PARSERS_KEY, JSON.stringify(customParsers))

		dispatch({
			type: EAction.SET_GAMES,
			payload: games
		})
		navigate(getRoutePath(ERoute.SELECT_ACCOUNT))
	}, [navigate, dispatch, customParsers])

	const isValidParser = ({id, romDirectory, executable, supportedFileTypes, name}: TParserConfig) =>
		Boolean(id && name && romDirectory && executable.path && supportedFileTypes.length > 0)

	const isParsersValid = customParsers?.every(isValidParser)

	return (
		<Modal
			title='Create Parsers'
			isOpened={true}
			isCloseable={false}
			className={styles['configure-parsers-modal']}
			width={'min(55rem, 70%)'}
			footerLeading={
				<Button onClick={handleBackNavigation} variant={EButtonVariant.SECONDARY}>
					Back
				</Button>
			}
			footerTrailing={
				<Button disabled={customParsersCount === 0 || !isParsersValid} onClick={handleSave}>
					Save
				</Button>
			}
		>
			<div className={styles['parsers-list']}>
				{customParsers?.map((parser) => (
					<div
						key={parser.id}
						className={`${styles.item} ${!isValidParser(parser) ? styles['item-invalid'] : ''} ${
							selectedParserId === parser.id ? styles['item-selected'] : ''
						}`}
						onClick={() => setSelectedParser(parser.id)}
					>
						{!isValidParser(parser) && <FontAwesomeIcon className={styles['error-icon']} icon={faWarning} />}
						<span className={styles.label}>{parser.name}</span>
					</div>
				))}
				<Button transparent={true} className={styles['add-parser-btn']} onClick={addEmptyParser}>
					Add Parser
				</Button>
			</div>
			{selectedParser && (
				<ParserForm
					key={selectedParser.id}
					parser={selectedParser}
					className={styles.form}
					onChange={onEditParser}
					onDelete={deleteSelectedParser}
				/>
			)}
		</Modal>
	)
}

export default ConfigureParsers
