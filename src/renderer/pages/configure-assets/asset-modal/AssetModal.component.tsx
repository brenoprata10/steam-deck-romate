import EAssetType from 'renderer/enums/EAssetType'
import TGameAssetCollection from 'renderer/types/TGameAssetCollection'
import Image from 'renderer/uikit/image/Image.component'
import Modal, {TModalProps} from 'renderer/uikit/modal/Modal.component'
import {getSelectedAsset} from 'renderer/utils/asset'
import styles from './AssetModal.module.scss'

export const GAME_ASSET_IMAGE_CONFIG: {[assetType in EAssetType]: {height: string; width: string}} = {
	[EAssetType.LIBRARY]: {
		height: '14rem',
		width: '9.5rem'
	},
	[EAssetType.GRID]: {
		height: '6rem',
		width: '12rem'
	},
	[EAssetType.HERO]: {
		height: '4rem',
		width: '13rem'
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

const AssetModal = ({
	isOpened,
	title,
	selectedAssetType,
	assets,
	onClose
}: {selectedAssetType: EAssetType; assets: TGameAssetCollection} & TModalProps) => {
	const selectedAsset = getSelectedAsset({assets: assets[selectedAssetType]})

	return (
		<Modal
			className={styles['asset-modal']}
			isOpened={isOpened}
			title={title}
			width={'min(85%, 66.8rem)'}
			height={'42rem'}
			onClose={onClose}
		>
			<Image className={styles['selected-asset']} src={selectedAsset.url} height={'23.3rem'} width={'45%'} />
			<div className={styles['available-assets']}>
				<b>Available Assets:</b>
				<div
					className={styles.grid}
					style={{
						gridTemplateColumns: `repeat(auto-fill, minmax(${GAME_ASSET_IMAGE_CONFIG[selectedAssetType].width}, 1fr))`
					}}
				>
					{assets[selectedAssetType].map((asset) => (
						<Image
							key={asset.id}
							src={asset.thumb}
							width={GAME_ASSET_IMAGE_CONFIG[selectedAssetType].width}
							height={GAME_ASSET_IMAGE_CONFIG[selectedAssetType].height}
						/>
					))}
				</div>
			</div>
		</Modal>
	)
}

export default AssetModal
