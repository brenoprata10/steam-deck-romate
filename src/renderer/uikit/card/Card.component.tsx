import styles from './Card.module.scss'

const Card = ({title, className, children}: {title: string; className?: string; children: React.ReactNode}) => {
	return (
		<div className={`${styles.card} ${className ?? ''}`}>
			<div className={styles['title-wrapper']}>
				<b className={styles.title}>{title}</b>
			</div>
			{children}
		</div>
	)
}

export default Card
