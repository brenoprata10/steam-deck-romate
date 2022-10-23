import CardOption from 'renderer/uikit/card-option/CardOption.component'
import Page from 'renderer/uikit/page/Page.component'
import EMUDECK_IMG from '../../../../assets/setup-assets/emudeck.png'
import CUSTOM_FOLDER_IMG from '../../../../assets/setup-assets/custom-folder.jpg'
import styles from './Setup.module.scss'

const Setup = () => {
	return (
		<Page title='Welcome!' subtitle='Choose setup:' contentClassName={styles['setup-step']}>
			<div className={styles.grid}>
				<CardOption isSelected={true} imageSrc={EMUDECK_IMG} label={'Emudeck'} />
				<CardOption isSelected={true} imageSrc={CUSTOM_FOLDER_IMG} label={'Custom Folder'} />
			</div>
		</Page>
	)
}

export default Setup
