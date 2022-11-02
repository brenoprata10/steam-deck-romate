import styles from './CardOption.module.scss'

const CardOption = ({
	label,
	description,
	imageSrc,
	isSelected,
	imageClassName,
	onClick
}: {
	label: string
	description?: string
	imageSrc: string
	isSelected: boolean
	imageClassName?: string
	onClick: () => void
}) => (
	<div className={`${styles['card-option']} ${isSelected ? styles['card-option--selected'] : ''}`} onClick={onClick}>
		<img className={imageClassName} src={imageSrc} />
		<span className={styles.label}>{label}</span>
		<span className={styles.description}>{description}</span>
	</div>
)

export default CardOption
