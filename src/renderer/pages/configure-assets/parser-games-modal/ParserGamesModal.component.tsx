import TGame from 'renderer/types/TGame'
import Button from 'renderer/uikit/button/Button.component'
import Modal from 'renderer/uikit/modal/Modal.component'
import GameCollection from 'renderer/pages/configure-assets/parser-games-modal/game-collection/GameCollection.component'
import styles from './ParserGamesModal.module.scss'
import {useContext, useCallback, useState} from 'react'
import {CommonDispatchContext} from 'renderer/context'
import {EAction} from 'renderer/reducer'
import Radio from 'renderer/uikit/radio/Radio.component'
import useGames from 'renderer/hooks/useGames'
import {faChevronRight} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

const ParserGamesModal = ({isOpened, onClose}: {isOpened: boolean; onClose: () => void}) => {
	const games = useGames()
	const dispatch = useContext(CommonDispatchContext)
	const [shouldManageAllEntries, setShouldManageAllEntries] = useState(games.every((game) => !game.isExcluded))

	const availableCollections = new Set(
		games.map((game) => game.collections).reduce((result, collection) => [...result, ...collection])
	)

	const getGamesByCollection = useCallback(
		(collection: string) =>
			games
				.filter((game) => game.collections.some((gameCollection) => gameCollection.trim() === collection.trim()))
				.sort((game1, game2) => game1.name.toUpperCase().localeCompare(game2.name.toUpperCase())),
		[games]
	)

	const onToggleGameExcludedStatus = useCallback(
		(game: TGame) => {
			dispatch({type: EAction.TOGGLE_EXCLUDED_GAME_STATUS, payload: {gameIds: [game.id]}})
		},
		[dispatch]
	)

	const onSetGamesExcludedStatus = useCallback(
		({games, isExcluded}: {games: TGame[]; isExcluded: boolean}) => {
			dispatch({type: EAction.SET_EXCLUDED_GAME_STATUS, payload: {gameIds: games.map((game) => game.id), isExcluded}})
		},
		[dispatch]
	)

	const onToggleCollectionExcludedStatus = useCallback(
		(collection: string) => {
			const gamesCollection = getGamesByCollection(collection)
			const gameIds = gamesCollection.map((game) => game.id)
			const isExcludedCollection = gamesCollection.some((game) => game.isExcluded)

			dispatch({type: EAction.SET_EXCLUDED_GAME_STATUS, payload: {gameIds, isExcluded: !isExcludedCollection}})
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
			footerLeading={
				shouldManageAllEntries ? undefined : (
					<span className={styles['footer-leading']}>
						Tip: Click &apos;
						<FontAwesomeIcon icon={faChevronRight} />
						&apos; to show available roms.
					</span>
				)
			}
			footerTrailing={
				<Button disabled={games.every((game) => game.isExcluded)} onClick={onClose}>
					Continue
				</Button>
			}
		>
			<div className={styles['options-list']}>
				<Radio
					id={'manage-all-entries'}
					label={`Import and Manage all entries (${games.length} entries located.)`}
					checked={shouldManageAllEntries}
					onChange={() => {
						setShouldManageAllEntries(true)
						onSetGamesExcludedStatus({games, isExcluded: false})
					}}
				/>

				<Radio
					id={'choose-entries'}
					label={'Choose which entries to import.'}
					checked={!shouldManageAllEntries}
					onChange={() => setShouldManageAllEntries(false)}
				/>
			</div>
			<div className={`${styles['collection-list']} ${shouldManageAllEntries ? styles['hidden-collections'] : ''}`}>
				{Array.from(availableCollections).map((collection) => (
					<GameCollection
						key={collection}
						games={getGamesByCollection(collection)}
						collection={collection}
						isCollapsedByDefault={availableCollections.size !== 1}
						onCollectionClick={() => onToggleCollectionExcludedStatus(collection)}
						onGameClick={onToggleGameExcludedStatus}
					/>
				))}
			</div>
		</Modal>
	)
}

export default ParserGamesModal
