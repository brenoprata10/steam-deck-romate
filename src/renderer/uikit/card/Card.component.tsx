import styles from './Card.module.scss'

const Card = ({title, children}: {title: string; children: React.ReactNode}) => {
	return (
		<div className={styles.card}>
			<div className={styles['title-wrapper']}>
				<b className={styles.title}>{title}</b>
			</div>
			{children}
		</div>
	)
}

export default Card
