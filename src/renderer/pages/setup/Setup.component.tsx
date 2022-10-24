import CardOption from 'renderer/uikit/card-option/CardOption.component'
import Page from 'renderer/uikit/page/Page.component'
import EMUDECK_IMG from '../../../../assets/setup-assets/emudeck.png'
import CUSTOM_FOLDER_IMG from '../../../../assets/setup-assets/custom-folder.jpg'
import styles from './Setup.module.scss'
import PageFooter from 'renderer/uikit/page/footer/PageFooter.component'
import Button, {EButtonVariant} from 'renderer/uikit/button/Button.component'

const Setup = () => {
	return (
		<Page
			title='Welcome!'
			subtitle='Choose setup:'
			contentClassName={styles['setup-step']}
			footerComponent={
				<PageFooter
					leadingComponent={<Button variant={EButtonVariant.SECONDARY}>About</Button>}
					trailingComponent={<Button>Next</Button>}
				/>
			}
		>
			<div className={styles.grid}>
				<CardOption isSelected={false} imageSrc={EMUDECK_IMG} label={'Emu Deck'} />
				<CardOption isSelected={false} imageSrc={CUSTOM_FOLDER_IMG} label={'Custom Folder'} />
			</div>
		</Page>
	)
}

export default Setup
