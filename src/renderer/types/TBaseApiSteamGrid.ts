type TBaseApiSteamGrid<T> =
	| {
			success: true
			data: T
	  }
	| {success: false; error: {status: number; statusMessage?: string; statusText: string}}

export default TBaseApiSteamGrid
