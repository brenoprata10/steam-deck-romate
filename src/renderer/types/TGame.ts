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
}

export default TGame
