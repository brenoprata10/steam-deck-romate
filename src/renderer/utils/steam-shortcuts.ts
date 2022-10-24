import {readVdf} from 'steam-binary-vdf'
import fs from 'fs'
import {homedir} from 'os'
import path from 'path'

export const readShortcutsFile = () => {
	fs.readFile(
		path.join(homedir(), '.steam/debian-installation/userdata/48553049/config/shortcuts.vdf'),
		(_, buffer) => {
			const shortcuts = readVdf(buffer)
			console.log(shortcuts) // output below;
		}
	)
}
