type TParserConfig = {
	id: string
	romDirectory: string
	name: string
	executable: {
		arguments?: string
		path: string
	}
	supportedFileTypes: string[]
	category?: string
}

export default TParserConfig
