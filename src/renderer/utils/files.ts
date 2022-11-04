import fs from 'fs'
import fsPromise from 'fs/promises'

export const getFileNamesFromFolder = (folderPath: string): string[] => {
	try {
		return fs.readdirSync(folderPath)
	} catch (error) {
		console.warn(error)
		console.log(`Could not find ${folderPath}`)
		return []
	}
}

export const getTextFileData = (path: string): Promise<string> => {
	return fsPromise.readFile(path, {encoding: 'utf8'})
}

export const getBufferFileData = (path: string): Promise<Buffer> => {
	return fsPromise.readFile(path)
}

export const getFileExtension = (fileName: string) => {
	return fileName.match('\\w+$')?.[0] ?? ''
}

export const getFileNameWithoutExtension = (fileName: string) => {
	return fileName.match('^.+\\.')?.[0].replace(new RegExp('\\.$'), '') ?? fileName
}
