import TGame from 'renderer/types/TGame'
import Button from 'renderer/uikit/button/Button.component'
import Modal from 'renderer/uikit/modal/Modal.component'
import GameCollection from 'renderer/pages/configure-assets/parser-config-modal/game-collection/GameCollection.component'
import styles from './ParserConfigModal.module.scss'
import {useContext, useCallback, useState} from 'react'
import {CommonDispatchContext} from 'renderer/context'
import {EAction} from 'renderer/reducer'
import Radio from 'renderer/uikit/radio/Radio.component'

const ParserConfigModal = ({isOpened, games, onClose}: {isOpened: boolean; games: TGame[]; onClose: () => void}) => {
	const dispatch = useContext(CommonDispatchContext)
	const [shouldManageAllEntries, setShouldManageAllEntries] = useState(true)

	const availableCollections = new Set(
		games.map((game) => game.collections).reduce((result, collection) => [...result, ...collection])
	)

	const getGamesByCollection = useCallback(
		(collection: string) =>
			games.filter((game) => game.collections.some((gameCollection) => gameCollection.trim() === collection.trim())),
		[games]
	)

	const onToggleGameIgnoredStatus = useCallback(
		(game: TGame) => {
			dispatch({type: EAction.TOGGLE_IGNORED_GAME_STATUS, payload: {gameIds: [game.id]}})
		},
		[dispatch]
	)

	const onSetGamesIgnoredStatus = useCallback(
		({games, isIgnored}: {games: TGame[]; isIgnored: boolean}) => {
			dispatch({type: EAction.SET_IGNORED_GAME_STATUS, payload: {gameIds: games.map((game) => game.id), isIgnored}})
		},
		[dispatch]
	)

	const onToggleCollectionIgnoredStatus = useCallback(
		(collection: string) => {
			const gamesCollection = getGamesByCollection(collection)
			const gameIds = gamesCollection.map((game) => game.id)
			const isIgnoredCollection = gamesCollection.some((game) => game.isIgnored)

			dispatch({type: EAction.SET_IGNORED_GAME_STATUS, payload: {gameIds, isIgnored: !isIgnoredCollection}})
		},
		[dispatch, getGamesByCollection]
	)

	return (
		<Modal
			title={'What do you need?'}
			className={styles['parser-config-modal']}
			isOpened={isOpened}
			isCloseable={false}
			onClose={onClose}
			footer={
				<div className={styles.footer}>
					<Button onClick={onClose}>Continue</Button>
				</div>
			}
		>
			<div className={styles['options-list']}>
				<Radio
					id={'manage-all-entries'}
					label={`Import and Manage all entries (${games.length} entries located.)`}
					checked={shouldManageAllEntries}
					onChange={() => {
						setShouldManageAllEntries(true)
						onSetGamesIgnoredStatus({games, isIgnored: false})
					}}
				/>

				<Radio
					id={'choose-entries'}
					label={'Choose which entries to import.'}
					checked={!shouldManageAllEntries}
					onChange={() => setShouldManageAllEntries(false)}
				/>
			</div>
			{!shouldManageAllEntries && (
				<div className={styles['collection-list']}>
					{Array.from(availableCollections).map((collection) => (
						<GameCollection
							key={collection}
							games={getGamesByCollection(collection)}
							collection={collection}
							onCollectionClick={() => onToggleCollectionIgnoredStatus(collection)}
							onGameClick={onToggleGameIgnoredStatus}
						/>
					))}
				</div>
			)}
		</Modal>
	)
}

export default ParserConfigModal
