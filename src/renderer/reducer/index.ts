import ESetup from 'renderer/enums/ESetup'
import TGame from 'renderer/types/TGame'

export type TCommonState = {
	setupFlow?: ESetup
	games: TGame[]
}

export const INITIAL_STATE: TCommonState = {games: []}

export enum EAction {
	SET_SETUP_FLOW = 'SET_SETUP_FLOW',
	SET_GAMES = 'SET_GAMES'
}

export type TAction =
	| {
			type: EAction.SET_SETUP_FLOW
			payload: ESetup
	  }
	| {type: EAction.SET_GAMES; payload: TGame[]}

export const reducer = (state: TCommonState, action: TAction): TCommonState => {
	switch (action.type) {
		case EAction.SET_SETUP_FLOW:
			return {...state, setupFlow: action.payload}
		case EAction.SET_GAMES:
			return {...state, games: action.payload}
		default:
			throw new Error()
	}
}
