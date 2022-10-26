import {useReducer} from 'react'
import {MemoryRouter as Router, Routes, Route} from 'react-router-dom'
import './App.scss'
import {CommonContext, CommonDispatchContext} from './context'
import Setup from './pages/setup/Setup.component'
import {INITIAL_STATE, reducer} from './reducer'

export default function App() {
	const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

	return (
		<CommonDispatchContext.Provider value={dispatch}>
			<CommonContext.Provider value={state}>
				<main className={'main-wrapper'}>
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
