import * as Electron from 'electron'
import EChannel from 'main/enums/EChannel'
import PromiseThrottle from 'promise-throttle'
import {useCallback, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useMount} from 'react-use'
import {getGameAssetsByName} from 'renderer/api/steam-grid.api'
import EAssetType from 'renderer/enums/EAssetType'
import ELocalStorageKey from 'renderer/enums/ELocalStorageKey'
import ERoute from 'renderer/enums/ERoute'
import useGames from 'renderer/hooks/useGames'
import useSteamGridApiKey from 'renderer/hooks/useSteamGridApiKey'
import useSteamUserId from 'renderer/hooks/useSteamUserId'
import {getRoutePath} from 'renderer/route'
import TGame from 'renderer/types/TGame'
import Button, {EButtonVariant} from 'renderer/uikit/button/Button.component'
import PageFooter from 'renderer/uikit/page/footer/PageFooter.component'
import Page from 'renderer/uikit/page/Page.component'
import {getSelectedAsset} from 'renderer/utils/asset'
import {getFileExtension} from 'renderer/utils/files'
import {getCachedGames} from 'renderer/utils/game'
import {getAssetFileName} from 'renderer/utils/steam-assets'
import {getSteamGridAssetsFolderPath, getSteamShortcuts, saveSteamShortcuts} from 'renderer/utils/steam-shortcuts'
import {VdfMap} from 'steam-binary-vdf'
import styles from './SaveShortcut.module.scss'

enum EStep {
	DOWNLOAD_ASSETS = 'Downloading assets',
	SAVE_SHORTCUTS = 'Saving Shortcuts',
	DONE = 'Done.'
}

const PRIMARY_LOG_COLOR = 'yellow'
const SECONDARY_LOG_COLOR = 'cyan'

const PROMISE_THROTTLE = new PromiseThrottle({
	requestsPerSecond: 1
})

const SaveShortcut = () => {
	const [step, setStep] = useState(EStep.DOWNLOAD_ASSETS)
	const navigate = useNavigate()
	const apiKey = useSteamGridApiKey()
	const steamUserId = useSteamUserId()
	const games = useGames().filter((game) => !game.isIgnored)

	const addToLog = (message: string, color = 'white') => {
		const logElement = document.getElementById('log-wrapper')
		const logEntry = document.createElement('p')
		logEntry.style.color = color
		logEntry.innerText = message
		if (logElement) {
			logElement.appendChild(logEntry)
			logElement.scrollTop = logElement.scrollHeight
		}
	}

	const downloadAssets = async (games: TGame[]) => {
		for (const game of games) {
			for (const assetType of Object.keys(EAssetType) as EAssetType[]) {
				const selectedAsset = getSelectedAsset({assets: game.assets?.[assetType] ?? []})

				if (selectedAsset && steamUserId) {
					const assetExtension = getFileExtension(selectedAsset.mime)
					const fileName = getAssetFileName(game.id, assetExtension)[assetType]
					await Electron.ipcRenderer.invoke(EChannel.DOWNLOAD_ASSET, {
						url: selectedAsset.url,
						fileName,
						directory: getSteamGridAssetsFolderPath(steamUserId)
					})
					addToLog(
						`Downloaded: ${game.name} / ${assetType.toLocaleLowerCase()} - ${fileName} - ${selectedAsset.url}`,
						SECONDARY_LOG_COLOR
					)
				}
			}
		}
	}

	const fetchAssetsForUnloadedGames = async (games: TGame[]): Promise<TGame[]> => {
		if (!apiKey || games.length === 0) {
			return []
		}
		addToLog(`Fetching additional asset for: ${games.length} games. This might take a while...`, PRIMARY_LOG_COLOR)
		const responseArray = await Promise.all(
			games.map((game) => PROMISE_THROTTLE.add(() => getGameAssetsByName({gameName: game.name, apiKey})))
		)
		addToLog('Finished fetching additional images.', PRIMARY_LOG_COLOR)
		return games.map((game, index) => ({...game, assets: responseArray[index]}))
	}

	const saveShortcuts = async () => {
		if (!steamUserId) {
			throw Error('Steam user Id not provided.')
		}
		const shortcutsObject = (await getSteamShortcuts({steamUserId})) as {shortcuts: {[id: string]: VdfMap}}

		for (const game of games) {
			const selectedIcon = getSelectedAsset({assets: game.assets?.ICON ?? []})
			const iconFileExtension = getFileExtension(selectedIcon?.mime ?? '')
			const iconPath = `${getSteamGridAssetsFolderPath(steamUserId)}/${
				getAssetFileName(game.id, iconFileExtension).ICON
			}`
			const shortcutValue = {
				AppName: game.name,
				Exe: game.exec,
				AppId: game.id,
				icon: iconPath,
				LaunchOptions: game.launchOptions ?? ''
			}
			const shortcutsValue = Object.values(shortcutsObject.shortcuts)
			const persistedGame = shortcutsValue.find((shortcut) => shortcut.AppId == game.id || shortcut.appid == game.id)

			if (persistedGame) {
				const index = shortcutsValue.indexOf(persistedGame)
				shortcutsObject.shortcuts[index] = shortcutValue
			} else {
				shortcutsObject.shortcuts[shortcutsValue.length] = shortcutValue
			}
		}
		await saveSteamShortcuts({shortcuts: shortcutsObject, steamUserId})
		console.log({shortcutsObject})
		addToLog('Saving shortcut.vdf to Steam folder.', PRIMARY_LOG_COLOR)
	}

	const saveGamesToLocalStorage = useCallback(() => {
		const updatedCachedGames = [...games]
		const cachedGames = getCachedGames()
		if (cachedGames.length > 0) {
			for (const cachedGame of cachedGames) {
				const duplicatedGame = games.find((game) => game.id === cachedGame.id)
				if (!duplicatedGame) {
					updatedCachedGames.push(cachedGame)
				}
			}
		}
		localStorage.setItem(ELocalStorageKey.CACHED_GAMES, JSON.stringify(updatedCachedGames))
	}, [games])

	useMount(() => {
		const createShortcuts = async () => {
			const unloadedGames = games.filter((game) => !game.assets)
			const [unloadedGamesWithAssets] = await Promise.all([
				fetchAssetsForUnloadedGames(unloadedGames),
				downloadAssets(games)
			])
			// Download assets for games that were not seen by user in previous step
			await downloadAssets(unloadedGamesWithAssets)
			addToLog('All assets were downloaded.', PRIMARY_LOG_COLOR)
			setStep(EStep.SAVE_SHORTCUTS)
			await saveShortcuts()
			saveGamesToLocalStorage()
			addToLog('All done. Happy gaming! 😀')
			setStep(EStep.DONE)
		}

		void createShortcuts()
	})

	const onBackToSetup = useCallback(() => navigate(getRoutePath(ERoute.SETUP)), [navigate])

	return (
		<Page
			title={step === EStep.DONE ? EStep.DONE : 'Saving...'}
			footerComponent={
				step === EStep.DONE && (
					<PageFooter
						leadingComponent={
							<div>
								<Button onClick={onBackToSetup} variant={EButtonVariant.SECONDARY} className={styles['about-button']}>
									Back to Home
								</Button>
							</div>
						}
					/>
				)
			}
		>
			<div className={styles['save-shortcut']}>
				<div id={'log-wrapper'} className={styles['log-wrapper']}>
					<b>Detailed Log: </b>
				</div>
			</div>
		</Page>
	)
}

export default SaveShortcut
