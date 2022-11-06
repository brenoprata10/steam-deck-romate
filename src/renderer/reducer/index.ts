import {LOCAL_STORAGE_STEAM_GRID_API_KEY} from 'renderer/api/steam-grid.api'
import EAssetType from 'renderer/enums/EAssetType'
import ESetup from 'renderer/enums/ESetup'
import {TSteamGridAsset} from 'renderer/types/TApiSteamGridAssets'
import TGame from 'renderer/types/TGame'

export type TCommonState = {
	games: TGame[]
	steamUserId?: string | null
	setupFlow?: ESetup
	steamGridApiKey?: string | null
	storageDevicePath?: string
}

export const INITIAL_STATE: TCommonState = {
	games: [],
	steamGridApiKey: localStorage.getItem(LOCAL_STORAGE_STEAM_GRID_API_KEY)
}

export enum EAction {
	SET_SETUP_FLOW = 'SET_SETUP_FLOW',
	SET_GAMES = 'SET_GAMES',
	TOGGLE_IGNORED_GAME_STATUS = 'TOGGLE_IGNORED_GAME_STATUS',
	SET_STEAM_GRID_API_KEY = 'SET_STEAM_GRID_API_KEY',
	SELECT_ASSET = 'SELECT_ASSET',
	SET_STEAM_USER_ID = 'SET_STEAM_USER_ID',
	SET_STORAGE_DEVICE_PATH = 'SET_STORAGE_DEVICE_PATH'
}

export type TAction =
	| {
			type: EAction.SET_SETUP_FLOW
			payload: ESetup
	  }
	| {type: EAction.SET_GAMES; payload: TGame[]}
	| {type: EAction.TOGGLE_IGNORED_GAME_STATUS; payload: {gameId: string}}
	| {type: EAction.SET_STEAM_GRID_API_KEY; payload: string}
	| {type: EAction.SELECT_ASSET; payload: {gameId: string; assetType: EAssetType; assetId: number}}
	| {type: EAction.SET_STEAM_USER_ID; payload: string}
	| {type: EAction.SET_STORAGE_DEVICE_PATH; payload: string}

export const reducer = (state: TCommonState, action: TAction): TCommonState => {
	switch (action.type) {
		case EAction.SET_SETUP_FLOW:
			return {...state, setupFlow: action.payload}
		case EAction.SET_GAMES:
			return {...state, games: action.payload}
		case EAction.TOGGLE_IGNORED_GAME_STATUS:
			return {
				...state,
				games: state.games.map((game) =>
					game.id !== action.payload.gameId ? game : {...game, isIgnored: !game.isIgnored}
				)
			}
		case EAction.SET_STEAM_GRID_API_KEY:
			localStorage.setItem(LOCAL_STORAGE_STEAM_GRID_API_KEY, action.payload)
			return {...state, steamGridApiKey: action.payload}
		case EAction.SET_STEAM_USER_ID:
			return {...state, steamUserId: action.payload}
		case EAction.SET_STORAGE_DEVICE_PATH:
			return {...state, storageDevicePath: action.payload}
		case EAction.SELECT_ASSET: {
			const {gameId, assetType, assetId} = action.payload
			const modifiedGame = state.games.find((game) => game.id === gameId)
			if (!modifiedGame?.assets) {
				return state
			}
			const assetCollectionWithSelectedAsset: TSteamGridAsset[] = modifiedGame.assets[assetType].map((asset) => ({
				...asset,
				isSelected: asset.id === assetId
			}))
			return {
				...state,
				games: state.games.map((game) => ({
					...game,
					assets:
						game.assets && game.id === gameId
							? {...game.assets, [assetType]: assetCollectionWithSelectedAsset}
							: game.assets
				}))
			}
		}
		default:
			throw new Error('Action not defined.')
	}
}
