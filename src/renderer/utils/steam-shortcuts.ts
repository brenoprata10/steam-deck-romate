import {readVdf, VdfMap, writeVdf} from 'steam-binary-vdf'
import {homedir} from 'os'
import path from 'path'
import {getBufferFileData, getFileNamesFromFolder, getTextFileData} from 'renderer/utils/files'
import fsPromise from 'fs/promises'
import TUserData from 'renderer/types/TUserData'
import VDF from 'vdf-parser'
import TSteamLocalConfig from 'renderer/types/TSteamLocalConfig'

const STEAM_USER_DATA_PATH = '.steam/steam/userdata'
const STEAM_AVATAR_AKAMAI_URL = 'https://avatars.akamai.steamstatic.com'

export const getSteamGridAssetsFolderPath = (steamId: string) => {
	return path.join(homedir(), `${STEAM_USER_DATA_PATH}/${steamId}/config/grid`)
}

const getShortcutsPath = (steamId: string) => {
	return path.join(homedir(), `${STEAM_USER_DATA_PATH}/${steamId}/config/shortcuts.vdf`)
}

const getLocalConfigPath = (steamId: string) => {
	return path.join(homedir(), `${STEAM_USER_DATA_PATH}/${steamId}/config/localconfig.vdf`)
}

const getUserAccountsPath = () => {
	return path.join(homedir(), STEAM_USER_DATA_PATH)
}

export const getSteamLocalConfigData = async (userId: string): Promise<TSteamLocalConfig> => {
	const localConfigData = await getTextFileData(getLocalConfigPath(userId))
	return VDF.parse(localConfigData) as TSteamLocalConfig
}

export const getAvailableUserAccounts = async (): Promise<TUserData[]> => {
	const usersId = getFileNamesFromFolder(getUserAccountsPath())
	const users: TUserData[] = usersId.map((userId) => ({
		id: userId
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
		const buffer = await getBufferFileData(getShortcutsPath(steamUserId))
		return readVdf(buffer) as {shortcuts: {[id: string]: VdfMap}}
	} catch (error) {
		console.warn('Could not locate shortcuts.vdf file.')
		return {shortcuts: {}}
	}
}

export const saveSteamShortcuts = async ({shortcuts, steamUserId}: {shortcuts: VdfMap; steamUserId: string}) => {
	const outBuffer = writeVdf(shortcuts)

	await fsPromise.writeFile(getShortcutsPath(steamUserId), outBuffer)
}
