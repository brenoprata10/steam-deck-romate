import EAssetType from 'renderer/enums/EAssetType'
import styles from './AssetsGrid.module.scss'
import AssetModal from 'renderer/pages/configure-assets/asset-modal/AssetModal.component'
import {useCallback, useState} from 'react'
import TGame from 'renderer/types/TGame'
import TGameAssetCollection from 'renderer/types/TGameAssetCollection'

const EMPTY_ASSETS_COLLECTION = {LIBRARY: [], GRID: [], HERO: [], ICON: [], LOGO: []}

const AssetsGrid = ({game}: {game: TGame}) => {
	const [isAssetModalOpened, setIsAssetModalOpened] = useState(false)
	const [selectedAssetType, setSelectedAssetType] = useState(EAssetType.LIBRARY)
	const assets: TGameAssetCollection = game.assets ?? EMPTY_ASSETS_COLLECTION
	const assetsList = (Object.keys(assets) as EAssetType[]).filter((assetType) => assets[assetType][0]?.thumb)

	const onEditAsset = useCallback((assetType: EAssetType) => {
		setIsAssetModalOpened(true)
		setSelectedAssetType(assetType)
	}, [])

	return (
		<>
			<div className={styles['assets-grid']}>
				{assetsList.map((assetType, index) => (
					<div
						key={`${index}-${assetType}`}
						className={`${styles.asset} ${styles[`asset-${assetType}`]}`}
						style={{
							backgroundImage: `url(${assets[assetType][0].thumb ?? ''})`
						}}
						onClick={() => onEditAsset(assetType)}
					/>
				))}
			</div>
			<AssetModal
				isOpened={isAssetModalOpened}
				title={game.name}
				selectedAssetType={selectedAssetType}
				assets={assets}
				onClose={() => setIsAssetModalOpened(false)}
			/>
		</>
	)
}

export default AssetsGrid
