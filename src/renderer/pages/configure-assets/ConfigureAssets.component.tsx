import Page from 'renderer/uikit/page/Page.component'
import PageFooter from 'renderer/uikit/page/footer/PageFooter.component'
import Button from 'renderer/uikit/button/Button.component'
import {EButtonVariant} from 'renderer/uikit/button/Button.component'
import {useNavigate} from 'react-router-dom'
import {getRoutePath} from 'renderer/route'
import ERoute from 'renderer/enums/ERoute'
import {useCallback} from 'react'
import useGames from 'renderer/hooks/useGames'
import Card from 'renderer/uikit/card/Card.component'
import styles from './ConfigureAssets.module.scss'

const ConfigureAssets = () => {
	const navigate = useNavigate()
	const games = useGames()

	const onBack = useCallback(() => navigate(getRoutePath(ERoute.SETUP)), [navigate])

	return (
		<Page
			title='Configuration'
			subtitle='Choose game assets:'
			contentClassName={styles['configure-assets']}
			footerComponent={
				<PageFooter
					leadingComponent={
						<Button onClick={onBack} variant={EButtonVariant.SECONDARY}>
							Back
						</Button>
					}
					trailingComponent={<Button onClick={onBack}>Save</Button>}
				/>
			}
		>
			{games.map((game, index) => (
				<Card key={`${game.name}-${index}`} title={game.name}>
					<div className={styles['assets-grid']}>
						<div
							className={styles.asset}
							style={{
								backgroundImage: 'url(https://upload.wikimedia.org/wikipedia/en/e/e5/Forged_In_Shadow_Torch_cover.jpg)'
							}}
						/>
						<div
							className={styles.asset}
							style={{backgroundImage: 'url(https://i.ytimg.com/vi/BZEiT8QZbmY/maxresdefault.jpg)'}}
						/>
						<div
							className={styles.asset}
							style={{
								backgroundImage: 'url(https://upload.wikimedia.org/wikipedia/en/e/e5/Forged_In_Shadow_Torch_cover.jpg)'
							}}
						/>
						<div
							className={styles.asset}
							style={{backgroundImage: 'url(https://i.ytimg.com/vi/BZEiT8QZbmY/maxresdefault.jpg)'}}
						/>
						<div
							className={styles.asset}
							style={{
								backgroundImage: 'url(https://upload.wikimedia.org/wikipedia/en/e/e5/Forged_In_Shadow_Torch_cover.jpg)'
							}}
						/>
					</div>
				</Card>
			))}
		</Page>
	)
}

export default ConfigureAssets
