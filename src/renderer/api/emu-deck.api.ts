import {EMUDECK_PARSERS} from 'renderer/utils/emudeck-parsers'

export const getEmuDeckConfigFile = (emulationFolderPath: string) => {
	try {
		/*const response = await fetch(
			'https://raw.githubusercontent.com/dragoonDorise/EmuDeck/main/configs/steam-rom-manager/userData/userConfigurations.json'
		)

		const emuDeckParserFile = (await response.json()) as TSteamRomManagerParserConfig[]
		*/
		const emuDeckParserFile = EMUDECK_PARSERS.map((parser) => ({
			...parser,
			romDirectory: `${emulationFolderPath}/${parser.romDirectory}`
		}))
		return emuDeckParserFile
	} catch (error) {
		console.error(error)
		throw Error('Could not load EmuDeck config file.')
	}
}
