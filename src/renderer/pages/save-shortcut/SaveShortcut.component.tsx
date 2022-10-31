import {useMount} from 'react-use'
import useGames from 'renderer/hooks/useGames'
import TGame from 'renderer/types/TGame'
import * as Electron from 'electron'
import {getAssetFileName} from 'renderer/utils/steam-assets'
import {getSteamGridAssetsFolderPath, saveSteamShortcuts, getSteamShortcuts} from 'renderer/utils/steam-shortcuts'
import EChannel from 'main/enums/EChannel'
import EAssetType from 'renderer/enums/EAssetType'
import {getSelectedAsset} from 'renderer/utils/asset'
import {getGameAssetsByName} from 'renderer/api/steam-grid.api'
import PromiseThrottle from 'promise-throttle'
import useSteamGridApiKey from 'renderer/hooks/useSteamGridApiKey'
import {VdfMap} from 'steam-binary-vdf'
import {getFileExtension} from 'renderer/utils/files'
import {useState} from 'react'
import Page from 'renderer/uikit/page/Page.component'
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
	const apiKey = useSteamGridApiKey()
	const games = useGames()

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

				if (selectedAsset) {
					const assetExtension = getFileExtension(selectedAsset.mime)
					const fileName = getAssetFileName(game.id, assetExtension)[assetType]
					await Electron.ipcRenderer.invoke(EChannel.DOWNLOAD_ASSET, {
						url: selectedAsset.url,
						fileName,
						directory: getSteamGridAssetsFolderPath('48553049')
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
		const shortcutsObject = (await getSteamShortcuts()) as {shortcuts: {[id: string]: VdfMap}}

		for (const game of games) {
			const selectedIcon = getSelectedAsset({assets: game.assets?.ICON ?? []})
			const iconFileExtension = getFileExtension(selectedIcon?.mime ?? '')
			const iconPath = `${getSteamGridAssetsFolderPath('48553049')}/${
				getAssetFileName(game.id, iconFileExtension).ICON
			}`
			const shortcutValue = {
				AppName: game.name,
				Exe: game.exec,
				AppId: game.id,
				icon: iconPath
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
		await saveSteamShortcuts(shortcutsObject)
		console.log({shortcutsObject})
		addToLog('Saving shortcut.vdf to Steam folder.', PRIMARY_LOG_COLOR)
	}

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
			addToLog('All done. Happy gaming! 😀')
			setStep(EStep.DONE)
		}

		void createShortcuts()
	})

	return (
		<Page title={step === EStep.DONE ? EStep.DONE : 'Saving...'}>
			<div className={styles['save-shortcut']}>
				<div id={'log-wrapper'} className={styles['log-wrapper']}>
					<b>Detailed Log: </b>
				</div>
			</div>
		</Page>
	)
}

export default SaveShortcut
