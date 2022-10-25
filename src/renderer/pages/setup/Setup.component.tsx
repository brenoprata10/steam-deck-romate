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
import useSelectFolder from 'renderer/hooks/useSelectFolder'
import {getFileNamesFromFolder} from 'renderer/utils/files'
import Modal from 'renderer/uikit/modal/Modal.component'
import AboutModal from './about-modal/AboutModal.component'

const Setup = () => {
	const [isAboutModalOpened, setIsAboutModalOpened] = useState(false)
	const {setupFlow, games} = useContext(CommonContext)
	const dispatch = useContext(CommonDispatchContext)
	const {trigger: selectFolder} = useSelectFolder('Select Custom Folder')

	const changeSetupFlow = useCallback(
		(setup: ESetup) => {
			dispatch({type: EAction.SET_SETUP_FLOW, payload: setup})
		},
		[dispatch]
	)

	const setCustomFolderGames = useCallback(async () => {
		const {canceled, filePaths: folders} = await selectFolder()
		if (canceled || folders.length > 0) {
			return
		}
		const selectedFolderPath = folders[0]
		dispatch({
			type: EAction.SET_GAMES,
			payload: getFileNamesFromFolder(selectedFolderPath).map((fileName) => ({
				name: fileName,
				path: `${selectedFolderPath}/${fileName}`,
				collections: []
			}))
		})
	}, [dispatch, selectFolder])

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
					label={'Custom Folder'}
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
