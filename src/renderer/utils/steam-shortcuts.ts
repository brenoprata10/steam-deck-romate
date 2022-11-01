import {readVdf, VdfMap, writeVdf} from 'steam-binary-vdf'
import {homedir} from 'os'
import path from 'path'
import {getBufferFileData} from 'renderer/utils/files'
import fsPromise from 'fs/promises'

export const getSteamGridAssetsFolderPath = (steamId: string) => {
	return path.join(homedir(), `.steam/steam/userdata/${steamId}/config/grid`)
}

const getShortcutsPath = (steamId: string): string => {
	return path.join(homedir(), `.steam/steam/userdata/${steamId}/config/shortcuts.vdf`)
}

export const getSteamShortcuts = async ({steamUserId}: {steamUserId: string}): Promise<VdfMap> => {
	const buffer = await getBufferFileData(getShortcutsPath(steamUserId))
	return readVdf(buffer)
}

export const saveSteamShortcuts = async ({shortcuts, steamUserId}: {shortcuts: VdfMap; steamUserId: string}) => {
	const outBuffer = writeVdf(shortcuts)

	await fsPromise.writeFile(getShortcutsPath(steamUserId), outBuffer)
}
