import {faChevronRight} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useCallback, useState} from 'react'
import TGame from 'renderer/types/TGame'
import Checkbox from 'renderer/uikit/checkbox/Checkbox.component'
import Collapsible from 'renderer/uikit/collapsible/Collapsible.component'
import styles from './GameCollection.module.scss'

const GameCollection = ({
	games,
	collection,
	isCollapsedByDefault = true,
	onCollectionClick,
	onGameClick
}: {
	games: TGame[]
	collection: string
	isCollapsedByDefault: boolean
	onCollectionClick: () => void
	onGameClick: (game: TGame) => void
}) => {
	const [isCollapsed, setIsCollapsed] = useState(isCollapsedByDefault)

	const handleGameClick = useCallback(
		(game: TGame) => {
			onGameClick(game)
		},
		[onGameClick]
	)

	const toggleCollapsedState = useCallback(() => {
		setIsCollapsed(!isCollapsed)
	}, [isCollapsed])

	const isExcludedCollection = games.some((game) => game.isExcluded)

	return (
		<Collapsible
			isCollapsed={isCollapsed}
			innerComponent={games.map((game) => (
				<div className={styles['game-item']} key={`${game.id}-${collection}`}>
					<Checkbox
						id={`${game.id}-${collection}`}
						label={game.name}
						checked={!game.isExcluded}
						onChange={() => handleGameClick(game)}
					/>
				</div>
			))}
			className={styles['parser-config-game-collection']}
			innerClassNameWrapper={styles['collection-list']}
		>
			<div className={styles['collection-name']}>
				<FontAwesomeIcon
					icon={faChevronRight}
					style={{transition: '.3s', transform: `rotate(${isCollapsed ? 0 : 90}deg)`}}
					onClick={toggleCollapsedState}
				/>
				<Checkbox id={collection} label={collection} onChange={onCollectionClick} checked={!isExcludedCollection} />
			</div>
		</Collapsible>
	)
}

export default GameCollection
