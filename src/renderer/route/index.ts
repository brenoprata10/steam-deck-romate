import ERoute from 'renderer/enums/ERoute'

const ROUTE_CONFIG: {[route in ERoute]: {path: string}} = {
	[ERoute.SETUP]: {
		path: '/'
	},
	[ERoute.SELECT_ACCOUNT]: {
		path: '/select-account'
	},
	[ERoute.CONFIGURE_ASSETS]: {
		path: '/configure-assets'
	},
	[ERoute.SAVE]: {
		path: '/save'
	}
}

export const getRoutePath = (route: ERoute): string => {
	return ROUTE_CONFIG[route].path
}
