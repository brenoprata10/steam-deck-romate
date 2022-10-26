import * as Electron from 'electron'
import EChannel from 'main/enums/EChannel'
import {TFolderPath} from 'renderer/types/TFilePath'

const useSelectMultipleFiles = ({
	title,
	extensions = []
}: {
	title: string
	extensions: string[]
}): {trigger: () => Promise<TFolderPath>} => {
	return {trigger: () => Electron.ipcRenderer.invoke(EChannel.SELECT_MULTIPLE_FILES, title, ...extensions)}
}

export default useSelectMultipleFiles
