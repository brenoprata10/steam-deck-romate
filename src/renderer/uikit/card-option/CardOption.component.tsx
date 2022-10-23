import styles from './CardOption.module.scss'

const CardOption = ({
	label,
	imageSrc,
	isSelected,
	onClick
}: {
	label: string
	imageSrc: string
	isSelected: boolean
	onClick?: () => void
}) => {
	return (
		<div className={`${styles['card-option']} ${isSelected ? styles['card-option--selected'] : ''}`} onClick={onClick}>
			<img src={imageSrc} />
			<span className={styles.label}>{label}</span>
		</div>
	)
}

export default CardOption
