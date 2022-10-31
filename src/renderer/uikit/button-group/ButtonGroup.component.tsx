import styles from './ButtonGroup.module.scss'

const ButtonGroup = ({
	items,
	className
}: {
	className: string
	items: Array<{label: string; isSelected?: boolean; onClick: (value: any) => void}>
}) => {
	const getItemBorderRadius = (index: number) => {
		if (index === 0) {
			return '8px 0px 0px 8px'
		}
		if (index === items.length - 1) {
			return '0px 8px 8px 0px'
		}
	}

	return (
		<div className={`${styles['button-group']} ${className ?? ''}`}>
			{items.map(({label, isSelected, onClick}, index) => (
				<div
					key={`${index}-${label}`}
					className={`${styles.item} ${isSelected ? styles['item-selected'] : ''}`}
					onClick={onClick}
					style={{borderRadius: getItemBorderRadius(index)}}
				>
					{label.toUpperCase()}
				</div>
			))}
		</div>
	)
}

export default ButtonGroup
