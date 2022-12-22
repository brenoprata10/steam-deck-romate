import EAssetType from 'renderer/enums/EAssetType'
import ELocalStorageKey from 'renderer/enums/ELocalStorageKey'
import TGame from 'renderer/types/TGame'
import TGameAssetCollection from 'renderer/types/TGameAssetCollection'
import {getTextFileData} from 'renderer/utils/files'
import {generateShortAppId} from 'renderer/utils/generate-app-id'
import {getSelectedAsset} from './asset'

const DESKTOP_FILE_PROPERTY_CONFIG: {[propertyName: string]: 'name' | 'exec'} = {
	['Name']: 'name',
	['Exec']: 'exec'
}

export const getGameFromDesktopFile = async (path: string): Promise<TGame> => {
	const propertyNameRegex = '^\\w*'
	const valuePropertyRegex = '=.+$'
	const game: TGame = {id: '', name: '', exec: '', path: '', collections: []}
	const fileData = await getTextFileData(path)

	for (const line of fileData.split('\n')) {
		const isLineWithAssignedValue = line.match(`${propertyNameRegex}${valuePropertyRegex}`)
		if (!isLineWithAssignedValue) {
			continue
		}
		const propertyName = line.match(propertyNameRegex)?.[0]
		const gameProperty = DESKTOP_FILE_PROPERTY_CONFIG[propertyName ?? '']
		const value = line.match(valuePropertyRegex)?.[0].replace('=', '')

		if (propertyName && value && gameProperty) {
			game[gameProperty] = value
		}
	}

	game.id = generateShortAppId(game.path ?? '', game.name)

	return game
}

export const getCachedGames = (): TGame[] => {
	const cachedGamesLocalStorage = localStorage.getItem(ELocalStorageKey.CACHED_GAMES)
	if (cachedGamesLocalStorage) {
		return JSON.parse(cachedGamesLocalStorage) as TGame[]
	}
	return []
}

export const isCachedGame = (gameId: string) => {
	return getCachedGames().some((cachedGame) => cachedGame.id === gameId)
}

export const getCachedGame = (gameId: string) => {
	return getCachedGames().find((cachedGame) => cachedGame.id === gameId)
}

/**
 * Returns a TGameAssetCollection with infered selection based on localStorage
 */
export const getAssetsWithPreSelection = (
	gameId: string,
	gameAssets: TGameAssetCollection | undefined
): TGameAssetCollection | undefined => {
	if (!gameAssets) {
		return
	}

	let newAssets: TGameAssetCollection = {...gameAssets}
	const cachedGame = getCachedGame(gameId)

	for (const assetType of Object.keys(EAssetType) as EAssetType[]) {
		const selectedAssetCache = getSelectedAsset({assets: cachedGame?.assets?.[assetType] ?? []})

		if (selectedAssetCache) {
			newAssets = {
				...newAssets,
				[assetType]: newAssets[assetType].map((asset) => ({
					...asset,
					isSelected: selectedAssetCache?.id === asset.id,
					isDownloaded: selectedAssetCache?.id === asset.id
				}))
			}
		}
	}

	return newAssets
}

export const getGameSearchTerm = (game: TGame) => {
	const cachedGame = getCachedGame(game.id)

	return game.searchTerm ?? cachedGame?.searchTerm ?? game.name
}
