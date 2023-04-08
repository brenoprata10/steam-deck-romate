import {readVdf, VdfMap, writeVdf} from 'steam-binary-vdf'
import {homedir} from 'os'
import path from 'path'
import {getBufferFileData, getFolderContents, getTextFileData} from 'renderer/utils/files'
import fsPromise from 'fs/promises'
import TUserData from 'renderer/types/TUserData'
import VDF from 'vdf-parser'
import TSteamLocalConfig from 'renderer/types/TSteamLocalConfig'
import EPlatform from 'main/enums/EPlatform'
import {getPlatform} from 'renderer/utils/platform'
import ESteamUserDataPath from 'main/enums/ESteamUserDataPath'

const STEAM_AVATAR_AKAMAI_URL = 'https://avatars.akamai.steamstatic.com'

export const getSteamPathConfig = async (
	steamId?: string | null
): Promise<
	| {
			hasSteamId: true
			userDataDirectory: string
			shortcutsFile: string
			localConfigFile: string
			assetsDirectory: string
	  }
	| {hasSteamId: false; userDataDirectory: string}
> => {
	const platform = await getPlatform()
	const isWindows = platform === EPlatform.WINDOWS

	const userDataDirectory = isWindows
		? path.join(ESteamUserDataPath.WINDOWS, 'userdata')
		: path.join(homedir(), ESteamUserDataPath.LINUX, 'userdata')

	if (!steamId) {
		return {hasSteamId: false, userDataDirectory}
	}

	return {
		hasSteamId: true,
		userDataDirectory,
		assetsDirectory: path.join(userDataDirectory, steamId, 'config', 'grid'),
		shortcutsFile: path.join(userDataDirectory, steamId, 'config', 'shortcuts.vdf'),
		localConfigFile: path.join(userDataDirectory, steamId, 'config', 'localconfig.vdf')
	}
}

export const getSteamLocalConfigData = async (userId: string): Promise<TSteamLocalConfig> => {
	const steamPathConfig = await getSteamPathConfig(userId)
	if (steamPathConfig.hasSteamId) {
		const localConfigPath = steamPathConfig.localConfigFile
		const localConfigData = await getTextFileData(localConfigPath)
		return VDF.parse(localConfigData) as TSteamLocalConfig
	}
	throw Error('User ID is not available.')
}

export const getAvailableUserAccounts = async (): Promise<TUserData[]> => {
	const steamPathConfig = await getSteamPathConfig()
	const usersId = getFolderContents(steamPathConfig.userDataDirectory)
	const users: TUserData[] = usersId.map((userId) => ({
		id: userId.name
	}))

	for (const user of users) {
		try {
			const localConfigData = await getSteamLocalConfigData(user.id)
			const userData = localConfigData.UserLocalConfigStore.friends[user.id]
			user.name = userData.name ?? userData.NameHistory?.[0]
			user.avatarPictureSrc = `${STEAM_AVATAR_AKAMAI_URL}/${userData.avatar}_full.jpg`
		} catch (error) {
			console.error(`Could not load localconfig.vdf file for user: ${user.id}`)
		}
	}

	return users
}

export const getSteamShortcuts = async ({
	steamUserId
}: {
	steamUserId: string
}): Promise<{shortcuts: {[id: string]: VdfMap}}> => {
	try {
		const steamPathConfig = await getSteamPathConfig(steamUserId)
		if (steamPathConfig.hasSteamId) {
			const buffer = await getBufferFileData(steamPathConfig.shortcutsFile)
			return readVdf(buffer) as {shortcuts: {[id: string]: VdfMap}}
		}
		throw Error('User ID is not available.')
	} catch (error) {
		console.warn('Could not locate shortcuts.vdf file.')
		return {shortcuts: {}}
	}
}

export const saveSteamShortcuts = async ({shortcuts, steamUserId}: {shortcuts: VdfMap; steamUserId: string}) => {
	const outBuffer = writeVdf(shortcuts)

	const steamPathConfig = await getSteamPathConfig(steamUserId)
	if (steamPathConfig.hasSteamId) {
		await fsPromise.writeFile(steamPathConfig.shortcutsFile, outBuffer)
		return
	}
	throw Error('User ID is not available.')
}
