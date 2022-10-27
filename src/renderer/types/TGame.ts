import TGameAssetCollection from 'renderer/types/TGameAssetCollection'

type TGame = {
	name: string
	path: string
	exec: string
	collections: string[]
	assets?: TGameAssetCollection
}

export default TGame
