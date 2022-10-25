import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faClose} from '@fortawesome/free-solid-svg-icons'
import styles from './Modal.module.scss'

const Modal = ({
	isOpened,
	title,
	className,
	onClose,
	children
}: {
	isOpened: boolean
	title: string
	className?: string
	onClose: () => void
	children: React.ReactNode
}) => {
	if (!isOpened) {
		return null
	}
	return (
		<div className={styles.modal}>
			<div className={styles.overlay} />
			<div className={styles.wrapper}>
				<div className={styles.content}>
					<div className={styles.header}>
						<h4>{title}</h4>
						<FontAwesomeIcon icon={faClose} onClick={onClose} />
					</div>
					<div className={className}>{children}</div>
				</div>
			</div>
		</div>
	)
}

export default Modal
