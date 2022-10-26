import fs from 'fs'
import fsPromise from 'fs/promises'

export const getFileNamesFromFolder = (folderPath: string): string[] => {
	return fs.readdirSync(folderPath)
}

export const getTextFileData = (path: string): Promise<string> => {
	return fsPromise.readFile(path, {encoding: 'utf8'})
}

export const getBufferFileData = (path: string): Promise<Buffer> => {
	return fsPromise.readFile(path)
}
