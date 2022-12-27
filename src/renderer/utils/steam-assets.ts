import EAssetType from 'renderer/enums/EAssetType'
import TGame from 'renderer/types/TGame'
import {getSteamLocalConfigData} from 'renderer/utils/steam-shortcuts'
import STEAM_APPS from '../../../assets/steam-apps.json'

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
	const steamApps = STEAM_APPS as {applist: {apps: Array<{appid: number; name: string}>}}

	return (
		Object.keys(localConfigData.UserLocalConfigStore.Software.Valve.Steam.apps)
			.map((appId) => ({
				id: appId,
				name: steamApps.applist.apps.find((steamApp) => steamApp.appid.toString() === appId)?.name ?? '',
				collections: ['Steam Games'],
				isExcluded: true
			}))
			// Filter out undetected games
			.filter((game) => game.name)
	)
}
