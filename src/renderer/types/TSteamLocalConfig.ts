type TSteamLocalConfig = {
	UserLocalConfigStore: {
		friends: {
			[userId in string]: {avatar: string; name: string; NameHistory: string[]}
		}
		Software: {
			Valve: {
				Steam: {
					apps: {
						[appId in number]: {
							LastPlayed: number
							Playtime: number
							LaunchOptions: string
						}
					}
				}
			}
		}
	}
}

export default TSteamLocalConfig
