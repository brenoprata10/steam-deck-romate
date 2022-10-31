import {useMount} from 'react-use'
import useGames from 'renderer/hooks/useGames'
import TGame from 'renderer/types/TGame'
import * as Electron from 'electron'
import {getAssetFileName} from 'renderer/utils/steam-assets'
import {getSteamGridAssetsFolderPath} from 'renderer/utils/steam-shortcuts'
import EChannel from 'main/enums/EChannel'
import EAssetType from 'renderer/enums/EAssetType'
import {getSelectedAsset} from 'renderer/utils/asset'
import {generateShortAppId} from 'renderer/utils/generate-app-id'

type TGameWithSteamId = TGame & {steamId: string}

const SaveShortcut = () => {
	const games: TGameWithSteamId[] = useGames().map((game) => ({
		...game,
		steamId: generateShortAppId(game.path, game.name)
	}))
	/*	const shortcuts = await getSteamShortcuts()
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
		//console.log({shortcuts})*/

	const saveGameAssets = async (games: Array<TGameWithSteamId>) => {
		for (const game of games) {
			for (const assetType of Object.keys(EAssetType) as EAssetType[]) {
				const selectedAsset = getSelectedAsset({assets: game.assets?.[assetType] ?? []})

				if (selectedAsset) {
					const assetExtension = selectedAsset.mime?.match('\\w+$')?.[0] ?? ''
					await Electron.ipcRenderer.invoke(EChannel.DOWNLOAD_ASSET, {
						url: selectedAsset.url,
						fileName: getAssetFileName(game.steamId, assetExtension)[assetType],
						directory: getSteamGridAssetsFolderPath('48553049')
					})
					console.log(`Downloaded: ${getAssetFileName(game.steamId, assetExtension)[assetType]}`)
				}
			}
		}
		console.log('Saved game assets')
	}

	useMount(() => {
		void saveGameAssets(games)
	})

	return <span>saving</span>
}

export default SaveShortcut
