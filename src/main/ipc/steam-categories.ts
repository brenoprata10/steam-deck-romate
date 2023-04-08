import {homedir} from 'os'
import path from 'path'
import SteamCat from 'steam-categories'
import EChannel from '../enums/EChannel'
import ESteamUserDataPath from '../enums/ESteamUserDataPath'

type TSteamCat = {
	read: () => Promise<{test: string}>
	get: (collection: string) => {test: string}[]
	list: () => string[]
	close: () => Promise<void>
}

export const ipcHandleFetchSteamCategories = (ipcMain: Electron.IpcMain) => {
	ipcMain.handle(EChannel.FETCH_STEAM_USER_COLLECTIONS, async (_, ...args) => {
		const steamRootPath = path.join(homedir(), ESteamUserDataPath.LINUX)
		const userSteamId = args[0] as string
		const levelDBPath = path.join(steamRootPath, 'config', 'htmlcache', 'Local Storage', 'leveldb')
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
		const steamCat: TSteamCat = new SteamCat(levelDBPath, userSteamId)
		const collections = await steamCat.read()
		for (const collection of steamCat.list() as unknown as string[]) {
			const testCollection = steamCat.get(collection)
			console.log({collection, value: testCollection})
		}
		await steamCat.close()
		/*	steamCat.add('someUniqueKey', {
			name: 'Super Cool Collection',
			added: [10, 220, 379720]
		})

		// Save collections
		steamCat.save().then(() => {
			console.info('yay!')
			// Close the database when you're done
			steamCat.close().then(() => {
				console.info('Database closed, safe to open Steam again.')
			})
		})*/
	})
}
