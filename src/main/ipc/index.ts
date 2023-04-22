import {ipcHandleDownloadAsset} from './download-asset'
import {ipcHandlePlatform} from './platform'
import {ipcHandleSelectFolder} from './select-folder'
import {ipcHandleSelectMultipleFiles} from './select-multiple-files'
import {
	ipcHandleFetchSteamCategories,
	ipcHandleIsSteamCategoriesReady,
	ipcHandleSaveSteamCategory
} from './steam-categories'
import {ipcHandleSteamGridRequest} from './steam-grid-request'

export const initIpcHandle = ({ipcMain}: {ipcMain: Electron.IpcMain}) => {
	ipcHandleDownloadAsset(ipcMain)
	ipcHandleSelectFolder(ipcMain)
	ipcHandleSelectMultipleFiles(ipcMain)
	ipcHandleSteamGridRequest(ipcMain)
	ipcHandlePlatform(ipcMain)
	ipcHandleFetchSteamCategories(ipcMain)
	ipcHandleSaveSteamCategory(ipcMain)
	ipcHandleIsSteamCategoriesReady(ipcMain)
}
