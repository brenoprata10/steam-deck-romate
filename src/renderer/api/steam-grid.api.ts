import * as Electron from 'electron'
import EChannel from 'main/enums/EChannel'
import TApiSteamGridSearch from 'renderer/types/TApiSteamGridSearch'
import TApiSteamGridAssets from 'renderer/types/TApiSteamGridAssets'
import ESteamGridAssetType from 'renderer/enums/ESteamGridAssetType'
import EAssetType from 'renderer/enums/EAssetType'
import TGameAssetCollection from 'renderer/types/TGameAssetCollection'
import TBaseApiSteamGrid from 'renderer/types/TBaseApiSteamGrid'

export const getGameIdByName = async ({
	gameName: gameName,
	apiKey
}: {
	gameName: string
	apiKey: string
}): Promise<number | null> => {
	const response = await steamGridRequest<TApiSteamGridSearch>({
		url: `/search/autocomplete/${encodeURIComponent(gameName)}`,
		apiKey
	})

	if (response.success && response.data.length > 0) {
		return response.data[0].id
	}

	return null
}

export const getGameAssetsByName = async ({
	gameName,
	apiKey
}: {
	gameName: string
	apiKey: string
}): Promise<TGameAssetCollection | undefined> => {
	const gameId = await getGameIdByName({gameName, apiKey})
	if (!gameId) {
		console.warn(`Could not fetch id for game '${gameName}'`)
		console.groupEnd()
		return
	}
	console.log(`Fetching Game Assets for: ${gameName}`)
	const [gridsResponse, heroesResponse, logosResponse, iconsResponse] = await Promise.all([
		getGameAssetById({gameId, assetType: ESteamGridAssetType.GRIDS, apiKey, params: 'mimes=image/png'}),
		getGameAssetById({gameId, assetType: ESteamGridAssetType.HEROES, apiKey, params: 'mimes=image/png'}),
		getGameAssetById({gameId, assetType: ESteamGridAssetType.LOGOS, apiKey}),
		getGameAssetById({gameId, assetType: ESteamGridAssetType.ICONS, apiKey})
	])

	const grids = gridsResponse.success ? gridsResponse.data : []
	const supportedHorizontalGrids = grids?.filter(
		(grid) => (grid.width === 460 && grid.height === 215) || (grid.width === 920 && grid.height === 430)
	)
	const heroes = heroesResponse.success ? heroesResponse.data : []
	const logos = logosResponse.success ? logosResponse.data : []
	const icons = iconsResponse.success ? iconsResponse.data : []

	return {
		[EAssetType.LOGO]: logos,
		[EAssetType.LIBRARY]: grids?.filter((grid) => grid.width === 600 && grid.height === 900),
		[EAssetType.GRID]: supportedHorizontalGrids.length > 0 ? supportedHorizontalGrids : heroes,
		[EAssetType.HERO]: heroes.length > 0 ? heroes : supportedHorizontalGrids,
		[EAssetType.ICON]: icons
	}
}

export const getGameAssetById = ({
	gameId,
	assetType,
	apiKey,
	params
}: {
	gameId: number
	assetType: ESteamGridAssetType
	apiKey: string
	params?: string
}) => {
	return steamGridRequest<TApiSteamGridAssets>({
		url: `/${assetType}/game/${gameId}${params ? `?${params}` : ''}`,
		apiKey
	})
}

export const steamGridRequest = async <T>({url, apiKey}: {url: string; apiKey: string}): Promise<T> => {
	try {
		const response = (await Electron.ipcRenderer.invoke(EChannel.STEAM_GRID_REQUEST, {
			url,
			apiKey
		})) as TBaseApiSteamGrid<Record<string, unknown>>
		if (!response.success) {
			throw Error(JSON.stringify(response.error))
		}
		return response as unknown as T
	} catch (error: any) {
		throw Error(String(error))
	}
}
