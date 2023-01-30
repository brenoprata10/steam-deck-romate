import * as Electron from 'electron'
import {useMount} from 'react-use'
import EChannel from 'main/enums/EChannel'
import {useState} from 'react'

const AutoUpdater = () => {
	const [updateStatus, setUpdateStatus] = useState('Checking Update...')

	useMount(() => {
		Electron.ipcRenderer.on(EChannel.AUTO_UPDATER, (_, message: string) => {
			setUpdateStatus(message)
		})
	})

	return <span>{updateStatus}</span>
}

export default AutoUpdater
