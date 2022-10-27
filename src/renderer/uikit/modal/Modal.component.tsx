import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faClose} from '@fortawesome/free-solid-svg-icons'
import styles from './Modal.module.scss'

const Modal = ({
	isOpened,
	title,
	className,
	isCloseable = true,
	footer,
	onClose,
	children
}: {
	isOpened: boolean
	title: string
	className?: string
	isCloseable?: boolean
	footer?: React.ReactNode
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
						{isCloseable && <FontAwesomeIcon icon={faClose} onClick={onClose} />}
					</div>
					<div className={className}>
						{children}
						{footer}
					</div>
				</div>
			</div>
		</div>
	)
}

export default Modal
