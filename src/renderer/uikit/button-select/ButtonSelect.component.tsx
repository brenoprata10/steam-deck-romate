import {IconProp} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useState} from 'react'
import {EButtonVariant} from 'renderer/uikit/button/Button.component'
import styles from './ButtonSelect.module.scss'

export type TButtonSelectOption<T> = {label: string; icon: IconProp; value: T}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
const ButtonSelect = <T extends any>({
	icon,
	options,
	variant = EButtonVariant.PRIMARY,
	onClick
}: {
	icon: IconProp
	options: TButtonSelectOption<T>[]
	variant?: EButtonVariant
	onClick: (value: T) => void
}) => {
	const [isOverlayOpened, setIsOverlayOpened] = useState(false)

	return (
		<div className={styles['button-select']}>
			<div className={styles['overlay-wrapper']}>
				<FontAwesomeIcon icon={icon} size={'2x'} onClick={() => setIsOverlayOpened(!isOverlayOpened)} />
			</div>
			{isOverlayOpened && (
				<div
					className={`${styles.overlay} ${styles[`overlay--${variant}`]}`}
					onMouseLeave={() => setIsOverlayOpened(false)}
				>
					{options.map((option, index) => (
						<div key={`${index}-${option.label}`}>
							<div className={styles.option} onClick={() => onClick(option.value)}>
								<FontAwesomeIcon icon={option.icon} />
								<span>{option.label}</span>
							</div>
							{options.length - 1 !== index && <div className={styles.divider} />}
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default ButtonSelect
