import styles from './Loader.module.scss'

export enum ESize {
	SMALL = 'SMALL',
	MEDIUM = 'MEDIUM',
	LARGE = 'LARGE'
}

const Loader = ({size = ESize.MEDIUM}: {size?: ESize}) => {
	return <div className={`${styles.loader} ${styles[`loader-${size}`]}`} />
}

export default Loader
