import * as Electron from 'electron'
import EChannel from 'main/enums/EChannel'

type TFolderPath = {
	canceled: boolean
	filePaths: string[]
}

const useSelectFolder = (title: string): {trigger: () => Promise<TFolderPath>} => {
	return {trigger: () => Electron.ipcRenderer.invoke(EChannel.SELECT_FOLDER, title)}
}

export default useSelectFolder
