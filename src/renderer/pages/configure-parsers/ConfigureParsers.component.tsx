import {useCallback, useContext} from 'react'
import {CommonDispatchContext} from 'renderer/context'
import useCustomParsers from 'renderer/hooks/useCustomParsers'
import {EAction} from 'renderer/reducer'
import TParserConfig from 'renderer/types/TParserConfig'
import Button from 'renderer/uikit/button/Button.component'
import Modal from 'renderer/uikit/modal/Modal.component'
import styles from './ConfigureParsers.module.scss'

const ConfigureParsers = () => {
	const customParsers = useCustomParsers()
	const dispatch = useContext(CommonDispatchContext)
	const customParsersCount = customParsers?.length ?? 0

	const addParser = useCallback(
		(parser: TParserConfig) => {
			dispatch({type: EAction.SET_CUSTOM_PARSERS, payload: [...(customParsers ?? []), parser]})
		},
		[customParsers, dispatch]
	)

	return (
		<Modal
			title='Create Parsers'
			isOpened={true}
			isCloseable={false}
			className={styles['configure-parsers-modal']}
			width={'min(55rem, 50%)'}
			footer={<Button disabled={customParsersCount === 0}>Save</Button>}
		>
			<div className={styles['parsers-list']}>
				{customParsers?.map((parser) => (
					<div key={parser.id} className={styles.item}>
						{parser.name}
					</div>
				))}
				<Button
					transparent={true}
					className={styles['add-parser-btn']}
					onClick={() =>
						addParser({
							id: '1',
							name: `Parser #${customParsersCount + 1}`,
							supportedFileTypes: [],
							romDirectory: '<ROM_DIRECTORY>',
							executable: {arguments: '{filePath}', path: '{filePath}'}
						})
					}
				>
					Add Parser
				</Button>
			</div>
			<div className={styles.form}>
				<span>form</span>
			</div>
		</Modal>
	)
}

export default ConfigureParsers
