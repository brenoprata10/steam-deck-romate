import {TSteamGridAsset} from 'renderer/types/TApiSteamGridAssets'

export const getSelectedAsset = ({assets}: {assets: TSteamGridAsset[]}): TSteamGridAsset =>
	assets.find((asset) => asset.isSelected) ?? assets[0]
