import TGameAssetCollection from 'renderer/types/TGameAssetCollection'

type TGame = {
	id: string
	name: string
	path: string
	exec: string
	collections: string[]
	assets?: TGameAssetCollection
}

export default TGame
