import TBaseApiSteamGrid from 'renderer/types/TBaseApiSteamGrid'

type TSteamGridSearch = TBaseApiSteamGrid<{id: number; name: string; types: string[]; verified: boolean}[]>

export default TSteamGridSearch
