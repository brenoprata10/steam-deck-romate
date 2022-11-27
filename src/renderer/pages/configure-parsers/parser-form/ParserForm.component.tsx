import TParserConfig from 'renderer/types/TParserConfig'
import {useForm} from 'react-hook-form'
import Button, {EButtonType, EButtonVariant} from 'renderer/uikit/button/Button.component'
import styles from './ParserForm.module.scss'

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
	const {register} = useForm<TParserConfig>({defaultValues: parser})
	const handleOnChange = (newParser: TParserConfig) => onChange(newParser)
	const handleRawPropertyChange = ({value, property}: {value: string | string[]; property: string}) =>
		handleOnChange({...parser, [property]: value})

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
			<input
				{...register('romDirectory')}
				required={true}
				type={'text'}
				onChange={({target: {value}}) => handleRawPropertyChange({value, property: 'romDirectory'})}
			/>
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
