import CardOption from 'renderer/uikit/card-option/CardOption.component'
import Page from 'renderer/uikit/page/Page.component'
import EMUDECK_IMG from '../../../../assets/setup-assets/emudeck.png'
import CUSTOM_FOLDER_IMG from '../../../../assets/setup-assets/custom-folder.jpg'
import styles from './Setup.module.scss'
import PageFooter from 'renderer/uikit/page/footer/PageFooter.component'
import Button, {EButtonVariant} from 'renderer/uikit/button/Button.component'
import {useCallback, useContext, useState} from 'react'
import {CommonContext, CommonDispatchContext} from 'renderer/context'
import ESetup from 'renderer/enums/ESetup'
import {EAction} from 'renderer/reducer'
import AboutModal from './about-modal/AboutModal.component'
import useSelectMultipleFiles from 'renderer/hooks/useSelectMultipleFiles'
import {getGameFromDesktopFile} from 'renderer/utils/game'
import TGame from 'renderer/types/TGame'
import {useNavigate} from 'react-router-dom'
import {getRoutePath} from 'renderer/route'
import ERoute from 'renderer/enums/ERoute'

const Setup = () => {
	const [isAboutModalOpened, setIsAboutModalOpened] = useState(false)
	const {setupFlow} = useContext(CommonContext)
	const navigate = useNavigate()
	const dispatch = useContext(CommonDispatchContext)
	const {trigger: selectMultipleFiles} = useSelectMultipleFiles({
		title: 'Select .desktop files',
		extensions: ['desktop']
	})

	const changeSetupFlow = useCallback(
		(setup: ESetup) => {
			dispatch({type: EAction.SET_SETUP_FLOW, payload: setup})
		},
		[dispatch]
	)

	const setCustomFolderGames = useCallback(async () => {
		const {canceled, filePaths} = await selectMultipleFiles()
		if (canceled || filePaths.length === 0) {
			return
		}
		const games: TGame[] = []
		for (const path of filePaths) {
			games.push(await getGameFromDesktopFile(path))
		}
		dispatch({
			type: EAction.SET_GAMES,
			payload: games
		})
		navigate(getRoutePath(ERoute.CONFIGURE_ASSETS))

		/* Save shortcut to steam
		const shortcuts = await getSteamShortcuts()
		const steamId = generateShortAppId(games[0].path, games[0].name)
		shortcuts.shortcuts[steamId] = {
			AppName: games[0].name,
			Exe: games[0].exec,
			AppId: steamId
		}
		await saveSteamShortcuts(shortcuts)
		console.log({shortcuts, steamId})*/
	}, [dispatch, selectMultipleFiles, navigate])

	const setEmuDeckGames = useCallback(async () => {
		// TODO
	}, [])

	const onNext = useCallback(
		() => (setupFlow === ESetup.CUSTOM_FOLDER ? setCustomFolderGames() : setEmuDeckGames()),
		[setupFlow, setCustomFolderGames, setEmuDeckGames]
	)

	const toggleAboutModalVisibility = useCallback(() => setIsAboutModalOpened(!isAboutModalOpened), [isAboutModalOpened])

	return (
		<Page
			title='Welcome!'
			subtitle='Choose setup:'
			contentClassName={styles['setup-step']}
			footerComponent={
				<PageFooter
					leadingComponent={
						<Button onClick={toggleAboutModalVisibility} variant={EButtonVariant.SECONDARY}>
							About
						</Button>
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
					label={'Custom Files'}
					description={'Only .desktop files are supported.'}
					onClick={() => {
						changeSetupFlow(ESetup.CUSTOM_FOLDER)
					}}
				/>
			</div>
			<AboutModal isOpened={isAboutModalOpened} onClose={toggleAboutModalVisibility} />
		</Page>
	)
}

export default Setup
