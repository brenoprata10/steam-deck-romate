import {useCallback, useContext, useState} from 'react'
import {CommonDispatchContext} from 'renderer/context'
import useCustomParsers from 'renderer/hooks/useCustomParsers'
import {EAction} from 'renderer/reducer'
import TParserConfig from 'renderer/types/TParserConfig'
import Button from 'renderer/uikit/button/Button.component'
import Modal from 'renderer/uikit/modal/Modal.component'
import {generateId} from 'renderer/utils/generate-id'
import styles from './ConfigureParsers.module.scss'
import ParserForm from './parser-form/ParserForm.component'

const ConfigureParsers = () => {
	const customParsers = useCustomParsers()
	const dispatch = useContext(CommonDispatchContext)
	const [selectedParserId, setSelectedParser] = useState<string | undefined>()
	const selectedParser = customParsers?.find(({id}) => id === selectedParserId)
	const customParsersCount = customParsers?.length ?? 0

	const addParser = useCallback(
		(parser: TParserConfig) => {
			dispatch({type: EAction.SET_CUSTOM_PARSERS, payload: [...(customParsers ?? []), parser]})
			setSelectedParser(parser.id)
		},
		[customParsers, dispatch]
	)

	const addEmptyParser = () =>
		addParser({
			id: generateId().toString(),
			name: `Parser #${customParsersCount + 1}`,
			supportedFileTypes: [],
			romDirectory: '<ROM_DIRECTORY>',
			executable: {arguments: '{filePath}', path: '{filePath}'}
		})

	return (
		<Modal
			title='Create Parsers'
			isOpened={true}
			isCloseable={false}
			className={styles['configure-parsers-modal']}
			width={'min(55rem, 70%)'}
			footer={<Button disabled={customParsersCount === 0}>Save</Button>}
		>
			<div className={styles['parsers-list']}>
				{customParsers?.map((parser) => (
					<div
						key={parser.id}
						className={`${styles.item} ${selectedParserId === parser.id ? styles['item-selected'] : ''}`}
						onClick={() => setSelectedParser(parser.id)}
					>
						{parser.name}
					</div>
				))}
				<Button transparent={true} className={styles['add-parser-btn']} onClick={addEmptyParser}>
					Add Parser
				</Button>
			</div>
			{selectedParser && <ParserForm key={selectedParser.id} parser={selectedParser} className={styles.form} />}
		</Modal>
	)
}

export default ConfigureParsers
