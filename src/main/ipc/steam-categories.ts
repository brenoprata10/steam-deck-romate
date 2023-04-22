import TSteamCategory from '../types/TSteamCategory'
import {homedir} from 'os'
import path from 'path'
import SteamCat from 'steam-categories'
import EChannel from '../enums/EChannel'
import ESteamUserDataPath from '../enums/ESteamUserDataPath'
import {ipcMain} from 'electron'

type TSteamCat = {
	read: () => Promise<{test: string}>
	get: (collection: string) => TSteamCategory
	list: () => string[]
	add: (key: string, collection: TSteamCategory['value']) => void
	close: () => Promise<void>
	save: () => Promise<void>
}

export const ipcHandleFetchSteamCategories = (ipcMain: Electron.IpcMain) => {
	ipcMain.handle(EChannel.FETCH_STEAM_USER_COLLECTIONS, async (_, ...args) => {
		const steamCat = getSteamCollectionObject({userSteamId: args[0] as string})
		await steamCat.read()

		const userCollections: TSteamCategory[] = []

		for (const collectionKey of steamCat.list() as unknown as string[]) {
			const value = steamCat.get(collectionKey)
			if (value && !value?.is_deleted) {
				userCollections.push(value)
			}
		}
		await steamCat.close()
		return userCollections
	})
}

export const ipcHandleSaveSteamCategory = (ipcMain: Electron.IpcMain) => {
	ipcMain.handle(EChannel.SAVE_STEAM_COLLECTION, async (_, ...args) => {
		const userSteamId = args[0] as string
		const collectionData = args[1] as {key: string; value: TSteamCategory['value']}
		const steamCat = getSteamCollectionObject({userSteamId})
		await steamCat.read()

		steamCat.add(collectionData.key, collectionData.value)

		await steamCat.save()
		await steamCat.close()
	})
}

export const ipcHandleIsSteamCategoriesReady = (ipcMain: Electron.IpcMain) => {
	ipcMain.handle(EChannel.IS_STEAM_CATEGORIES_READY, async (_, ...args) => {
		try {
			const userSteamId = args[0] as string
			const steamCat = getSteamCollectionObject({userSteamId})
			await steamCat.read()
			await steamCat.close()
			return true
		} catch (error) {
			console.log(error)
			return false
		}
	})
}

const getSteamCollectionObject = ({userSteamId}: {userSteamId: string}) => {
	const steamRootPath = path.join(homedir(), ESteamUserDataPath.LINUX)
	const levelDBPath = path.join(steamRootPath, 'config', 'htmlcache', 'Local Storage', 'leveldb')
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
	return new SteamCat(levelDBPath, userSteamId) as TSteamCat
}
