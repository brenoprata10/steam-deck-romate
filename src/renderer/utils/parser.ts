import TGame from 'renderer/types/TGame'
import TParserConfig from 'renderer/types/TParserConfig'
import {getFileExtension, getFolderContents, getFileNameWithoutExtension} from 'renderer/utils/files'
import {generateShortAppId} from 'renderer/utils/generate-app-id'
import {getGameSearchTerm} from 'renderer/utils/game'

export const getGamesFromParser = (parser: TParserConfig): TGame[] => {
	const files = getFolderContents(parser.romDirectory, {scanSubDirectories: true})
	const romsFileNames = files.filter((file) =>
		parser.supportedFileTypes.some((fileType) => fileType === getFileExtension(file.name))
	)

	return romsFileNames
		.map((romFileName): TGame => {
			const name = getFileNameWithoutExtension(romFileName.name)
			const path = `${romFileName.path}/${romFileName.name}`
			const exec = parser.executable.path.replace('${filePath}', path)
			const launchOptions = parser.executable.arguments?.replace('${filePath}', path)

			return {
				id: generateShortAppId(parser.romDirectory, name),
				exec,
				name,
				collections: parser.category ? [parser.category] : [],
				path,
				launchOptions
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
