import {useCallback, useEffect, useState} from 'react'
import TParserConfig from 'renderer/types/TParserConfig'
import Button from 'renderer/uikit/button/Button.component'
import Checkbox from 'renderer/uikit/checkbox/Checkbox.component'
import styles from './ParserCheckboxList.module.scss'

const ParserCheckboxList = ({
	parsers,
	title,
	ctaLabel,
	onSubmit
}: {
	parsers: TParserConfig[]
	title: string
	ctaLabel: string
	onSubmit: (parsers: TParserConfig[]) => void
}) => {
	const [selectedParsers, setSelectedParsers] = useState<string[]>([])

	useEffect(() => {
		setSelectedParsers(parsers.map((parser) => parser.id))
	}, [parsers])

	const submitParsers = useCallback(() => {
		onSubmit(parsers.filter((parser) => selectedParsers.includes(parser.id)))
	}, [onSubmit, parsers, selectedParsers])

	const toggleParserCheckbox = useCallback(
		(parserId: string) => {
			setSelectedParsers(
				selectedParsers.includes(parserId)
					? selectedParsers.filter((id) => id !== parserId)
					: [...selectedParsers, parserId]
			)
		},
		[selectedParsers]
	)

	return (
		<div className={styles['parser-checkbox-list']}>
			<b className={styles.title}>{title}</b>
			<div className={styles.list}>
				{parsers.map((parser) => (
					<div key={`parser-checkbox-${parser.id}`}>
						<Checkbox
							id={parser.id}
							label={parser.name}
							checked={selectedParsers.includes(parser.id)}
							onChange={() => toggleParserCheckbox(parser.id)}
						/>
					</div>
				))}
			</div>
			<Button transparent={true} onClick={submitParsers}>
				{ctaLabel}
			</Button>
		</div>
	)
}

export default ParserCheckboxList
