import {BrowserWindow} from 'electron'
import {ipcHandleAutoUpdater} from './auto-updater'
import {ipcHandleDownloadAsset} from './download-asset'
import {ipcHandlePlatform} from './platform'
import {ipcHandleSelectFolder} from './select-folder'
import {ipcHandleSelectMultipleFiles} from './select-multiple-files'
import {ipcHandleSteamGridRequest} from './steam-grid-request'

export const initIpcHandle = ({ipcMain, mainWindow}: {ipcMain: Electron.IpcMain; mainWindow: BrowserWindow | null}) => {
	ipcHandleDownloadAsset(ipcMain)
	ipcHandleSelectFolder(ipcMain)
	ipcHandleSelectMultipleFiles(ipcMain)
	ipcHandleSteamGridRequest(ipcMain)
	ipcHandlePlatform(ipcMain)
	ipcHandleAutoUpdater(mainWindow)
}
