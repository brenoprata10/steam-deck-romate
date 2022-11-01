import {useContext} from 'react'
import {CommonContext} from 'renderer/context'

const useSteamUserId = () => {
	const {steamUserId} = useContext(CommonContext)

	return steamUserId
}

export default useSteamUserId
