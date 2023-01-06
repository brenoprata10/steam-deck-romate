import EChannel from '../enums/EChannel'

export const ipcHandlePlatform = (ipcMain: Electron.IpcMain) =>
	ipcMain.handle(EChannel.PLATFORM, () => {
		return process.platform
	})
