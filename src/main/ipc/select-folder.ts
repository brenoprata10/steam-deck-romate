import {ipcMain} from 'electron/main'
import EChannel from '../enums/EChannel'
import {dialog} from 'electron'

export const ipcHandleSelectFolder = () =>
	ipcMain.handle(EChannel.SELECT_FOLDER, async (_, arg: string) => {
		return dialog.showOpenDialog({title: arg, properties: ['openDirectory']})
	})
