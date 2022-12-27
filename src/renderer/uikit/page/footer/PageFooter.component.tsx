import styles from './PageFooter.module.scss'

const PageFooter = ({
	leadingComponent,
	trailingComponent
}: {
	leadingComponent?: React.ReactNode
	trailingComponent?: React.ReactNode
}) => (
	<div className={styles['page-footer']}>
		<div className={styles['content']}>
			{leadingComponent ?? <div />}
			{trailingComponent ?? <div />}
		</div>
	</div>
)

export default PageFooter
