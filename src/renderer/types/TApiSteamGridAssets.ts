import ESteamGridStyle from 'renderer/enums/ESteamGridStyle'
import TBaseApiSteamGrid from 'renderer/types/TBaseApiSteamGrid'

export type TSteamGridAsset = {
	id: number
	score: number
	style: ESteamGridStyle
	url: string
	thumb: string
	tags: string[]
	height: number
	width: number
	mime: string
}

type TApiSteamGridAssets = TBaseApiSteamGrid<Array<TSteamGridAsset>>

export default TApiSteamGridAssets
