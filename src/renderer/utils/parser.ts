import TGame from 'renderer/types/TGame'
import TParserConfig from 'renderer/types/TParserConfig'
import {getFileExtension, getFileNamesFromFolder, getFileNameWithoutExtension} from 'renderer/utils/files'
import {generateShortAppId} from 'renderer/utils/generate-app-id'
import {getGameSearchTerm} from './game'

export const getGamesFromParser = (parser: TParserConfig): TGame[] => {
	const files = getFileNamesFromFolder(parser.romDirectory)
	const romsFileNames = files.filter((file) =>
		parser.supportedFileTypes.some((fileType) => fileType === getFileExtension(file))
	)

	return romsFileNames
		.map((romFileName): TGame => {
			const name = getFileNameWithoutExtension(romFileName)
			const path = `${parser.romDirectory}/${romFileName}`
			const exec = parser.executable.path.replace('${filePath}', path)
			const launchOptions = parser.executable.arguments.replace('${filePath}', path)

			return {
				id: generateShortAppId(parser.romDirectory, name),
				exec,
				name,
				collections: parser.category ? [parser.category] : [],
				path,
				launchOptions,
				searchTerm: name
			}
		})
		.map((game): TGame => ({...game, searchTerm: getGameSearchTerm(game)}))
}

export const getGamesFromParsers = (parsers: TParserConfig[]): TGame[] => {
	const games = []
	for (const parser of parsers) {
		games.push(...getGamesFromParser(parser))
	}

	return games
}
