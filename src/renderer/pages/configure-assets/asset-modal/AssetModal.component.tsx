import EAssetType from 'renderer/enums/EAssetType'
import TGameAssetCollection from 'renderer/types/TGameAssetCollection'
import Modal, {TModalProps} from 'renderer/uikit/modal/Modal.component'
import {getSelectedAsset} from 'renderer/utils/asset'

const AssetModal = ({
	isOpened,
	title,
	selectedAssetType,
	assets,
	onClose
}: {selectedAssetType: EAssetType; assets: TGameAssetCollection} & TModalProps) => {
	const selectedAsset = getSelectedAsset({assets: assets[selectedAssetType]})

	return (
		<Modal isOpened={isOpened} title={title} width={'66.8rem'} height={'42rem'} onClose={onClose}>
			<div>{selectedAsset.url}</div>
			<div>
				{assets[selectedAssetType].map((asset) => (
					<div key={asset.id}>{asset.url}</div>
				))}
			</div>
		</Modal>
	)
}

export default AssetModal
