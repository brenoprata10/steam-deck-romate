type TSteamRomManagerParserConfig = {
	parserType: string
	configTitle: string
	parserId: string
	steamCategory: string
	executable: {
		path: string
		shortcutPassthrough: boolean
		appendArgsToExecutable: boolean
	}
	executableModifier: string
	romDirectory: string
	steamDirectory: string
	startInDirectory: string
	userAccounts: {
		specifiedAccounts: string
		skipWithMissingDataDir: boolean
		useCredentials: boolean
	}
	parserInputs: {glob: string}
	titleFromVariable: {
		limitToGroups: string
		skipFileIfVariableWasNotFound: boolean
		caseInsensitiveVariables: boolean
		tryToMatchTitle: boolean
	}
	fuzzyMatch: {
		use: boolean
		removeCharacters: boolean
		removeBrackets: boolean
		replaceDiacritics: boolean
	}
	onlineImageQueries: string
	imageProviders: string[]
	imageProviderAPIs: string[]
	executableArgs: string
	imagePool: string
	defaultImage: string
	defaultTallImage: string
	defaultHeroImage: string
	defaultLogoImage: string
	defaultIcon: string
	localImages: string
	localTallImages: string
	localHeroImages: string
	localLogoImages: string
	localIcons: string
	titleModifier: string
	disabled: boolean
	advanced: boolean
}

export default TSteamRomManagerParserConfig
