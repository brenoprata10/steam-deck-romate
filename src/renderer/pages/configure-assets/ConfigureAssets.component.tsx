import {useCallback, useContext, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useMount} from 'react-use'
import {getGameAssetsByName} from 'renderer/api/steam-grid.api'
import {CommonDispatchContext} from 'renderer/context'
import ERoute from 'renderer/enums/ERoute'
import useGames from 'renderer/hooks/useGames'
import {EAction} from 'renderer/reducer'
import {getRoutePath} from 'renderer/route'
import Button, {EButtonVariant} from 'renderer/uikit/button/Button.component'
import Card from 'renderer/uikit/card/Card.component'
import PageFooter from 'renderer/uikit/page/footer/PageFooter.component'
import Page from 'renderer/uikit/page/Page.component'
import styles from './ConfigureAssets.module.scss'
import useSteamGridApiKey from 'renderer/hooks/useSteamGridApiKey'
import Paginator from 'renderer/uikit/paginator/Paginator.component'
import {AssetsGrid} from 'renderer/pages/configure-assets/assets-grid/AssetsGrid.component'
import Loader, {ESize} from 'renderer/uikit/loader/Loader.component'
import {faSquare, faSquareCheck, faSearch} from '@fortawesome/free-solid-svg-icons'
import ChangeSearchModal from 'renderer/pages/configure-assets/change-search-modal/ChangeSearchModal.component'
import TGame from 'renderer/types/TGame'
import Tag from 'renderer/uikit/tag/Tag.component'
import {getAssetsWithPreSelection, getGameSearchTerm, isCachedGame} from 'renderer/utils/game'

enum EGameCardOption {
	MARK_IGNORED = 'Mark as Ignored',
	CHANGE_SEARCH_TERM = 'Change Search Term'
}

const ITEMS_PER_PAGE = 10

const ConfigureAssets = () => {
	const [isLoading, setIsLoading] = useState(true)
	const [gameToChangeSearchTerm, setGameToChangeSearchTerm] = useState<TGame | null>(null)
	const [page, setPage] = useState(0)
	const navigate = useNavigate()
	const dispatch = useContext(CommonDispatchContext)
	const apiKey = useSteamGridApiKey()
	const games = useGames()
	const currentGameIndex = page * ITEMS_PER_PAGE
	const pagesCount = Math.ceil(games.length / ITEMS_PER_PAGE)
	const displayedGames = games.slice(currentGameIndex, currentGameIndex + ITEMS_PER_PAGE)

	const fetchGameAssets = useCallback(
		async ({start, end}: {start: number; end: number}) => {
			try {
				setIsLoading(true)
				const gamesSlice = games
					.slice(start, end)
					.map((game, index) => ({...game, currentIndex: start + index}))
					.filter((game) => !game.assets)
				if (gamesSlice.length > 0 && apiKey) {
					console.log('Fetching game assets: ', gamesSlice.map((game) => game.name).join())
					const gameCollections = await Promise.all(
						gamesSlice.map((game) => getGameAssetsByName({gameName: getGameSearchTerm(game), apiKey}))
					)

					dispatch({
						type: EAction.SET_GAMES,
						payload: games.map((game, index) => {
							if (game.assets) {
								return game
							}

							const gameCollectionIndex = gamesSlice.findIndex((gameSlice) => gameSlice.currentIndex === index)
							const gameAssets = gameCollectionIndex !== undefined ? gameCollections[gameCollectionIndex] : undefined

							return {
								...game,
								assets: isCachedGame(game.id) ? getAssetsWithPreSelection(game.id, gameAssets) : gameAssets
							}
						})
					})
				}
			} catch (error) {
				console.error(error)
			} finally {
				setIsLoading(false)
			}
		},
		[games, dispatch, apiKey]
	)

	useMount(() => {
		void fetchGameAssets({start: 0, end: ITEMS_PER_PAGE})
	})

	const onBack = useCallback(() => navigate(getRoutePath(ERoute.SELECT_ACCOUNT)), [navigate])
	const onSave = useCallback(() => navigate(getRoutePath(ERoute.SAVE)), [navigate])

	const onChangePage = useCallback(
		(newPage: number) => {
			setPage(newPage)
			const newGameIndex = newPage * ITEMS_PER_PAGE
			void fetchGameAssets({start: newGameIndex, end: newGameIndex + ITEMS_PER_PAGE})
			window.scrollTo({top: 0, behavior: 'smooth'})
		},
		[fetchGameAssets]
	)

	const toggleIgnoredGameStatus = useCallback(
		(gameId: string) => dispatch({type: EAction.TOGGLE_IGNORED_GAME_STATUS, payload: {gameId}}),
		[dispatch]
	)

	const openChangeSearchTermModal = useCallback(
		(gameId: string) => {
			setGameToChangeSearchTerm(games.find((game) => game.id === gameId) ?? null)
		},
		[games]
	)

	const handleGameCardOptionClick = useCallback(
		(value: EGameCardOption, gameId: string) =>
			value === EGameCardOption.MARK_IGNORED ? toggleIgnoredGameStatus(gameId) : openChangeSearchTermModal(gameId),
		[toggleIgnoredGameStatus, openChangeSearchTermModal]
	)
	return (
		<Page
			title='Configuration'
			subtitle='Choose game assets:'
			contentClassName={styles['configure-assets']}
			footerComponent={
				<PageFooter
					leadingComponent={
						<Button onClick={onBack} variant={EButtonVariant.SECONDARY}>
							Back
						</Button>
					}
					trailingComponent={
						<div className={styles['trailing-footer-wrapper']}>
							{pagesCount > 1 && <Paginator pages={pagesCount} currentPage={page} onSelectPage={onChangePage} />}
							<Button onClick={onSave}>Save</Button>
						</div>
					}
				/>
			}
		>
			{isLoading ? (
				<div className={styles.loader}>
					<Loader size={ESize.LARGE} />
				</div>
			) : (
				<div className={styles.grid}>
					{displayedGames.map((game, index) => (
						<Card
							key={`${game.name}-${index}`}
							title={
								<div className={styles.title}>
									<span>{game.name}</span>
									<div className={styles.tags}>
										{!game.hasCacheEntry && <Tag>NEW</Tag>}
										{game.collections.map((collection) => (
											<Tag key={`${collection}-${game.id}`}>{collection}</Tag>
										))}
									</div>
								</div>
							}
							options={[
								{
									icon: game.isIgnored ? faSquareCheck : faSquare,
									label: EGameCardOption.MARK_IGNORED,
									value: EGameCardOption.MARK_IGNORED
								},
								{icon: faSearch, label: EGameCardOption.CHANGE_SEARCH_TERM, value: EGameCardOption.CHANGE_SEARCH_TERM}
							]}
							onOptionClick={(value) => handleGameCardOptionClick(value, game.id)}
							className={styles.game}
						>
							{!game.isIgnored ? (
								<AssetsGrid gameName={game.name} gameId={game.id} assets={game.assets} />
							) : (
								<div className={styles.ignored}>
									<b>Marked as Ignored. Shortcut and assets will not be created/modified.</b>
								</div>
							)}
						</Card>
					))}
				</div>
			)}
			{gameToChangeSearchTerm && (
				<ChangeSearchModal game={gameToChangeSearchTerm} onClose={() => setGameToChangeSearchTerm(null)} />
			)}
		</Page>
	)
}

export default ConfigureAssets
