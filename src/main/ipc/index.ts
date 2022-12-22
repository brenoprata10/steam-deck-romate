import {ipcHandleDownloadAsset} from './download-asset'
import {ipcHandleSelectFolder} from './select-folder'
import {ipcHandleSelectMultipleFiles} from './select-multiple-files'
import {ipcHandleSteamGridRequest} from './steam-grid-request'

export const initIpcHandle = () => {
	ipcHandleDownloadAsset()
	ipcHandleSelectFolder()
	ipcHandleSelectMultipleFiles()
	ipcHandleSteamGridRequest()
}
