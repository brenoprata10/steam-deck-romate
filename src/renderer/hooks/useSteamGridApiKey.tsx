import {useContext} from 'react'
import {CommonContext} from 'renderer/context'

const useSteamGridApiKey = () => {
	const {steamGridApiKey} = useContext(CommonContext)

	return steamGridApiKey
}

export default useSteamGridApiKey
