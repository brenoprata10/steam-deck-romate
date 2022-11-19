import {useCallback, useContext} from 'react'
import {CommonDispatchContext} from 'renderer/context'
import useCustomParsers from 'renderer/hooks/useCustomParsers'
import {EAction} from 'renderer/reducer'
import TParserConfig from 'renderer/types/TParserConfig'
import Modal from 'renderer/uikit/modal/Modal.component'

const ConfigureParsers = () => {
	const customParsers = useCustomParsers()
	const dispatch = useContext(CommonDispatchContext)

	const addParser = useCallback(
		(parser: TParserConfig) => {
			dispatch({type: EAction.SET_CUSTOM_PARSERS, payload: [...(customParsers ?? []), parser]})
		},
		[customParsers, dispatch]
	)

	return (
		<Modal title='Create Parsers' isOpened={true} isCloseable={false} width={'90rem'}>
			<span onClick={() => addParser({} as TParserConfig)}>Testpp</span>
		</Modal>
	)
}

export default ConfigureParsers
