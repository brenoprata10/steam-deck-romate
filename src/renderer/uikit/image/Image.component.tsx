import styles from './Image.module.scss'

const Image = ({
	src,
	height,
	width,
	className,
	onClick
}: {
	src: string
	height: string
	width: string
	className?: string
	onClick?: () => void
}) => {
	return (
		<div
			className={`${styles.image} ${className ?? ''}`}
			style={{
				backgroundImage: `url(${src})`,
				height,
				width
			}}
			onClick={onClick}
		/>
	)
}

export default Image
