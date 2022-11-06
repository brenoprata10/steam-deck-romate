import EAssetType from 'renderer/enums/EAssetType'
import styles from './AssetsGrid.module.scss'
import AssetModal from 'renderer/pages/configure-assets/asset-modal/AssetModal.component'
import {useCallback, useContext, useState} from 'react'
import TGameAssetCollection from 'renderer/types/TGameAssetCollection'
import Image from 'renderer/uikit/image/Image.component'
import {getSelectedAsset} from 'renderer/utils/asset'
import {CommonDispatchContext} from 'renderer/context'
import {TSteamGridAsset} from 'renderer/types/TApiSteamGridAssets'
import {EAction} from 'renderer/reducer'
import React from 'react'

const EMPTY_ASSETS_COLLECTION = {LIBRARY: [], GRID: [], HERO: [], ICON: [], LOGO: []}

const GAME_ASSET_IMAGE_CONFIG: {[assetType in EAssetType]: {height: string; width: string}} = {
	[EAssetType.LIBRARY]: {
		height: '12rem',
		width: '8rem'
	},
	[EAssetType.GRID]: {
		height: '6rem',
		width: '11.5rem'
	},
	[EAssetType.HERO]: {
		height: '6rem',
		width: '11.5rem'
	},
	[EAssetType.LOGO]: {
		height: '10rem',
		width: '10rem'
	},
	[EAssetType.ICON]: {
		height: '6rem',
		width: '6rem'
	}
}

const Component = ({
	gameName,
	gameId,
	assets = EMPTY_ASSETS_COLLECTION
}: {
	gameName: string
	gameId: string
	assets?: TGameAssetCollection
}) => {
	const dispatch = useContext(CommonDispatchContext)
	const [isAssetModalOpened, setIsAssetModalOpened] = useState(false)
	const [selectedAssetType, setSelectedAssetType] = useState(EAssetType.LIBRARY)
	const assetsList = (Object.keys(assets) as EAssetType[]).filter((assetType) => assets[assetType][0]?.thumb)

	const onEditAsset = useCallback((assetType: EAssetType) => {
		setIsAssetModalOpened(true)
		setSelectedAssetType(assetType)
	}, [])

	const onSelectAsset = useCallback(
		(asset: TSteamGridAsset) => {
			dispatch({
				type: EAction.SELECT_ASSET,
				payload: {gameId, assetType: selectedAssetType, assetId: asset.id}
			})
		},
		[gameId, selectedAssetType, dispatch]
	)

	return (
		<>
			<div className={styles['assets-grid']}>
				{assetsList.length > 0 ? (
					assetsList.map((assetType, index) => (
						<Image
							key={`${index}-${assetType}`}
							src={getSelectedAsset({assets: assets[assetType]})?.thumb ?? null}
							height={GAME_ASSET_IMAGE_CONFIG[assetType].height}
							width={GAME_ASSET_IMAGE_CONFIG[assetType].width}
							className={styles.item}
							onClick={() => onEditAsset(assetType)}
						/>
					))
				) : (
					<b>No assets were located for current search term.</b>
				)}
			</div>
			<AssetModal
				isOpened={isAssetModalOpened}
				title={gameName}
				selectedAssetType={selectedAssetType}
				assets={assets}
				onSelectAsset={onSelectAsset}
				onChangeAssetType={setSelectedAssetType}
				onClose={() => setIsAssetModalOpened(false)}
			/>
		</>
	)
}

export const AssetsGrid = React.memo(Component)
