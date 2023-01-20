import EPlatform from 'main/enums/EPlatform'

type TSetupConfig = {
	label: string
	image: string
	supportedPlatforms: EPlatform[]
}

export default TSetupConfig
