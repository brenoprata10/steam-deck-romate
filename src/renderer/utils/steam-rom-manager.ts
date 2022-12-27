import TParserConfig from 'renderer/types/TParserConfig'
import TSteamRomManagerParserConfig from 'renderer/types/TSteamRomManagerParserConfig'

const DEFAULT_EMUDECK_EMULATION_FOLDER_PATH = '/run/media/mmcblk0p1/Emulation'

export const mapEmuDeckSteamRomManagerParser = (
	{
		parserId,
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
	let args = executableArgs
		.replace('${os:win|cores|${os:mac|${racores}|${os:linux|${racores}}}}', '')
		.replace('${/}', '/')
		.replace('${os:win|dll|${os:mac|dylib|${os:linux|so}}}', 'so')
	const executablePath = executableModifier
		.replaceAll('${exePath}', executable.path)
		.replace('${retroarchpath}', '/usr/bin/flatpak')
	let path = executablePath
	if (executable.appendArgsToExecutable) {
		path = `${executablePath} ${args}`
		args = ''
	}
	const romDirectory = emudeckRomDirectory
		.replace('${romsdirglobal}', `${emulationFolderPath}/roms`)
		.replace(DEFAULT_EMUDECK_EMULATION_FOLDER_PATH, emulationFolderPath)

	return {
		id: parserId,
		executable: {
			path,
			arguments: args
		},
		name: parserId,
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
