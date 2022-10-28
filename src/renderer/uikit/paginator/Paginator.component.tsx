const Paginator = ({
	pages,
	currentPage,
	onSelectPage
}: {
	pages: number
	currentPage: number
	onSelectPage: (pageIndex: number) => void
}) => {
	console.log(pages)
	return (
		<div>
			{Array.from(Array(pages).keys()).map((pageNumber) => (
				<div key={`page-number-${pageNumber}`} onClick={() => onSelectPage(pageNumber)}>
					{pageNumber}
				</div>
			))}
		</div>
	)
}

export default Paginator
