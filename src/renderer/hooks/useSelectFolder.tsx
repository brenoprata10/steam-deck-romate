import * as Electron from 'electron'
import EChannel from 'main/enums/EChannel'
import {TFolderPath} from 'renderer/types/TFilePath'

const useSelectFolder = (title: string): {trigger: () => Promise<TFolderPath>} => {
	return {trigger: () => Electron.ipcRenderer.invoke(EChannel.SELECT_FOLDER, title)}
}

export default useSelectFolder
