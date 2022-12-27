import axios from 'axios'
import {BrowserWindow} from 'electron'
import {download} from 'electron-dl'
import EChannel from '../enums/EChannel'

export const ipcHandleDownloadAsset = (ipcMain: Electron.IpcMain) =>
	ipcMain.handle(EChannel.DOWNLOAD_ASSET, async (_, ...args) => {
		const {url, directory, fileName: filename} = args[0] as {url: string; directory: string; fileName: string}
		try {
			const win = BrowserWindow.getFocusedWindow()
			if (win) {
				console.log(await download(win, url, {directory, filename, saveAs: false, overwrite: true}))
			}
		} catch (error) {
			console.log(error)
			if (axios.isAxiosError(error) && error.response) {
				return {error: {status: error.response.status, statusText: error.response.statusText}}
			}
		}
	})
