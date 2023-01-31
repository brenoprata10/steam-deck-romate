import ERoute from 'renderer/enums/ERoute'

const ROUTE_CONFIG: {[route in ERoute]: {path: string}} = {
	[ERoute.AUTO_UPDATER]: {
		path: '/'
	},
	[ERoute.SETUP]: {
		path: '/setup'
	},
	[ERoute.CONFIGURE_ASSETS]: {
		path: '/configure-assets'
	},
	[ERoute.CONFIGURE_PARSERS]: {
		path: '/configure-parsers'
	},
	[ERoute.SAVE]: {
		path: '/save'
	}
}

export const getRoutePath = (route: ERoute): string => {
	return ROUTE_CONFIG[route].path
}
