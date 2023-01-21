import {useCallback, useContext, useState} from 'react'
import {useMount} from 'react-use'
import {CommonDispatchContext} from 'renderer/context'
import useSteamUserId from 'renderer/hooks/useSteamUserId'
import {EAction} from 'renderer/reducer'
import TUserData from 'renderer/types/TUserData'
import {getAvailableUserAccounts} from 'renderer/utils/steam-shortcuts'
import styles from './SetupTitle.module.scss'

const SetupTitle = () => {
	const steamUserId = useSteamUserId()
	const [_, setUserAccounts] = useState<TUserData[]>([])

	const dispatch = useContext(CommonDispatchContext)

	const selectSteamUserId = useCallback(
		(id: string) => dispatch({type: EAction.SET_STEAM_USER_ID, payload: id}),
		[dispatch]
	)

	useMount(() => {
		const handleUserAccounts = async () => {
			const availableUserAccounts = await getAvailableUserAccounts()
			setUserAccounts(availableUserAccounts)

			if (availableUserAccounts.length === 1 && !steamUserId) {
				selectSteamUserId(availableUserAccounts[0].id)
				return
			}
		}

		void handleUserAccounts()
	})

	return (
		<div className={styles['setup-title']}>
			<span>Welcome</span>
		</div>
	)
}

export default SetupTitle
