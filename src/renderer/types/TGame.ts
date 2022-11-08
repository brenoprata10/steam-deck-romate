import TGameAssetCollection from 'renderer/types/TGameAssetCollection'

type TGame = {
	id: string
	name: string
	path: string
	exec: string
	collections: string[]
	launchOptions?: string
	assets?: TGameAssetCollection
	isIgnored?: boolean
	// Used to determine if game was already added on a previous run
	hasCacheEntry?: boolean
}

export default TGame
