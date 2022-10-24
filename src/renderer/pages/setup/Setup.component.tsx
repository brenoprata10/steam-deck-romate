import CardOption from 'renderer/uikit/card-option/CardOption.component'
import Page from 'renderer/uikit/page/Page.component'
import EMUDECK_IMG from '../../../../assets/setup-assets/emudeck.png'
import CUSTOM_FOLDER_IMG from '../../../../assets/setup-assets/custom-folder.jpg'
import styles from './Setup.module.scss'
import PageFooter from 'renderer/uikit/page/footer/PageFooter.component'
import Button, {EButtonVariant} from 'renderer/uikit/button/Button.component'
import {useCallback, useContext} from 'react'
import {CommonContext, CommonDispatchContext} from 'renderer/context'
import ESetup from 'renderer/enums/ESetup'
import {EAction} from 'renderer/reducer'

const Setup = () => {
	const {setupFlow} = useContext(CommonContext)
	const dispatch = useContext(CommonDispatchContext)

	const changeSetupFlow = useCallback(
		(setup: ESetup) => {
			dispatch({type: EAction.SET_SETUP_FLOW, payload: setup})
		},
		[dispatch]
	)

	const setEmuDeckFlow = useCallback(() => {
		changeSetupFlow(ESetup.EMU_DECK)
	}, [changeSetupFlow])

	const setCustomFolderFlow = useCallback(() => {
		changeSetupFlow(ESetup.CUSTOM_FOLDER)
	}, [changeSetupFlow])

	return (
		<Page
			title='Welcome!'
			subtitle='Choose setup:'
			contentClassName={styles['setup-step']}
			footerComponent={
				<PageFooter
					leadingComponent={<Button variant={EButtonVariant.SECONDARY}>About</Button>}
					trailingComponent={<Button disabled={!setupFlow}>Next</Button>}
				/>
			}
		>
			<div className={styles.grid}>
				<CardOption
					isSelected={setupFlow === ESetup.EMU_DECK}
					imageSrc={EMUDECK_IMG}
					label={'Emu Deck'}
					onClick={setEmuDeckFlow}
				/>
				<CardOption
					isSelected={setupFlow === ESetup.CUSTOM_FOLDER}
					imageSrc={CUSTOM_FOLDER_IMG}
					label={'Custom Folder'}
					onClick={setCustomFolderFlow}
				/>
			</div>
		</Page>
	)
}

export default Setup
