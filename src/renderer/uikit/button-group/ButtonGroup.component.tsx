import styles from './ButtonGroup.module.scss'

const ButtonGroup = ({config}: {config: Array<{label: string; value: any}>}) => {
	return (
		<div className={styles['button-group']}>
			{config.map(({label, value}, index) => (
				<div key={`${index}-${label}`}>{label.toUpperCase()}</div>
			))}
		</div>
	)
}

export default ButtonGroup
