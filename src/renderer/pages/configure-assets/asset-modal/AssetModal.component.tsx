import EAssetType from 'renderer/enums/EAssetType'
import {TSteamGridAsset} from 'renderer/types/TApiSteamGridAssets'
import TGameAssetCollection from 'renderer/types/TGameAssetCollection'
import ButtonGroup from 'renderer/uikit/button-group/ButtonGroup.component'
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
	onSelectAsset,
	onChangeAssetType,
	onClose
}: {
	selectedAssetType: EAssetType
	assets: TGameAssetCollection
	onSelectAsset: (asset: TSteamGridAsset) => void
	onChangeAssetType: (assetType: EAssetType) => void
} & TModalProps) => {
	const selectedAsset = getSelectedAsset({assets: assets[selectedAssetType]})
	const assetTypes = Object.keys(EAssetType) as EAssetType[]

	return (
		<Modal
			className={styles['asset-modal']}
			isOpened={isOpened}
			title={title}
			width={'min(85%, 66.8rem)'}
			height={'40rem'}
			onClose={onClose}
		>
			<div className={styles['selected-asset']}>
				{selectedAsset?.url && <Image src={selectedAsset.url} height={'23.3rem'} width={'100%'} />}
				<ButtonGroup
					className={styles['asset-type-group']}
					items={assetTypes.map((assetType) => ({
						label: assetType,
						isSelected: selectedAssetType === assetType,
						onClick: () => onChangeAssetType(assetType)
					}))}
				/>
			</div>
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
							className={styles.item}
							onClick={() => onSelectAsset(asset)}
						/>
					))}
				</div>
			</div>
		</Modal>
	)
}

export default AssetModal
