import TUserData from 'renderer/types/TUserData'
import CardOption from 'renderer/uikit/card-option/CardOption.component'
import Modal from 'renderer/uikit/modal/Modal.component'
import styles from './ChangeAccountModal.module.scss'
import DECK_LOGO from '../../../../../assets/deck-logo.png'
import {useCallback} from 'react'

const ChangeAccountModal = ({
	userAccounts,
	selectedAccountId,
	isOpened,
	onChange,
	onClose
}: {
	userAccounts: TUserData[]
	selectedAccountId?: string | null
	isOpened: boolean
	onChange: (userId: string) => void
	onClose: () => void
}) => {
	const onSelectAccount = useCallback(
		(userAccountId: string) => {
			onChange(userAccountId)
		},
		[onChange]
	)

	return (
		<Modal
			className={styles['change-account-modal']}
			isOpened={isOpened}
			title={'Choose User Account:'}
			onClose={onClose}
		>
			<div className={styles.grid}>
				{userAccounts.map((userAccount) => (
					<CardOption
						key={userAccount.id}
						imageClassName={
							userAccount.id !== selectedAccountId && !userAccount.avatarPictureSrc
								? styles['default-image']
								: undefined
						}
						isSelected={userAccount.id === selectedAccountId}
						imageSrc={userAccount.avatarPictureSrc ?? DECK_LOGO}
						label={userAccount.name ?? userAccount.id}
						onClick={() => {
							onSelectAccount(userAccount.id)
						}}
					/>
				))}
			</div>
		</Modal>
	)
}

export default ChangeAccountModal
