import { InputHTMLAttributes, ReactElement } from 'react'

import { Input } from '@/shared'

type InputType = InputHTMLAttributes<HTMLInputElement>['type']
interface IAuthInputProps {
	name: string
	type?: InputType
}

export const AuthInput = ({ name, type }: IAuthInputProps): ReactElement => {
	return (
		<div>
			<Input className='w-1/2' placeholder={name} type={type} />
		</div>
	)
}
