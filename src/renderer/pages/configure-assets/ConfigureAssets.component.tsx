import {url} from 'inspector'
import EChannel from 'main/enums/EChannel'
import {useCallback, useContext, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useMount} from 'react-use'
import {getGameAssetsById} from 'renderer/api/steam-grid.api'
import {CommonDispatchContext} from 'renderer/context'
import EAssetType from 'renderer/enums/EAssetType'
import ERoute from 'renderer/enums/ERoute'
import useGames from 'renderer/hooks/useGames'
import {EAction} from 'renderer/reducer'
import {getRoutePath} from 'renderer/route'
import Button, {EButtonVariant} from 'renderer/uikit/button/Button.component'
import Card from 'renderer/uikit/card/Card.component'
import PageFooter from 'renderer/uikit/page/footer/PageFooter.component'
import Page from 'renderer/uikit/page/Page.component'
import {generateShortAppId} from 'renderer/utils/generate-app-id'
import {getSteamGridAssetsFolderPath, getSteamShortcuts, saveSteamShortcuts} from 'renderer/utils/steam-shortcuts'
import styles from './ConfigureAssets.module.scss'
import * as Electron from 'electron'
import {getAssetFileName} from 'renderer/utils/steam-assets'
import useSteamGridApiKey from 'renderer/hooks/useSteamGridApiKey'

const ITEMS_PER_PAGE = 10

const ConfigureAssets = () => {
	const [isLoading, setIsLoading] = useState(true)
	const [page, setPage] = useState(0)
	const navigate = useNavigate()
	const dispatch = useContext(CommonDispatchContext)
	const apiKey = useSteamGridApiKey()
	const games = useGames()
	const currentGameIndex = page * ITEMS_PER_PAGE
	const displayedGames = games.slice(currentGameIndex, currentGameIndex + ITEMS_PER_PAGE)

	const fetchGameAssets = async ({start, end}: {start: number; end: number}) => {
		try {
			setIsLoading(true)
			const gamesSlice = games
				.slice(start, end)
				.map((game, index) => ({...game, currentIndex: start + index}))
				.filter((game) => !game.assets)
			if (gamesSlice.length > 0) {
				console.log('Fetching game assets: ', gamesSlice.map((game) => game.name).join())
				const gameCollections = await Promise.all(
					gamesSlice.map((game) => getGameAssetsById({gameName: game.name, apiKey}))
				)
				dispatch({
					type: EAction.SET_GAMES,
					payload: gamesSlice.map(({currentIndex}, index) => ({
						...games[currentIndex],
						assets: gameCollections[index] ?? undefined
					}))
				})
			}
		} catch (error) {
			console.error(error)
		} finally {
			setIsLoading(false)
		}
	}
	console.log(games)

	useMount(() => {
		void fetchGameAssets({start: 0, end: ITEMS_PER_PAGE})
	})

	const onBack = useCallback(() => navigate(getRoutePath(ERoute.SETUP)), [navigate])

	const onSave = useCallback(async () => {
		const shortcuts = await getSteamShortcuts()
		for (const game of games) {
			const steamId = generateShortAppId(game.path, game.name)
			shortcuts.shortcuts[steamId] = {
				AppName: games[0].name,
				Exe: games[0].exec,
				AppId: steamId
			}
			console.log(steamId)
			const assetExtension = game.assets?.LIBRARY[0]?.mime?.match('\\w+$')?.[0] ?? ''
			await Electron.ipcRenderer.invoke(EChannel.DOWNLOAD_ASSET, {
				url: game.assets?.HERO[0].url,
				fileName: getAssetFileName(steamId, assetExtension).HERO,
				directory: getSteamGridAssetsFolderPath('48553049')
			})
		}
		//await saveSteamShortcuts(shortcuts)
		//console.log({shortcuts})
	}, [games])

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
					trailingComponent={<Button onClick={onSave}>Save</Button>}
				/>
			}
		>
			{isLoading && <span>loading</span>}
			{!isLoading &&
				displayedGames.map((game, index) => (
					<Card key={`${game.name}-${index}`} title={game.name} className={styles.game}>
						<div className={styles['assets-grid']}>
							{(Object.keys(game.assets ?? {}) as EAssetType[])
								.filter((assetType) => game.assets?.[assetType][0]?.thumb)
								.map((assetType, index: number) => (
									<div
										key={`${index}-${assetType}`}
										className={`${styles.asset} ${styles[`asset-${assetType}`]}`}
										style={{
											backgroundImage: `url(${game.assets?.[assetType][0].thumb ?? ''})`
										}}
									/>
								))}
						</div>
					</Card>
				))}
		</Page>
	)
}

export default ConfigureAssets
