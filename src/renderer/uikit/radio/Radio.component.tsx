import styles from './Radio.module.scss'

const Radio = ({
	checked,
	id,
	label,
	onChange,
	className
}: {
	checked: boolean
	id: string
	label: string
	className?: string
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}) => (
	<div className={`${styles.radio} ${className ?? ''}`}>
		<input id={id} type={'radio'} checked={checked} onChange={onChange} />
		<label htmlFor={id}>{label}</label>
	</div>
)

export default Radio
