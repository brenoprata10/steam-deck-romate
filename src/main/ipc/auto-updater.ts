import {BrowserWindow} from 'electron'
import {autoUpdater} from 'electron-updater'
import log from 'electron-log'
import EChannel from '../enums/EChannel'
import EAutoUpdaterMessage from '../enums/EAutoUpdaterMessage'
import TAutoUpdaterMessage from '../types/TAutoUpdaterMessage'

export const ipcHandleAutoUpdater = (mainWindow: BrowserWindow | null) => {
	function sendStatusToWindow(message: TAutoUpdaterMessage) {
		log.info(`${message.status} - ${message.text ?? ''}`)
		mainWindow?.webContents.send(EChannel.AUTO_UPDATER, message)
	}

	autoUpdater.on('checking-for-update', () => {
		sendStatusToWindow({status: EAutoUpdaterMessage.CHECKING_UPDATE})
	})
	autoUpdater.on('update-available', () => {
		sendStatusToWindow({status: EAutoUpdaterMessage.UPDATE_AVAILABLE})
	})
	autoUpdater.on('update-not-available', () => {
		sendStatusToWindow({status: EAutoUpdaterMessage.UPDATE_NOT_AVAILABLE})
	})
	autoUpdater.on('error', (err) => {
		sendStatusToWindow({status: EAutoUpdaterMessage.ERROR, text: `Error in auto-updater. ${err.message}`})
	})
	autoUpdater.on('download-progress', (progressObj) => {
		const megabytesPerSecond = progressObj.bytesPerSecond / 1000000
		sendStatusToWindow({
			status: EAutoUpdaterMessage.DOWNLOAD_IN_PROGRESS,
			text: `Downloaded ${Math.round(progressObj.percent)}% (${megabytesPerSecond.toFixed(2)} MB/s)`
		})
	})
	autoUpdater.on('update-downloaded', () => {
		sendStatusToWindow({status: EAutoUpdaterMessage.UPDATE_DOWNLOADED})
		autoUpdater.quitAndInstall()
	})
}
