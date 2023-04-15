import EChannel from 'main/enums/EChannel'
import * as Electron from 'electron'
import TSteamCategory from 'main/types/TSteamCategory'

export const getCategoriesByUser = ({steamUserId}: {steamUserId: string}) =>
	Electron.ipcRenderer.invoke(EChannel.FETCH_STEAM_USER_COLLECTIONS, steamUserId) as Promise<TSteamCategory[]>

export const saveCategoryByUser = ({
	steamUserId,
	collection
}: {
	steamUserId: string
	collection: {key: string; value: TSteamCategory['value']}
}) => Electron.ipcRenderer.invoke(EChannel.SAVE_STEAM_COLLECTION, steamUserId, collection) as Promise<void>

export const isSteamCategoriesReady = ({steamUserId}: {steamUserId: string}) =>
	Electron.ipcRenderer.invoke(EChannel.IS_STEAM_CATEGORIES_READY, steamUserId) as Promise<boolean>
