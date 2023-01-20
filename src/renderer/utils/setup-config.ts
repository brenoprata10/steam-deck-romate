import EPlatform from 'main/enums/EPlatform'
import EMUDECK_IMG from '../../../assets/setup-assets/emudeck.png'
import PARSER_IMG from '../../../assets/setup-assets/code.jpg'
import CUSTOM_FOLDER_IMG from '../../../assets/setup-assets/custom-folder.jpg'
import STEAM_IMG from '../../../assets/setup-assets/steam.jpg'
import ESetup from 'renderer/enums/ESetup'
import TSetupConfig from 'renderer/types/TSetupConfig'

const SETUP_CONFIG: {[setup in ESetup]: TSetupConfig} = {
	[ESetup.CREATE_PARSERS]: {
		label: 'Create Parsers',
		image: PARSER_IMG,
		supportedPlatforms: [EPlatform.LINUX, EPlatform.WINDOWS]
	},
	[ESetup.EMU_DECK]: {
		label: 'Emu Deck',
		image: EMUDECK_IMG,
		supportedPlatforms: [EPlatform.LINUX]
	},
	[ESetup.STEAM_ASSETS]: {
		label: 'Steam Assets',
		image: STEAM_IMG,
		supportedPlatforms: [EPlatform.LINUX, EPlatform.WINDOWS]
	},
	[ESetup.CUSTOM_FOLDER]: {
		label: 'Desktop Files',
		image: CUSTOM_FOLDER_IMG,
		supportedPlatforms: [EPlatform.LINUX]
	}
}

export const getSetupConfig = (setup: ESetup): TSetupConfig => {
	return SETUP_CONFIG[setup]
}
