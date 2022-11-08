import ButtonSelect, {TButtonSelectOption} from 'renderer/uikit/button-select/ButtonSelect.component'
import styles from './Card.module.scss'
import {faEllipsis} from '@fortawesome/free-solid-svg-icons'

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
const Card = <T extends any>({
	title,
	className,
	options = [],
	onOptionClick,
	children
}: {
	title: string | React.ReactNode
	className?: string
	options?: TButtonSelectOption<T>[]
	onOptionClick?: (value: T) => void
	children: React.ReactNode
}) => (
	<div className={`${styles.card} ${className ?? ''}`}>
		<div className={styles['title-wrapper']}>
			<b className={styles.title}>{title}</b>
			{options.length > 0 && (
				<div className={styles['options-button']}>
					<ButtonSelect icon={faEllipsis} options={options} onClick={(value) => onOptionClick?.(value)} />
				</div>
			)}
		</div>
		{children}
	</div>
)

export default Card
