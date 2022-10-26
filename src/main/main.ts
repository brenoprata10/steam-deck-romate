/* eslint global-require: off, no-console: off, @typescript-eslint/no-unsafe-assignment: off, @typescript-eslint/no-unsafe-assignment: off, @typescript-eslint/no-var-requires: off, @typescript-eslint/no-unsafe-member-access: off, @typescript-eslint/no-unsafe-call: off, @typescript-eslint/no-unsafe-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path'
import {app, BrowserWindow, shell, ipcMain, dialog, FileFilter} from 'electron'
import {autoUpdater} from 'electron-updater'
import log from 'electron-log'
import MenuBuilder from './menu'
import {resolveHtmlPath} from './util'
import EChannel from './enums/EChannel'

class AppUpdater {
	constructor() {
		log.transports.file.level = 'info'
		autoUpdater.logger = log
		void autoUpdater.checkForUpdatesAndNotify()
	}
}

let mainWindow: BrowserWindow | null = null

ipcMain.handle(EChannel.SELECT_FOLDER, async (_, arg: string) => {
	return dialog.showOpenDialog({title: arg, properties: ['openDirectory']})
})

ipcMain.handle(EChannel.SELECT_MULTIPLE_FILES, async (_, ...args: Array<string>) => {
	const extensions = args.slice(1)
	return dialog.showOpenDialog({
		title: args[0],
		properties: ['openFile', 'multiSelections'],
		filters: [{name: extensions.join(', '), extensions: args.slice(1)}]
	})
})

if (process.env.NODE_ENV === 'production') {
	const sourceMapSupport = require('source-map-support')
	sourceMapSupport.install()
}

const isDebug = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true'

if (isDebug) {
	require('electron-debug')()
}

const installExtensions = async () => {
	const installer = require('electron-devtools-installer')
	const forceDownload = !!process.env.UPGRADE_EXTENSIONS
	const extensions = ['REACT_DEVELOPER_TOOLS']

	return await installer
		.default(
			extensions.map((name) => installer[name]),
			forceDownload
		)
		.catch(console.log)
}

const createWindow = async () => {
	if (isDebug) {
		await installExtensions()
	}

	const RESOURCES_PATH = app.isPackaged
		? path.join(process.resourcesPath, 'assets')
		: path.join(__dirname, '../../assets')

	const getAssetPath = (...paths: string[]): string => {
		return path.join(RESOURCES_PATH, ...paths)
	}

	mainWindow = new BrowserWindow({
		show: false,
		width: 1024,
		height: 728,
		icon: getAssetPath('icon.png'),
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false
		}
	})

	void mainWindow.loadURL(resolveHtmlPath('index.html'))

	mainWindow.on('ready-to-show', () => {
		if (!mainWindow) {
			throw new Error('"mainWindow" is not defined')
		}
		if (process.env.START_MINIMIZED) {
			mainWindow.minimize()
		} else {
			mainWindow.show()
		}
	})

	mainWindow.on('closed', () => {
		mainWindow = null
	})

	const menuBuilder = new MenuBuilder(mainWindow)
	menuBuilder.buildMenu()

	// Open urls in the user's browser
	mainWindow.webContents.setWindowOpenHandler((edata) => {
		void shell.openExternal(edata.url)
		return {action: 'deny'}
	})

	// Remove this if your app does not use auto updates
	// eslint-disable-next-line
	new AppUpdater()
}

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
	// Respect the OSX convention of having the application in memory even
	// after all windows have been closed
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app
	.whenReady()
	.then(() => {
		void createWindow()
		app.on('activate', () => {
			// On macOS it's common to re-create a window in the app when the
			// dock icon is clicked and there are no other windows open.
			if (mainWindow === null) {
				void createWindow()
			}
		})
	})
	.catch(console.log)
