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
	// Defines wheter asset is the one that will be used
	isSelected?: boolean
	// Defines if asset is already downloaded
	isDownloaded?: boolean
}

type TApiSteamGridAssets = TBaseApiSteamGrid<Array<TSteamGridAsset>>

export default TApiSteamGridAssets
