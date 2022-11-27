import TParserConfig from 'renderer/types/TParserConfig'
import {useForm} from 'react-hook-form'
import Button, {EButtonType, EButtonVariant} from 'renderer/uikit/button/Button.component'
import styles from './ParserForm.module.scss'
import useSelectFolder from 'renderer/hooks/useSelectFolder'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faFolderOpen} from '@fortawesome/free-solid-svg-icons'
import {useCallback} from 'react'

const ParserForm = ({
	parser,
	className,
	onChange,
	onDelete
}: {
	parser: TParserConfig
	className?: string
	onChange: (parser: TParserConfig) => void
	onDelete: () => void
}) => {
	const {trigger: selectRomDirectory} = useSelectFolder('Select ROM directory')
	const {register, setValue} = useForm<TParserConfig>({defaultValues: parser})

	const handleOnChange = useCallback((newParser: TParserConfig) => onChange(newParser), [onChange])

	const handleRawPropertyChange = useCallback(
		({value, property}: {value: string | string[]; property: string}) => handleOnChange({...parser, [property]: value}),
		[handleOnChange, parser]
	)

	const handleRomDirectoryFolderSelect = useCallback(async () => {
		const {canceled, filePaths} = await selectRomDirectory()
		if (canceled || filePaths.length === 0) {
			return
		}
		const romsDirectoryPath = filePaths[0]
		handleRawPropertyChange({value: romsDirectoryPath, property: 'romDirectory'})
		setValue('romDirectory', romsDirectoryPath)
	}, [handleRawPropertyChange, selectRomDirectory, setValue])

	return (
		<form className={`${className ?? ''} ${styles['parser-form']}`}>
			<label htmlFor={'name'}>Name: *</label>{' '}
			<input
				{...register('name')}
				autoFocus
				required={true}
				type={'text'}
				onChange={({target: {value}}) => handleRawPropertyChange({value, property: 'name'})}
			/>
			<label htmlFor={'romDirectory'}>Rom Directory: *</label>{' '}
			<div className={styles['rom-directory-wrapper']}>
				<input
					{...register('romDirectory')}
					required={true}
					type={'text'}
					className={styles['rom-directory-input']}
					onChange={({target: {value}}) => handleRawPropertyChange({value, property: 'romDirectory'})}
				/>
				<FontAwesomeIcon
					icon={faFolderOpen}
					className={styles['rom-directory-folder-icon']}
					size={'2x'}
					onClick={handleRomDirectoryFolderSelect as () => void}
				/>
			</div>
			<label htmlFor={'supportedFileTypes'}>File Types: *</label>{' '}
			<input
				{...register('supportedFileTypes')}
				required={true}
				type={'text'}
				onChange={({target: {value}}) =>
					handleRawPropertyChange({
						value: value ? value.split(',').filter((fileType) => Boolean(fileType)) : [],
						property: 'supportedFileTypes'
					})
				}
			/>
			<label htmlFor={'executable.path'}>Executable Path: *</label>{' '}
			<input
				{...register('executable.path')}
				required={true}
				type={'text'}
				onChange={({target: {value}}) => handleOnChange({...parser, executable: {...parser.executable, path: value}})}
			/>
			<label htmlFor={'executable.arguments'}>Executable Arguments:</label>{' '}
			<input
				{...register('executable.arguments')}
				type={'text'}
				onChange={({target: {value}}) =>
					handleOnChange({...parser, executable: {...parser.executable, arguments: value}})
				}
			/>
			<div className={styles['button-wrapper']}>
				<Button type={EButtonType.SUBMIT} variant={EButtonVariant.SECONDARY} transparent={true} onClick={onDelete}>
					Delete Parser
				</Button>
			</div>
		</form>
	)
}

export default ParserForm
