'use client'

import { InputHTMLAttributes, ReactElement, useState } from 'react'

import { Input } from '@/shared'

type InputType = InputHTMLAttributes<HTMLInputElement>['type']
interface IAuthInputProps {
	name: string
	type?: InputType
}

export const AuthInput = ({ name, type }: IAuthInputProps): ReactElement => {
	const [isFocused, setIsFocused] = useState(false)
	const [value, setValue] = useState('')

	const handleFocus = () => {
		setIsFocused(true)
	}

	const handleBlur = () => {
		if (!value) {
			setIsFocused(false)
		}
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value)
	}

	return (
		<div className='relative w-1/2'>
			<label
				className={`absolute left-3 pointer-events-none transition-all duration-300 ${
					isFocused || value
						? 'top-1 text-xs text-muted-foreground'
						: 'top-2 text-base text-muted-foreground'
				}`}
			>
				{name}
			</label>
			<Input
				className='w-full pt-6 pb-2'
				type={type}
				onFocus={handleFocus}
				onBlur={handleBlur}
				onChange={handleChange}
				value={value}
			/>
		</div>
	)
}
