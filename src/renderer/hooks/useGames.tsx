import {useContext} from 'react'
import {CommonContext} from 'renderer/context'
import TGame from 'renderer/types/TGame'

const useGames = (): TGame[] => {
	return useContext(CommonContext).games
}

export default useGames
