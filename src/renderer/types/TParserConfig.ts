type TParserConfig = {
	id: string
	name: string
	romDirectory: string
	executable: {
		arguments?: string
		path: string
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
