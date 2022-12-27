import EChannel from '../enums/EChannel'
import axios from 'axios'
import {AxiosRequestConfig} from 'axios'

export const ipcHandleSteamGridRequest = (ipcMain: Electron.IpcMain) =>
	ipcMain.handle(EChannel.STEAM_GRID_REQUEST, async (_, ...args) => {
		const {url, apiKey, options = {}} = args[0] as {url: string; apiKey: string; options?: AxiosRequestConfig}
		try {
			const response = await axios(`https://www.steamgriddb.com/api/v2${url}`, {
				...options,
				headers: {...(options.headers ?? {}), Authorization: `Bearer ${apiKey}`}
			})

			return response.data as unknown
		} catch (error) {
			console.log(error)
			if (axios.isAxiosError(error) && error.response) {
				return {success: false, error: {status: error.response.status, statusText: error.response.statusText}}
			}
		}
	})
