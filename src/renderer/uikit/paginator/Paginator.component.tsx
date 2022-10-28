import styles from './Paginator.module.scss'

const Paginator = ({
	pages,
	currentPage,
	onSelectPage
}: {
	pages: number
	currentPage: number
	onSelectPage: (pageIndex: number) => void
}) => (
	<div className={styles.paginator}>
		<b>Pages:</b>{' '}
		{Array.from(Array(pages).keys())
			.filter((page) => page > currentPage - 3 && page < currentPage + 3)
			.map((pageNumber) => (
				<div
					key={`page-number-${pageNumber}`}
					className={`${styles.item} ${currentPage === pageNumber ? styles.selected : ''}`}
					onClick={() => onSelectPage(pageNumber)}
				>
					{pageNumber + 1}
				</div>
			))}
	</div>
)

export default Paginator
