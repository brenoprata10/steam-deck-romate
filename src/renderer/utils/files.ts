import fs from 'fs'

export const getFileNamesFromFolder = (folder: string): string[] => {
	return fs.readdirSync(folder)
}
