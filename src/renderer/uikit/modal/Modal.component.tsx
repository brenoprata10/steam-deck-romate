import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faClose} from '@fortawesome/free-solid-svg-icons'
import styles from './Modal.module.scss'

export type TModalProps = {
	width?: string
	height?: string
	isOpened: boolean
	title: string
	className?: string
	isCloseable?: boolean
	footerLeading?: React.ReactNode
	footerTrailing?: React.ReactNode
	onClose?: () => void
	children?: React.ReactNode
}

const Modal = ({
	isOpened,
	title,
	className,
	isCloseable = true,
	footerLeading,
	footerTrailing,
	width,
	height,
	onClose,
	children
}: TModalProps) => {
	if (!isOpened) {
		return null
	}
	return (
		<div className={styles.modal}>
			<div className={styles.overlay} />
			<div className={styles.wrapper}>
				<div className={styles.content} style={{width, height}}>
					<div className={styles.header}>
						<h4>{title}</h4>
						{isCloseable && <FontAwesomeIcon icon={faClose} onClick={onClose} />}
					</div>
					<div className={className}>{children}</div>
					{(footerTrailing || footerLeading) && (
						<div className={styles.footer}>
							<div>{footerLeading}</div>
							<div>{footerTrailing}</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default Modal
