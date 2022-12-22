import EAssetType from 'renderer/enums/EAssetType'
import TGame from 'renderer/types/TGame'
import {getSteamLocalConfigData} from 'renderer/utils/steam-shortcuts'

export const getAssetFileName = (shortAppId: number | string, extension: string) => {
	return {
		[EAssetType.GRID]: `${shortAppId}.${extension}`,
		[EAssetType.HERO]: `${shortAppId}_hero.${extension}`,
		[EAssetType.LIBRARY]: `${shortAppId}p.${extension}`,
		[EAssetType.LOGO]: `${shortAppId}_logo.${extension}`,
		[EAssetType.ICON]: `${shortAppId}i.${extension}`
	}
}

export const getSteamGamesByUserId = async (userId: string): Promise<TGame[]> => {
	const localConfigData = await getSteamLocalConfigData(userId)
	return Object.keys(localConfigData.UserLocalConfigStore.Software.Valve.Steam.apps).map((appId) => ({
		id: appId,
		name: 'Something',
		collections: ['Steam Games']
	}))
}
