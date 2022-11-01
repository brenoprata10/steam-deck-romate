import {readVdf, VdfMap, writeVdf} from 'steam-binary-vdf'
import {homedir} from 'os'
import path from 'path'
import {getBufferFileData, getFileNamesFromFolder, getTextFileData} from 'renderer/utils/files'
import fsPromise from 'fs/promises'
import TUserData from 'renderer/types/TUserData'

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

export const getAvailableUserAccounts = async (): Promise<TUserData[]> => {
	const lineValuesRegex = new RegExp('[\\w\\s_\\-?/.><,:;|[{\\]}+!@#$%^&*()=]+', 'mg')
	const usersId = getFileNamesFromFolder(getUserAccountsPath())
	const users: TUserData[] = []

	for (const userId of usersId) {
		const localConfigData = await getTextFileData(getLocalConfigPath(userId))
		let name, avatarPictureSrc

		for (const line of localConfigData.split('\n')) {
			const isPersonaNameLine = line.match('PersonaName')?.[0]
			const isAvatarLine = line.match('avatar')?.[0]
			if (!name && isPersonaNameLine) {
				name = line.match(lineValuesRegex)?.pop()
			}
			if (!avatarPictureSrc && isAvatarLine) {
				const avatarId = line.match(lineValuesRegex)?.pop()
				avatarPictureSrc = avatarId ? `${STEAM_AVATAR_AKAMAI_URL}/${avatarId}_medium.jpg` : 'Not available'
			}
		}
		users.push({id: userId, name, avatarPictureSrc})
	}

	console.log(users)
	return users
}

export const getSteamShortcuts = async ({steamUserId}: {steamUserId: string}): Promise<VdfMap> => {
	const buffer = await getBufferFileData(getShortcutsPath(steamUserId))
	return readVdf(buffer)
}

export const saveSteamShortcuts = async ({shortcuts, steamUserId}: {shortcuts: VdfMap; steamUserId: string}) => {
	const outBuffer = writeVdf(shortcuts)

	await fsPromise.writeFile(getShortcutsPath(steamUserId), outBuffer)
}
