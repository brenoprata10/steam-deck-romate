import {ReactNode} from 'react'
import styles from './Page.module.scss'

const Page = ({
	title,
	subtitle,
	children,
	contentClassName,
	footerComponent
}: {
	title: ReactNode | string
	subtitle?: string
	children: React.ReactNode
	contentClassName?: string
	footerComponent?: React.ReactNode
}) => {
	return (
		<div className={styles['page-container']}>
			<header>
				<h1 className={styles.title}>{title}</h1>
				<h2 className={styles.subtitle}>{subtitle}</h2>
			</header>
			<div className={contentClassName}>
				{children}
				<footer>{footerComponent}</footer>
			</div>
		</div>
	)
}

export default Page
