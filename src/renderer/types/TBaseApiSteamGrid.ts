type TBaseApiSteamGrid<T> =
	| {
			success: true
			data: T
	  }
	| {success: false; error: {status: number; statusMessage: string}}

export default TBaseApiSteamGrid
