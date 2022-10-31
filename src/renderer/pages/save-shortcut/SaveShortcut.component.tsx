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
import {generateShortAppId} from 'renderer/utils/generate-app-id'
import {VdfMap} from 'steam-binary-vdf'
import {getFileExtension} from 'renderer/utils/files'

const PROMISE_THROTTLE = new PromiseThrottle({
	requestsPerSecond: 1
})

const SaveShortcut = () => {
	const apiKey = useSteamGridApiKey()
	const games = useGames()

	const downloadAssets = async (games: TGame[]) => {
		for (const game of games) {
			for (const assetType of Object.keys(EAssetType) as EAssetType[]) {
				const selectedAsset = getSelectedAsset({assets: game.assets?.[assetType] ?? []})

				if (selectedAsset) {
					const assetExtension = getFileExtension(selectedAsset.mime)
					await Electron.ipcRenderer.invoke(EChannel.DOWNLOAD_ASSET, {
						url: selectedAsset.url,
						fileName: getAssetFileName(game.id, assetExtension)[assetType],
						directory: getSteamGridAssetsFolderPath('48553049')
					})
					console.log(`Downloaded: ${getAssetFileName(game.id, assetExtension)[assetType]}`)
				}
			}
		}
		console.log('Saved game assets')
	}

	const fetchAssetsForUnloadedGames = async (games: TGame[]): Promise<TGame[]> => {
		if (!apiKey) {
			return []
		}
		const responseArray = await Promise.all(
			games.map((game) => PROMISE_THROTTLE.add(() => getGameAssetsByName({gameName: game.name, apiKey})))
		)
		return games.map((game, index) => ({...game, assets: responseArray[index]}))
	}

	const saveShortcuts = async () => {
		const shortcutsObject = (await getSteamShortcuts()) as {shortcuts: {[id: string]: VdfMap}}
		console.log({shortcutsObject})

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

			shortcutsObject.shortcuts[game.id] = shortcutValue
		}
		await saveSteamShortcuts(shortcutsObject)
		console.log({shortcutsObject})
	}

	useMount(() => {
		const createShortcuts = async () => {
			const unloadedGames = games.filter((game) => !game.assets)
			const [unloadedGamesWithAssets] = await Promise.all([
				fetchAssetsForUnloadedGames(unloadedGames),
				downloadAssets(games)
			])
			// Download assets for games that were not seen by user in previous step
			void downloadAssets(unloadedGamesWithAssets)
			console.log('All assets downloaded.')
			void saveShortcuts()
		}

		void createShortcuts()
	})

	return <span>saving</span>
}

export default SaveShortcut
