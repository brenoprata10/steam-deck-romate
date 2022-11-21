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
	const handleOnChange = ({value, property}: {value: string; property: string}) =>
		onChange({...parser, [property]: value})

	return (
		<form className={`${className ?? ''} ${styles['parser-form']}`}>
			<label htmlFor={'name'}>Name: *</label>{' '}
			<input
				{...register('name')}
				autoFocus
				required={true}
				type={'text'}
				onChange={({target: {value}}) => handleOnChange({value, property: 'name'})}
			/>
			<label htmlFor={'romDirectory'}>Rom Directory: *</label>{' '}
			<input
				{...register('romDirectory')}
				required={true}
				type={'text'}
				onChange={({target: {value}}) => handleOnChange({value, property: 'romDirectory'})}
			/>
			<label htmlFor={'supportedFileTypes'}>File Types: *</label>{' '}
			<input
				{...register('supportedFileTypes')}
				required={true}
				type={'text'}
				onChange={({target: {value}}) => handleOnChange({value, property: 'supportedFileTypes'})}
			/>
			<label htmlFor={'executable.path'}>Executable Path: *</label>{' '}
			<input
				{...register('executable.path')}
				required={true}
				type={'text'}
				onChange={({target: {value}}) => handleOnChange({value, property: 'executable.path'})}
			/>
			<label htmlFor={'executable.arguments'}>Executable Arguments:</label>{' '}
			<input
				{...register('executable.arguments')}
				type={'text'}
				onChange={({target: {value}}) => handleOnChange({value, property: 'executable.arguments'})}
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
