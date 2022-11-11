import TGame from 'renderer/types/TGame'
import Button from 'renderer/uikit/button/Button.component'
import Modal from 'renderer/uikit/modal/Modal.component'
import styles from './ParserConfigModal.module.scss'

const ParserConfigModal = ({isOpened, games, onClose}: {isOpened: boolean; games: TGame[]; onClose: () => void}) => {
	const availableCollections = new Set(
		games.map((game) => game.collections).reduce((result, collection) => [...result, ...collection])
	)

	return (
		<Modal
			title={'What do you need?'}
			className={styles['parser-config-modal']}
			isOpened={isOpened}
			onClose={onClose}
			footer={
				<div className={styles.footer}>
					<Button>Save</Button>
				</div>
			}
		>
			<div className={styles['collection-list']}>
				{Array.from(availableCollections).map((collection) => (
					<div key={collection} className={styles.item}>
						{collection}
					</div>
				))}
			</div>
		</Modal>
	)
}

export default ParserConfigModal
