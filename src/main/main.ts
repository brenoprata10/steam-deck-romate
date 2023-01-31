/* eslint global-require: off, no-console: off, @typescript-eslint/no-unsafe-assignment: off, @typescript-eslint/no-unsafe-assignment: off, @typescript-eslint/no-var-requires: off, @typescript-eslint/no-unsafe-member-access: off, @typescript-eslint/no-unsafe-call: off, @typescript-eslint/no-unsafe-return: off */
import path from 'path'
import {app, BrowserWindow, ipcMain, shell} from 'electron'
import {autoUpdater} from 'electron-updater'
import log from 'electron-log'
import MenuBuilder from './menu'
import {resolveHtmlPath} from './util'
import contextMenu from 'electron-context-menu'
import {initIpcHandle} from './ipc'
import {ipcHandleAutoUpdater} from './ipc/auto-updater'

contextMenu({})

class AppUpdater {
	constructor() {
		log.transports.file.level = 'info'
		autoUpdater.logger = log
		void autoUpdater.checkForUpdatesAndNotify()
	}
}

let mainWindow: BrowserWindow | null = null

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
		width: 1280,
		height: 720,
		autoHideMenuBar: true,
		center: true,

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

	ipcHandleAutoUpdater(mainWindow)

	new AppUpdater()
}

initIpcHandle({ipcMain})

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
