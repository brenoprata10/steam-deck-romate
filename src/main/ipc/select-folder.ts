import EChannel from '../enums/EChannel'
import {dialog} from 'electron'

export const ipcHandleSelectFolder = (ipcMain: Electron.IpcMain) =>
	ipcMain.handle(EChannel.SELECT_FOLDER, async (_, arg: string) => {
		return dialog.showOpenDialog({title: arg, properties: ['openDirectory']})
	})
