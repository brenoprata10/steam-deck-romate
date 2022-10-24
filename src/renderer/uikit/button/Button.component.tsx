import styles from './Button.module.scss'

export enum EButtonVariant {
	PRIMARY = 'PRIMARY',
	SECONDARY = 'SECONDARY'
}

const Button = ({
	variant = EButtonVariant.PRIMARY,
	children,
	disabled,
	onClick
}: {
	variant?: EButtonVariant
	children: React.ReactNode
	disabled?: boolean
	onClick?: () => void
}) => (
	<button className={`${styles.button} ${styles[`button--${variant}`]}`} onClick={onClick} disabled={disabled}>
		{children}
	</button>
)

export default Button
