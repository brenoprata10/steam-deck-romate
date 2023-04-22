type TSteamCategory = {
	key: string
	timestamp: number
	value: {
		id: string
		name: string
		added: number[]
	}
	conflictResolutionMethod: string
	strMethodId: string
	is_deleted: boolean
}

export default TSteamCategory
