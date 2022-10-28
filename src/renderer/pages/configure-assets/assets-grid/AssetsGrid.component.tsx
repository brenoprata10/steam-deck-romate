import EAssetType from 'renderer/enums/EAssetType'
import styles from './AssetsGrid.module.scss'
import TGameAssetCollection from 'renderer/types/TGameAssetCollection'

const AssetsGrid = ({assets}: {assets: TGameAssetCollection}) => {
	const assetsList = (Object.keys(assets) as EAssetType[]).filter((assetType) => assets[assetType][0]?.thumb)

	return (
		<div className={styles['assets-grid']}>
			{assetsList.map((assetType, index) => (
				<div
					key={`${index}-${assetType}`}
					className={`${styles.asset} ${styles[`asset-${assetType}`]}`}
					style={{
						backgroundImage: `url(${assets[assetType][0].thumb ?? ''})`
					}}
				/>
			))}
		</div>
	)
}

export default AssetsGrid
