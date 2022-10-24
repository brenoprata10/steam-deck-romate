import {useReducer} from 'react'
import {MemoryRouter as Router, Routes, Route} from 'react-router-dom'
import {CommonContext, CommonDispatchContext} from 'renderer/context'
import Setup from 'renderer/pages/setup/Setup.component'
import {INITIAL_STATE, reducer} from 'renderer/reducer'
import styles from './MainWrapper.module.scss'

const MainWrapper = () => {
	const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

	return (
		<CommonDispatchContext.Provider value={dispatch}>
			<CommonContext.Provider value={state}>
				<main className={styles['main-wrapper']}>
					<Router>
						<Routes>
							<Route path='/' element={<Setup />} />
							<Route path='/configure-assets' element={<Setup />} />
						</Routes>
					</Router>
				</main>
			</CommonContext.Provider>
		</CommonDispatchContext.Provider>
	)
}

export default MainWrapper
