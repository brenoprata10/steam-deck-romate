import EChannel from '../enums/EChannel'
import {dialog} from 'electron'

export const ipcHandleSelectMultipleFiles = (ipcMain: Electron.IpcMain) =>
	ipcMain.handle(EChannel.SELECT_MULTIPLE_FILES, async (_, ...args: Array<string>) => {
		const extensions = args.slice(1)
		return dialog.showOpenDialog({
			title: args[0],
			properties: ['openFile', 'multiSelections'],
			filters: [{name: extensions.join(', '), extensions: args.slice(1)}]
		})
	})
