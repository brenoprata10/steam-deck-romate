import {useCallback, useContext, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useMount} from 'react-use'
import {CommonDispatchContext} from 'renderer/context'
import ERoute from 'renderer/enums/ERoute'
import useSteamUserId from 'renderer/hooks/useSteamUserId'
import {getRoutePath} from 'renderer/route'
import Button, {EButtonVariant} from 'renderer/uikit/button/Button.component'
import PageFooter from 'renderer/uikit/page/footer/PageFooter.component'
import Page from 'renderer/uikit/page/Page.component'
import {getAvailableUserAccounts} from 'renderer/utils/steam-shortcuts'
import {EAction} from 'renderer/reducer'
import TUserData from 'renderer/types/TUserData'
import CardOption from 'renderer/uikit/card-option/CardOption.component'
import DECK_LOGO from '../../../../assets/deck-logo.png'
import styles from './SelectUserAccount.module.scss'

const SelectUserAccount = () => {
	const navigate = useNavigate()
	const steamUserId = useSteamUserId()
	const [userAccounts, setUserAccounts] = useState<TUserData[]>([])
	const dispatch = useContext(CommonDispatchContext)

	const onBack = useCallback(() => navigate(getRoutePath(ERoute.SETUP)), [navigate])
	const onNext = useCallback(() => navigate(getRoutePath(ERoute.CONFIGURE_ASSETS)), [navigate])

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
			}
		}

		void handleUserAccounts()
	})

	return (
		<Page
			title='User Configuration'
			subtitle='Choose user account:'
			contentClassName={styles['select-user-account']}
			footerComponent={
				<PageFooter
					leadingComponent={
						<Button onClick={onBack} variant={EButtonVariant.SECONDARY}>
							Back
						</Button>
					}
					trailingComponent={<Button onClick={onNext}>Next</Button>}
				/>
			}
		>
			<div className={styles.grid}>
				{userAccounts.map((userAccount) => (
					<CardOption
						key={userAccount.id}
						imageClassName={
							userAccount.id !== steamUserId && !userAccount.avatarPictureSrc ? styles['default-image'] : undefined
						}
						isSelected={userAccount.id === steamUserId}
						imageSrc={userAccount.avatarPictureSrc ?? DECK_LOGO}
						label={userAccount.name ?? userAccount.id}
						onClick={() => {
							selectSteamUserId(userAccount.id)
						}}
					/>
				))}
			</div>
		</Page>
	)
}

export default SelectUserAccount
