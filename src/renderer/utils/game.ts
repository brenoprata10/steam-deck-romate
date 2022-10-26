import TGame from 'renderer/types/TGame'
import {getTextFileData} from './files'

const DESKTOP_FILE_PROPERTY_CONFIG: {[propertyName: string]: 'name' | 'exec'} = {
	['Name']: 'name',
	['Exec']: 'exec'
}

export const getGameFromDesktopFile = async (path: string): Promise<TGame> => {
	const propertyNameRegex = '^\\w*'
	const valuePropertyRegex = '=.+$'
	const game: TGame = {name: '', exec: '', path: '', collections: []}
	const fileData = await getTextFileData(path)

	for (const line of fileData.split('\n')) {
		const isLineWithAssignedValue = line.match(`${propertyNameRegex}${valuePropertyRegex}`)
		if (!isLineWithAssignedValue) {
			continue
		}
		const propertyName = line.match(propertyNameRegex)?.[0]
		const gameProperty = DESKTOP_FILE_PROPERTY_CONFIG[propertyName ?? '']
		const value = line.match(valuePropertyRegex)?.[0].replace('=', '')

		if (propertyName && value && gameProperty) {
			game[gameProperty] = value
		}
	}

	return game
}