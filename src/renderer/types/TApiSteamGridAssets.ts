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
	// Used to verify if cached game already have downloaded asset
	isDownloaded?: boolean
	// Defines wheter asset is the one that will be used
	isSelected?: boolean
}

type TApiSteamGridAssets = TBaseApiSteamGrid<Array<TSteamGridAsset>>

export default TApiSteamGridAssets
