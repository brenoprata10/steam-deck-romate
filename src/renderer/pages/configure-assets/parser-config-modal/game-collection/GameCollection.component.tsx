import {useCallback} from 'react'
import TGame from 'renderer/types/TGame'
import Checkbox from 'renderer/uikit/checkbox/Checkbox.component'
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

	const isExcludedCollection = games.some((game) => game.isExcluded)

	return (
		<div className={styles['parser-config-game-collection']}>
			<Checkbox id={collection} label={collection} onChange={onCollectionClick} checked={!isExcludedCollection} />
			{games.map((game) => (
				<div className={styles['game-item']} key={`${game.id}-${collection}`}>
					<Checkbox
						id={`${game.id}-${collection}`}
						label={game.name}
						checked={!game.isExcluded}
						onChange={() => handleGameClick(game)}
					/>
				</div>
			))}
		</div>
	)
}

export default GameCollection
