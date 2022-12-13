import {useMount} from 'react-use'
import TParserConfig from 'renderer/types/TParserConfig'
import storage from 'electron-json-storage'
import EStorageKey from 'renderer/enums/EStorageKey'
import {useState} from 'react'
import ParserCheckboxList from 'renderer/pages/configure-parsers/parser-checkbox-list/ParserCheckboxList.component'

const ParserImport = ({onImport}: {onImport: (parsers: TParserConfig[]) => void}) => {
	const [parsers, setParsers] = useState<TParserConfig[]>([])

	useMount(() => {
		storage.get(EStorageKey.PARSERS, {dataPath: './'}, (error, data) => {
			const storageParsers = (data as {parsers?: TParserConfig[]})?.parsers ?? []
			if (error || !storageParsers || storageParsers.length === 0) {
				alert(
					`Could not read ${EStorageKey.PARSERS}.json file.\n\nPlease check if the file is within the same folder path.`
				)
				console.error(error ?? 'PARSERS.json is either empty or does not exist.')
				return
			}
			setParsers(storageParsers)
		})
	})

	return <ParserCheckboxList parsers={parsers} ctaLabel={'Confirm'} title={'Import Parsers'} onSubmit={onImport} />
}

export default ParserImport
