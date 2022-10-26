import {readVdf, VdfMap} from 'steam-binary-vdf'
import {homedir} from 'os'
import path from 'path'
import {getBufferFileData} from 'renderer/utils/files'

export const getSteamShortcuts = async (): Promise<VdfMap> => {
	const buffer = await getBufferFileData(
		path.join(homedir(), '.steam/debian-installation/userdata/48553049/config/shortcuts.vdf')
	)
	return readVdf(buffer)
}
