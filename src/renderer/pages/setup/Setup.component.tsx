import CardOption from 'renderer/uikit/card-option/CardOption.component'
import Page from 'renderer/uikit/page/Page.component'
import EMUDECK_IMG from '../../../../assets/setup-assets/emudeck.png'
import CUSTOM_FOLDER_IMG from '../../../../assets/setup-assets/custom-folder.jpg'
import styles from './Setup.module.scss'
import PageFooter from 'renderer/uikit/page/footer/PageFooter.component'
import Button, {EButtonVariant} from 'renderer/uikit/button/Button.component'
import {useCallback, useContext, useState} from 'react'
import {CommonDispatchContext} from 'renderer/context'
import ESetup from 'renderer/enums/ESetup'
import {EAction} from 'renderer/reducer'
import AboutModal from 'renderer/pages/setup/about-modal/AboutModal.component'
import useSelectMultipleFiles from 'renderer/hooks/useSelectMultipleFiles'
import {getGameFromDesktopFile} from 'renderer/utils/game'
import TGame from 'renderer/types/TGame'
import {useNavigate} from 'react-router-dom'
import {getRoutePath} from 'renderer/route'
import ERoute from 'renderer/enums/ERoute'
import SteamGridKeyModal from 'renderer/pages/setup/steam-grid-key-modal/SteamGridKeyModal.component'
import useSetupFlow from 'renderer/hooks/useSetupFlow'
import useSteamGridApiKey from 'renderer/hooks/useSteamGridApiKey'
import useSelectFolder from 'renderer/hooks/useSelectFolder'
import {getEmuDeckConfigFile} from 'renderer/api/emu-deck.api'
import {getGamesFromParsers} from 'renderer/utils/parser'

const Setup = () => {
	const [isAboutModalOpened, setIsAboutModalOpened] = useState(false)
	const [isSteamGridModalOpened, setIsSteamGridModalOpened] = useState(false)
	const steamGridApiKey = useSteamGridApiKey()
	const setupFlow = useSetupFlow()
	const navigate = useNavigate()
	const dispatch = useContext(CommonDispatchContext)
	const {trigger: selectMultipleFiles} = useSelectMultipleFiles({
		title: 'Select .desktop files',
		extensions: ['desktop']
	})
	const {trigger: selectFolder} = useSelectFolder('Select "Emulation" folder used for Emu Deck Setup')

	const changeSetupFlow = useCallback(
		(setup: ESetup) => dispatch({type: EAction.SET_SETUP_FLOW, payload: setup}),
		[dispatch]
	)

	const getCustomFolderGames = useCallback(async (): Promise<TGame[]> => {
		const {canceled, filePaths} = await selectMultipleFiles()
		if (canceled || filePaths.length === 0) {
			return []
		}
		const games: TGame[] = []
		for (const path of filePaths) {
			games.push(await getGameFromDesktopFile(path))
		}

		return games
	}, [selectMultipleFiles])

	const getEmuDeckGames = useCallback(async (): Promise<TGame[]> => {
		const {canceled, filePaths} = await selectFolder()
		if (canceled || filePaths.length === 0) {
			return []
		}
		const emulationFolderPath = filePaths[0]
		const emuDeckConfig = await getEmuDeckConfigFile(emulationFolderPath)
		return getGamesFromParsers(emuDeckConfig)
	}, [selectFolder])

	const onNext = useCallback(async () => {
		const gamesPromise = setupFlow === ESetup.CUSTOM_FOLDER ? getCustomFolderGames : getEmuDeckGames
		const games = await gamesPromise()

		if (games.length > 0) {
			dispatch({
				type: EAction.SET_GAMES,
				payload: games
			})
			navigate(getRoutePath(ERoute.SELECT_ACCOUNT))
		} else {
			alert('No games found.\nThe folder is empty, please check your input.')
		}
	}, [setupFlow, navigate, dispatch, getCustomFolderGames, getEmuDeckGames])

	const toggleAboutModalVisibility = useCallback(() => setIsAboutModalOpened(!isAboutModalOpened), [isAboutModalOpened])

	const toggleSteamGridModalVisibility = useCallback(
		() => setIsSteamGridModalOpened(!isSteamGridModalOpened),
		[isSteamGridModalOpened]
	)

	const saveSteamGridKeyToLocalStorage = useCallback(
		(key: string) => {
			setIsSteamGridModalOpened(false)
			dispatch({type: EAction.SET_STEAM_GRID_API_KEY, payload: key})
		},
		[dispatch]
	)

	return (
		<Page
			title='Welcome!'
			subtitle='Choose setup:'
			contentClassName={styles['setup-step']}
			footerComponent={
				<PageFooter
					leadingComponent={
						<div>
							<Button
								onClick={toggleAboutModalVisibility}
								variant={EButtonVariant.SECONDARY}
								className={styles['about-button']}
							>
								About
							</Button>
							<Button onClick={toggleSteamGridModalVisibility} variant={EButtonVariant.SECONDARY}>
								Modify Steam Grid Key
							</Button>
						</div>
					}
					trailingComponent={
						<Button disabled={!setupFlow} onClick={onNext}>
							Next
						</Button>
					}
				/>
			}
		>
			<div className={styles.grid}>
				<CardOption
					isSelected={setupFlow === ESetup.EMU_DECK}
					imageSrc={EMUDECK_IMG}
					label={'Emu Deck'}
					onClick={() => {
						changeSetupFlow(ESetup.EMU_DECK)
					}}
				/>
				<CardOption
					isSelected={setupFlow === ESetup.CUSTOM_FOLDER}
					imageSrc={CUSTOM_FOLDER_IMG}
					label={'Desktop Files'}
					description={'Only .desktop files are supported.'}
					onClick={() => {
						changeSetupFlow(ESetup.CUSTOM_FOLDER)
					}}
				/>
			</div>
			<AboutModal isOpened={isAboutModalOpened} onClose={toggleAboutModalVisibility} />
			<SteamGridKeyModal
				isOpened={!steamGridApiKey || isSteamGridModalOpened}
				isCloseable={Boolean(steamGridApiKey)}
				onSave={saveSteamGridKeyToLocalStorage}
				onClose={toggleSteamGridModalVisibility}
			/>
		</Page>
	)
}

export default Setup
