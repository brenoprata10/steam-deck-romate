import EAssetType from 'renderer/enums/EAssetType'
import {TSteamGridAsset} from 'renderer/types/TApiSteamGridAssets'

type TGameAssetCollection = {
	[asset in EAssetType]: TSteamGridAsset[]
}

export default TGameAssetCollection
