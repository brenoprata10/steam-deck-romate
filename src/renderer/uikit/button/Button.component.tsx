import styles from './Button.module.scss'

export enum EButtonVariant {
	PRIMARY = 'PRIMARY',
	SECONDARY = 'SECONDARY'
}

const Button = ({
	variant = EButtonVariant.PRIMARY,
	children,
	onClick
}: {
	variant?: EButtonVariant
	children: React.ReactNode
	onClick?: () => void
}) => (
	<button className={`${styles.button} ${styles[`button--${variant}`]}`} onClick={onClick}>
		{children}
	</button>
)

export default Button
