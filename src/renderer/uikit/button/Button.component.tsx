import styles from './Button.module.scss'

export enum EButtonVariant {
	PRIMARY = 'PRIMARY',
	SECONDARY = 'SECONDARY'
}

const Button = ({
	variant = EButtonVariant.PRIMARY,
	children,
	disabled,
	className,
	onClick
}: {
	variant?: EButtonVariant
	children: React.ReactNode
	disabled?: boolean
	className?: string
	onClick?: () => void | Promise<void>
}) => (
	<button
		className={`${styles.button} ${styles[`button--${variant}`]} ${className ?? ''}`}
		onClick={onClick}
		disabled={disabled}
	>
		{children}
	</button>
)

export default Button
