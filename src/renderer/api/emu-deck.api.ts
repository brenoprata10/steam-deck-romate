import TSteamRomManagerParserConfig from 'renderer/types/TSteamRomManagerParserConfig'
import {mapEmuDeckSteamRomManagerParser} from 'renderer/utils/steam-rom-manager'

const NINTENDO_64_ROSALIE_PARSER = '167184642099963041'

export const getEmuDeckConfigFile = async (emulationFolderPath: string) => {
	try {
		const response = await fetch(
			'https://raw.githubusercontent.com/dragoonDorise/EmuDeck/main/configs/steam-rom-manager/userData/userConfigurations.json'
		)

		const emuDeckParserFile = (await response.json()) as TSteamRomManagerParserConfig[]
		return (
			emuDeckParserFile
				// We are going to skip N64 parser because we already have retroarch
				.filter((parser) => !parser.disabled && parser.parserId !== NINTENDO_64_ROSALIE_PARSER)
				.map((parser) => mapEmuDeckSteamRomManagerParser(parser, emulationFolderPath))
		)
	} catch (error) {
		console.error(error)
		throw Error('Could not load EmuDeck config file.')
	}
}
