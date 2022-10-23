import {MemoryRouter as Router, Routes, Route} from 'react-router-dom'
import Setup from 'renderer/pages/setup/Setup.component'
import styles from './MainWrapper.module.scss'

const MainWrapper = () => {
	return (
		<main className={styles['main-wrapper']}>
			<Router>
				<Routes>
					<Route path='/' element={<Setup />} />
				</Routes>
			</Router>
		</main>
	)
}

export default MainWrapper
