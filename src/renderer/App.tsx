import {useReducer} from 'react'
import {MemoryRouter as Router, Routes, Route} from 'react-router-dom'
import './App.scss'
import {CommonContext, CommonDispatchContext} from './context'
import ERoute from 'renderer/enums/ERoute'
import Setup from 'renderer/pages/setup/Setup.component'
import ConfigureAssets from 'renderer/pages/configure-assets/ConfigureAssets.component'
import {EAction, INITIAL_STATE, reducer} from 'renderer/reducer'
import {getRoutePath} from 'renderer/route'
import SaveShortcut from 'renderer/pages/save-shortcut/SaveShortcut.component'
import ConfigureParsers from './pages/configure-parsers/ConfigureParsers.component'
import {useMount} from 'react-use'
import {getPlatform} from 'renderer/utils/platform'

export default function App() {
	const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

	useMount(() => {
		getPlatform()
			.then((platform) => {
				dispatch({type: EAction.SET_PLATFORM, payload: platform})
			})
			.catch(() => {
				throw Error('Could not detect platform')
			})
	})

	return (
		<CommonDispatchContext.Provider value={dispatch}>
			<CommonContext.Provider value={state}>
				<main className={'main-wrapper'}>
					<Router>
						<Routes>
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
