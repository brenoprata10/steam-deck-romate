import {useCallback, useState} from 'react'
import {getGameIdByName} from 'renderer/api/steam-grid.api'
import Button from 'renderer/uikit/button/Button.component'
import Modal from 'renderer/uikit/modal/Modal.component'
import styles from './SteamGridKeyModal.module.scss'
import Input from 'renderer/uikit/input/Input.component'

const SteamGridKeyModal = ({
	isOpened,
	isCloseable,
	onSave,
	onClose
}: {
	onSave: (apiKey: string) => void
	isOpened: boolean
	isCloseable: boolean
	onClose: () => void
}) => {
	const [apiKey, setApiKey] = useState<string | undefined>('')
	const [errorMessage, setErrorMessage] = useState<string | undefined>()

	const onChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			if (errorMessage) {
				setErrorMessage(undefined)
			}
			setApiKey(event.target.value)
		},
		[errorMessage]
	)

	const testApiKey = useCallback(async () => {
		if (!apiKey) {
			return
		}
		try {
			const gameId = await getGameIdByName({gameName: 'Cyberpunk', apiKey})
			if (gameId) {
				onSave(apiKey)
			}
		} catch (error) {
			console.error(error)
			setErrorMessage('Api key is not valid, please check if the input is correct.')
			setApiKey('')
		}
	}, [onSave, apiKey])

	return (
		<Modal
			className={styles['steam-grid-modal']}
			isOpened={isOpened}
			title={'Provide Steam Grid API Key'}
			isCloseable={isCloseable}
			footerTrailing={
				<div className={styles.save}>
					<span className={styles['error-message']}>{errorMessage}</span>
					<Button disabled={!apiKey} onClick={testApiKey}>
						Save
					</Button>
				</div>
			}
			onClose={onClose}
		>
			<p>
				We need an API key from the{' '}
				<a href={'https://www.steamgriddb.com/'} target={'_blank'} rel='noreferrer'>
					Steam Grid Project
				</a>{' '}
				in order to load assets properly.
			</p>
			<p>
				Generate API key{' '}
				<a href={'https://www.steamgriddb.com/profile/preferences/api'} target={'_blank'} rel='noreferrer'>
					here
				</a>
				.
			</p>
			<div className={styles['input-wrapper']}>
				Paste the key here:{' '}
				<Input
					nativeProps={{
						value: apiKey,
						type: 'text',
						onChange
					}}
					onClipboardPaste={(text) => {
						setApiKey(text)
					}}
				/>
			</div>
		</Modal>
	)
}

export default SteamGridKeyModal
