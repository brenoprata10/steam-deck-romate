import {ipcRenderer} from 'electron'
import EChannel from 'main/enums/EChannel'
import EPlatform from 'main/enums/EPlatform'

export const getPlatform = async (): Promise<EPlatform> => (await ipcRenderer.invoke(EChannel.PLATFORM)) as EPlatform
