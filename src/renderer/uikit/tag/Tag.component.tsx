import {ReactNode} from 'react'
import styles from './Tag.module.scss'

const Tag = ({children, backgroundColor, color}: {children: ReactNode; backgroundColor?: string; color?: string}) => (
	<span className={styles.tag} style={{backgroundColor, color}}>
		{children}
	</span>
)

export default Tag
