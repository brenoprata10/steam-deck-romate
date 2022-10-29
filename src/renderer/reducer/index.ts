import {LOCAL_STORAGE_STEAM_GRID_API_KEY} from 'renderer/api/steam-grid.api'
import ESetup from 'renderer/enums/ESetup'
import TGame from 'renderer/types/TGame'

export type TCommonState = {
	games: TGame[]
	setupFlow?: ESetup
	steamGridApiKey?: string | null
}

export const INITIAL_STATE: TCommonState = {
	games: [],
	steamGridApiKey: localStorage.getItem(LOCAL_STORAGE_STEAM_GRID_API_KEY)
}

export enum EAction {
	SET_SETUP_FLOW = 'SET_SETUP_FLOW',
	SET_GAMES = 'SET_GAMES',
	SET_STEAM_GRID_API_KEY = 'SET_STEAM_GRID_API_KEY'
}

export type TAction =
	| {
			type: EAction.SET_SETUP_FLOW
			payload: ESetup
	  }
	| {type: EAction.SET_GAMES; payload: TGame[]}
	| {type: EAction.SET_STEAM_GRID_API_KEY; payload: string}

export const reducer = (state: TCommonState, action: TAction): TCommonState => {
	switch (action.type) {
		case EAction.SET_SETUP_FLOW:
			return {...state, setupFlow: action.payload}
		case EAction.SET_GAMES:
			return {...state, games: action.payload}
		case EAction.SET_STEAM_GRID_API_KEY:
			localStorage.setItem(LOCAL_STORAGE_STEAM_GRID_API_KEY, action.payload)
			return {...state, steamGridApiKey: action.payload}
		default:
			throw new Error()
	}
}
