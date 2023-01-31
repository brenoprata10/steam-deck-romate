import * as Electron from 'electron'
import EAutoUpdaterMessage from 'main/enums/EAutoUpdaterMessage'
import EChannel from 'main/enums/EChannel'
import TAutoUpdaterMessage from 'main/types/TAutoUpdaterMessage'
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useMount} from 'react-use'
import {isDeveloperMode} from 'renderer/utils/node-env'
import styles from './AutoUpdater.module.scss'

const AutoUpdater = () => {
	const navigate = useNavigate()
	const [updateStatus, setUpdateStatus] = useState<TAutoUpdaterMessage>({status: EAutoUpdaterMessage.CHECKING_UPDATE})

	useMount(() => {
		Electron.ipcRenderer.on(EChannel.AUTO_UPDATER, (_, message: TAutoUpdaterMessage) => {
			setUpdateStatus(message)
			console.log(message)
		})
		if (isDeveloperMode) {
			//navigate(getRoutePath(ERoute.SETUP))
		}
	})

	return (
		<div className={styles['auto-updater']}>
			<h3>
				{updateStatus.status} - {updateStatus.text}
			</h3>
		</div>
	)
}

export default AutoUpdater
