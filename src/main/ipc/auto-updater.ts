import {BrowserWindow} from 'electron'
import {autoUpdater} from 'electron-updater'
import log from 'electron-log'
import EChannel from '../enums/EChannel'

export const ipcHandleAutoUpdater = (mainWindow: BrowserWindow | null) => {
	function sendStatusToWindow(text: string) {
		log.info(text)
		mainWindow?.webContents.send(EChannel.AUTO_UPDATER, text)
	}

	autoUpdater.on('checking-for-update', () => {
		sendStatusToWindow('Checking for update...')
	})
	autoUpdater.on('update-available', () => {
		sendStatusToWindow('Update available.')
	})
	autoUpdater.on('update-not-available', () => {
		sendStatusToWindow('Update not available.')
	})
	autoUpdater.on('error', (err) => {
		sendStatusToWindow(`Error in auto-updater. ${err.message}`)
	})
	autoUpdater.on('download-progress', (progressObj) => {
		let log_message = `Download speed: ${progressObj.bytesPerSecond}`
		log_message = `log_message - Downloaded ${progressObj.percent}%`
		log_message = `log_message (${progressObj.transferred}/${progressObj.total})`
		sendStatusToWindow(log_message)
	})
	autoUpdater.on('update-downloaded', () => {
		sendStatusToWindow('Update downloaded.')
	})
}
