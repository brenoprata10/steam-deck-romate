import TParserConfig from 'renderer/types/TParserConfig'
import TSteamRomManagerParserConfig from 'renderer/types/TSteamRomManagerParserConfig'

const DEFAULT_EMUDECK_EMULATION_FOLDER_PATH = '/run/media/mmcblk0p1/Emulation'

export const mapEmuDeckSteamRomManagerParser = (
	{
		executable,
		executableModifier,
		executableArgs,
		romDirectory: emudeckRomDirectory,
		parserInputs,
		steamCategory,
		defaultIcon,
		defaultImage,
		defaultHeroImage,
		defaultLogoImage,
		defaultTallImage
	}: TSteamRomManagerParserConfig,
	emulationFolderPath: string
): TParserConfig => {
	// Only linux support for now
	const args = executableArgs
		.replace('${os:win|cores|${os:mac|${racores}|${os:linux|${racores}}}}', '')
		.replace('${/}', '/')
		.replace('${os:win|dll|${os:mac|dylib|${os:linux|so}}}', 'so')
	const executablePath = executableModifier.replaceAll('${exePath}', executable.path)
	const path = executable.appendArgsToExecutable ? `${executablePath} ${args}` : executablePath
	const romDirectory = emudeckRomDirectory.replace(DEFAULT_EMUDECK_EMULATION_FOLDER_PATH, emulationFolderPath)

	return {
		executable: {
			path,
			arguments: args
		},
		romDirectory,
		supportedFileTypes:
			parserInputs.glob
				.match(new RegExp('\\.\\w+', 'mg'))
				?.map((fileFormat) => fileFormat.replace('.', '').toString()) ?? [],
		category: steamCategory.match('[\\w\\s]+')?.[0] ?? steamCategory,
		defaultIcon,
		defaultImage,
		defaultHeroImage,
		defaultLogoImage,
		defaultTallImage
	}
}
