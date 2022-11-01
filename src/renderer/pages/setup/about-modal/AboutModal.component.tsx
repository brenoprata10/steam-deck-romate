import Modal from 'renderer/uikit/modal/Modal.component'
import styles from './AboutModal.module.scss'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBug} from '@fortawesome/free-solid-svg-icons'
import GITHUB_IMAGE from '../../../../../assets/setup-assets/github.png'
import {IconProp} from '@fortawesome/fontawesome-svg-core'

const SUPPORT_CONFIG: Array<{label: string; icon?: IconProp; image?: string; link: string}> = [
	{
		label: 'Github',
		image: GITHUB_IMAGE,
		link: 'https://github.com/brenoprata10/steam-deck-romate'
	},
	{
		label: 'Report a Bug',
		icon: faBug,
		link: 'https://github.com/brenoprata10/steam-deck-romate/issues'
	}
]

const AboutModal = ({isOpened, onClose}: {isOpened: boolean; onClose: () => void}) => (
	<Modal className={styles['about-modal']} isOpened={isOpened} title={'Steam Deck Roommate'} onClose={onClose}>
		<span>The ultimate rom manager for Steam Deck users.</span>
		<span className={styles.contribute}>Contribute:</span>
		<div className={styles['support-wrapper']}>
			{SUPPORT_CONFIG.map((config, index) => (
				<div
					key={`support-about-${index}`}
					className={styles['support-item']}
					onClick={() => window.open(config.link, '_blank')}
				>
					{config.image && <img className={styles.asset} src={config.image} />}
					{config.icon && <FontAwesomeIcon className={styles.asset} icon={config.icon} />}
					<span>{config.label}</span>
				</div>
			))}
		</div>
		<span className={styles.developer}>Developed with ❤️ by Breno Prata</span>
	</Modal>
)

export default AboutModal
