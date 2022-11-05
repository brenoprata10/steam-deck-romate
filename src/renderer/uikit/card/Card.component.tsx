import ButtonSelect, {TButtonSelectOption} from 'renderer/uikit/button-select/ButtonSelect.component'
import styles from './Card.module.scss'
import {faEllipsis} from '@fortawesome/free-solid-svg-icons'
import {EButtonVariant} from '../button/Button.component'

const Card = ({
	title,
	className,
	options = [],
	children
}: {
	title: string
	className?: string
	options?: TButtonSelectOption<string>[]
	children: React.ReactNode
}) => {
	return (
		<div className={`${styles.card} ${className ?? ''}`}>
			<div className={styles['title-wrapper']}>
				<b className={styles.title}>{title}</b>
				{options.length > 0 && (
					<div className={styles['options-button']}>
						<ButtonSelect
							icon={faEllipsis}
							variant={EButtonVariant.PRIMARY}
							options={options}
							onClick={() => console.log('hey')}
						/>
					</div>
				)}
			</div>
			{children}
		</div>
	)
}

export default Card
