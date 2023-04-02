import fs from 'fs'
import fsPromise from 'fs/promises'

export const getFolderContents = (
	folderPath: string,
	options?: {scanSubDirectories: boolean}
): Array<{path: string; name: string}> => {
	try {
		const folderContents = fs.readdirSync(folderPath, {withFileTypes: true})
		if (!options?.scanSubDirectories) {
			return folderContents.map((content) => ({path: folderPath, name: content.name}))
		}

		let folderContentsWithSubdirectories: {path: string; name: string}[] = []
		for (const content of folderContents) {
			content.isDirectory()
				? (folderContentsWithSubdirectories = [
						...folderContentsWithSubdirectories,
						...getFolderContents(`${folderPath}/${content.name}`, {scanSubDirectories: true})
				  ])
				: folderContentsWithSubdirectories.push({path: folderPath, name: content.name})
		}

		return folderContentsWithSubdirectories
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
