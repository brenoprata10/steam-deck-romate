import styles from './Button.module.scss'

export enum EButtonVariant {
	PRIMARY = 'PRIMARY',
	SECONDARY = 'SECONDARY'
}

export enum EButtonSize {
	SMALL = 'SMALL',
	MEDIUM = 'MEDIUM'
}

const Button = ({
	variant = EButtonVariant.PRIMARY,
	transparent,
	children,
	disabled,
	className,
	size = EButtonSize.MEDIUM,
	onClick
}: {
	variant?: EButtonVariant
	transparent?: boolean
	children: React.ReactNode
	disabled?: boolean
	className?: string
	size?: EButtonSize
	onClick?: () => void | Promise<void>
}) => (
	<button
		className={`${styles.button} ${styles[`button--${variant}`]} ${styles[`button-${size}`]} ${className ?? ''} ${
			transparent ? `${styles['button-transparent']} ${styles[`button-transparent-${variant}`]}` : ''
		}`}
		onClick={onClick}
		disabled={disabled}
	>
		{children}
	</button>
)

export default Button
