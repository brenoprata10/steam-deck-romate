import styles from './Page.module.scss'

const Page = ({
	title,
	subtitle,
	children,
	contentClassName
}: {
	title: string
	subtitle: string
	children: React.ReactNode
	contentClassName?: string
}) => {
	return (
		<div className={styles['page-container']}>
			<header>
				<h1 className={styles.title}>{title}</h1>
				<h2 className={styles.subtitle}>{subtitle}</h2>
			</header>
			<div className={contentClassName}>{children}</div>
			<footer>I am the footer</footer>
		</div>
	)
}

export default Page
