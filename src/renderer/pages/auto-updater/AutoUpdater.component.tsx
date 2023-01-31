import * as Electron from 'electron'
import EAutoUpdaterMessage from 'main/enums/EAutoUpdaterMessage'
import EChannel from 'main/enums/EChannel'
import TAutoUpdaterMessage from 'main/types/TAutoUpdaterMessage'
import {useCallback, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useMount} from 'react-use'
import ERoute from 'renderer/enums/ERoute'
import {getRoutePath} from 'renderer/route'
import {isDeveloperMode} from 'renderer/utils/node-env'
import styles from './AutoUpdater.module.scss'

const AutoUpdater = () => {
	const navigate = useNavigate()
	const [updateStatus, setUpdateStatus] = useState<TAutoUpdaterMessage>({status: EAutoUpdaterMessage.CHECKING_UPDATE})

	const goToNextScreen = useCallback(() => {
		navigate(getRoutePath(ERoute.SETUP))
	}, [navigate])

	useMount(() => {
		Electron.ipcRenderer.on(EChannel.AUTO_UPDATER, (_, message: TAutoUpdaterMessage) => {
			setUpdateStatus(message)
			if ([EAutoUpdaterMessage.ERROR, EAutoUpdaterMessage.UPDATE_NOT_AVAILABLE].includes(message.status)) {
				goToNextScreen()
			}
		})
		if (isDeveloperMode) {
			goToNextScreen()
		}
	})

	return (
		<div className={styles['auto-updater']}>
			<h1>
				{updateStatus.status}
				{updateStatus.text ? ` - ${updateStatus.text}` : ''}
			</h1>
		</div>
	)
}

export default AutoUpdater
