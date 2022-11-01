import {useCallback} from 'react'
import {useNavigate} from 'react-router-dom'
import {useMount} from 'react-use'
import ERoute from 'renderer/enums/ERoute'
import {getRoutePath} from 'renderer/route'
import Button, {EButtonVariant} from 'renderer/uikit/button/Button.component'
import PageFooter from 'renderer/uikit/page/footer/PageFooter.component'
import Page from 'renderer/uikit/page/Page.component'
import {getAvailableUserAccounts} from 'renderer/utils/steam-shortcuts'

const SelectUserAccount = () => {
	const navigate = useNavigate()

	const onBack = useCallback(() => navigate(getRoutePath(ERoute.SETUP)), [navigate])
	const onNext = useCallback(() => navigate(getRoutePath(ERoute.CONFIGURE_ASSETS)), [navigate])

	useMount(() => {
		void getAvailableUserAccounts()
	})

	return (
		<Page
			title='User Configuration'
			subtitle='Choose user account:'
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
			<span>OI</span>
		</Page>
	)
}

export default SelectUserAccount
