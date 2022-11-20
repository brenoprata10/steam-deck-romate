import TParserConfig from 'renderer/types/TParserConfig'
import {useForm} from 'react-hook-form'
import Button, {EButtonType, EButtonVariant} from 'renderer/uikit/button/Button.component'

const ParserForm = ({parser, className}: {parser: TParserConfig; className?: string}) => {
	const {register} = useForm<TParserConfig>({defaultValues: parser})
	//const onSubmit = async (data) => console.log(data)

	return (
		<form className={className}>
			<label htmlFor={'name'}>Name:</label> <input {...register('name')} autoFocus type={'text'} />
			<label htmlFor={'romDirectory'}>Rom Directory:</label> <input {...register('romDirectory')} type={'text'} />
			<label htmlFor={'executable.path'}>Executable Path:</label>{' '}
			<input {...register('executable.path')} type={'text'} />
			<label htmlFor={'executable.arguments'}>Executable Path:</label>{' '}
			<input {...register('executable.arguments')} type={'text'} />
			<label htmlFor={'supportedFileTypes'}>File Types:</label>{' '}
			<input {...register('supportedFileTypes')} type={'text'} />
			<label htmlFor={'category'}>Category:</label> <input {...register('category')} type={'text'} />
			<Button type={EButtonType.SUBMIT} variant={EButtonVariant.SECONDARY}>
				Save Parser
			</Button>
		</form>
	)
}

export default ParserForm
