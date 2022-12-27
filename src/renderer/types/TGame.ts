import TGameAssetCollection from 'renderer/types/TGameAssetCollection'

type TGame = {
	id: string
	name: string
	collections: string[]
	path?: string
	exec?: string
	searchTerm?: string
	launchOptions?: string
	assets?: TGameAssetCollection
	// Used to define when a game is not imported
	isExcluded?: boolean
	// Used to define when a game is imported, but marked as ignored
	isIgnored?: boolean
	// Used to determine if game was already added on a previous run
	hasCacheEntry?: boolean
}

export default TGame
