import {useReducer} from 'react'
import {MemoryRouter as Router, Routes, Route} from 'react-router-dom'
import './App.scss'
import {CommonContext, CommonDispatchContext} from './context'
import ERoute from 'renderer/enums/ERoute'
import Setup from 'renderer/pages/setup/Setup.component'
import ConfigureAssets from 'renderer/pages/configure-assets/ConfigureAssets.component'
import {INITIAL_STATE, reducer} from 'renderer/reducer'
import {getRoutePath} from 'renderer/route'
import SaveShortcut from 'renderer/pages/save-shortcut/SaveShortcut.component'
import SelectUserAccount from 'renderer/pages/select-user-account/SelectUserAccount.component'
import ConfigureParsers from './pages/configure-parsers/ConfigureParsers.component'

export default function App() {
	const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

	return (
		<CommonDispatchContext.Provider value={dispatch}>
			<CommonContext.Provider value={state}>
				<main className={'main-wrapper'}>
					<Router>
						<Routes>
							<Route path={getRoutePath(ERoute.SELECT_ACCOUNT)} element={<SelectUserAccount />} />
							<Route path={getRoutePath(ERoute.SETUP)} element={<Setup />} />
							<Route path={getRoutePath(ERoute.CONFIGURE_ASSETS)} element={<ConfigureAssets />} />
							<Route path={getRoutePath(ERoute.CONFIGURE_PARSERS)} element={<ConfigureParsers />} />
							<Route path={getRoutePath(ERoute.SAVE)} element={<SaveShortcut />} />
						</Routes>
					</Router>
				</main>
			</CommonContext.Provider>
		</CommonDispatchContext.Provider>
	)
}
