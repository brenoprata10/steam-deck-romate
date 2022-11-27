import {useContext} from 'react'
import {CommonContext} from 'renderer/context'

const useCustomParsers = () => {
	const {customParsers} = useContext(CommonContext)

	return customParsers
}

export default useCustomParsers
