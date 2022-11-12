import {useCallback} from 'react'
import TGame from 'renderer/types/TGame'
import styles from './GameCollection.module.scss'

const GameCollection = ({
	games,
	collection,
	onCollectionClick,
	onGameClick
}: {
	games: TGame[]
	collection: string
	onCollectionClick: () => void
	onGameClick: (game: TGame) => void
}) => {
	const handleGameClick = useCallback(
		(game: TGame) => {
			onGameClick(game)
		},
		[onGameClick]
	)

	return (
		<div className={styles['parser-config-game-collection']}>
			<div>
				<input type={'checkbox'} id={collection} onClick={onCollectionClick} />
				<label htmlFor={collection} className={styles.label}>
					{collection}
				</label>
			</div>
			{games.map((game) => {
				const gameInputId = `${game.id}-${collection}`

				return (
					<div className={styles['game-item']} key={gameInputId} onClick={() => handleGameClick(game)}>
						<input type={'checkbox'} id={gameInputId} />
						<label htmlFor={gameInputId} className={styles.label}>
							{game.name}
						</label>
					</div>
				)
			})}
		</div>
	)
}

export default GameCollection
