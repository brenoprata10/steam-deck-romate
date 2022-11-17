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
	const users: TUserData[] = usersId.map((userId) => ({
		id: userId
	}))

	for (const user of users) {
		try {
			const localConfigData = await getTextFileData(getLocalConfigPath(user.id))
			let hasReachedProfileObject = false

			for (const line of localConfigData.split('\n')) {
				if (user.name && user.avatarPictureSrc) {
					break
				}
				if (line.match('\\d+')?.[0] === user.id) {
					hasReachedProfileObject = true
				}
				const isPersonaNameLine = line.match('PersonaName')?.[0]
				const isAvatarLine = line.match('avatar')?.[0]
				if (!user.name && isPersonaNameLine) {
					user.name = line.match(lineValuesRegex)?.pop()
				}
				if (!user.avatarPictureSrc && isAvatarLine && hasReachedProfileObject) {
					const avatarId = line.match(lineValuesRegex)?.pop()
					user.avatarPictureSrc = avatarId ? `${STEAM_AVATAR_AKAMAI_URL}/${avatarId}_full.jpg` : 'Not available'
				}
			}
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
