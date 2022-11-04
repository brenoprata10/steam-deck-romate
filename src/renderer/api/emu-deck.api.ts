import TSteamRomManagerParserConfig from 'renderer/types/TSteamRomManagerParserConfig'
import {mapEmuDeckSteamRomManagerParser} from 'renderer/utils/steam-rom-manager'

export const getEmuDeckConfigFile = async (emulationFolderPath: string) => {
	try {
		const response = await fetch(
			'https://raw.githubusercontent.com/dragoonDorise/EmuDeck/main/configs/steam-rom-manager/userData/userConfigurations.json'
		)

		const emuDeckParserFile = (await response.json()) as TSteamRomManagerParserConfig[]
		return emuDeckParserFile
			.filter((parser) => !parser.disabled)
			.map((parser) => mapEmuDeckSteamRomManagerParser(parser, emulationFolderPath))
	} catch (error) {
		console.error(error)
		throw Error('Could not load EmuDeck config file.')
	}
}
