import {IconDefinition} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import styles from './Button.module.scss'

export enum EButtonVariant {
	PRIMARY = 'PRIMARY',
	SECONDARY = 'SECONDARY'
}

export enum EButtonSize {
	SMALL = 'SMALL',
	MEDIUM = 'MEDIUM'
}

export enum EButtonType {
	BUTTON = 'button',
	SUBMIT = 'submit',
	RESET = 'reset'
}

const Button = ({
	variant = EButtonVariant.PRIMARY,
	transparent,
	children,
	disabled,
	className,
	icon,
	size = EButtonSize.MEDIUM,
	type = EButtonType.BUTTON,
	onClick
}: {
	variant?: EButtonVariant
	transparent?: boolean
	children: React.ReactNode
	disabled?: boolean
	className?: string
	icon?: IconDefinition
	size?: EButtonSize
	type?: EButtonType
	onClick?: () => void | Promise<void>
}) => (
	<button
		className={`${styles.button} ${styles[`button--${variant}`]} ${styles[`button-${size}`]} ${className ?? ''} ${
			transparent ? `${styles['button-transparent']} ${styles[`button-transparent-${variant}`]}` : ''
		}`}
		onClick={onClick}
		disabled={disabled}
		type={type}
	>
		{icon && <FontAwesomeIcon className={styles.icon} icon={icon} size={'xl'} />}
		{children}
	</button>
)

export default Button
