type TParserConfig = {
	romDirectory: string
	executable: {
		modifier: string
		arguments: string
		path: string
		appendArgumentsToExecutable: boolean
	}
	supportedFileTypes: string[]
	category?: string
	defaultImage?: string
	defaultTallImage?: string
	defaultHeroImage?: string
	defaultLogoImage?: string
	defaultIcon?: string
}

export default TParserConfig
