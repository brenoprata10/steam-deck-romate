import {faChevronDown} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useCallback, useContext, useState} from 'react'
import {useMount} from 'react-use'
import {CommonDispatchContext} from 'renderer/context'
import useSteamUserId from 'renderer/hooks/useSteamUserId'
import {EAction} from 'renderer/reducer'
import TUserData from 'renderer/types/TUserData'
import {getAvailableUserAccounts} from 'renderer/utils/steam-shortcuts'
import ChangeAccountModal from 'renderer/pages/setup/change-account-modal/ChangeAccountModal.component'
import styles from './SetupTitle.module.scss'

const SetupTitle = () => {
	const steamUserId = useSteamUserId()
	const [userAccounts, setUserAccounts] = useState<TUserData[]>([])
	const [showAccountPicker, setShowAccountPicker] = useState(false)
	const selectedUser = userAccounts.find((userAccount) => userAccount.id === steamUserId)

	const dispatch = useContext(CommonDispatchContext)

	const selectSteamUserId = useCallback(
		(id: string) => dispatch({type: EAction.SET_STEAM_USER_ID, payload: id}),
		[dispatch]
	)

	useMount(() => {
		const handleUserAccounts = async () => {
			const availableUserAccounts = await getAvailableUserAccounts()
			setUserAccounts(availableUserAccounts)

			if (availableUserAccounts.length > 0 && !steamUserId) {
				selectSteamUserId(availableUserAccounts[0].id)
				return
			}
		}

		void handleUserAccounts()
	})

	return (
		<>
			<div className={styles['setup-title']} onClick={() => setShowAccountPicker(true)}>
				<img src={selectedUser?.avatarPictureSrc} />
				{selectedUser?.name}
				<FontAwesomeIcon icon={faChevronDown} className={styles.icon} rotation={showAccountPicker ? 180 : undefined} />
			</div>
			<ChangeAccountModal
				userAccounts={userAccounts}
				isOpened={showAccountPicker}
				selectedAccountId={steamUserId}
				onChange={selectSteamUserId}
				onClose={() => setShowAccountPicker(false)}
			/>
		</>
	)
}

export default SetupTitle
