import {useReducer} from 'react'
import {MemoryRouter as Router, Routes, Route} from 'react-router-dom'
import './App.scss'
import {CommonContext, CommonDispatchContext} from './context'
import ERoute from './enums/ERoute'
import Setup from './pages/setup/Setup.component'
import ConfigureAssets from './pages/configure-assets/ConfigureAssets.component'
import {INITIAL_STATE, reducer} from './reducer'
import {getRoutePath} from './route'

export default function App() {
	const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

	return (
		<CommonDispatchContext.Provider value={dispatch}>
			<CommonContext.Provider value={state}>
				<main className={'main-wrapper'}>
					<Router>
						<Routes>
							<Route path={getRoutePath(ERoute.SETUP)} element={<Setup />} />
							<Route path={getRoutePath(ERoute.CONFIGURE_ASSETS)} element={<ConfigureAssets />} />
						</Routes>
					</Router>
				</main>
			</CommonContext.Provider>
		</CommonDispatchContext.Provider>
	)
}
