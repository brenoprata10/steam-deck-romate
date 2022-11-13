import styles from './Checkbox.module.scss'

const Checkbox = ({
	id,
	checked,
	label,
	className,
	onChange
}: {
	id: string
	checked: boolean
	label: string
	className?: string
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}) => (
	<div className={`${styles.checkbox} ${className ?? ''}`}>
		<input type={'checkbox'} id={id} checked={checked} onChange={onChange} />
		<label htmlFor={id}>{label}</label>
	</div>
)

export default Checkbox
