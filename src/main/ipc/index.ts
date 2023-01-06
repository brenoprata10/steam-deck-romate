import {ipcHandleDownloadAsset} from './download-asset'
import {ipcHandlePlatform} from './platform'
import {ipcHandleSelectFolder} from './select-folder'
import {ipcHandleSelectMultipleFiles} from './select-multiple-files'
import {ipcHandleSteamGridRequest} from './steam-grid-request'

export const initIpcHandle = (ipcMain: Electron.IpcMain) => {
	ipcHandleDownloadAsset(ipcMain)
	ipcHandleSelectFolder(ipcMain)
	ipcHandleSelectMultipleFiles(ipcMain)
	ipcHandleSteamGridRequest(ipcMain)
	ipcHandlePlatform(ipcMain)
}
