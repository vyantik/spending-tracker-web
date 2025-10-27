'use client'

import { InputHTMLAttributes, ReactElement, useState } from 'react'

import { Input } from '@/shared'

type InputType = InputHTMLAttributes<HTMLInputElement>['type']
interface IAuthInputProps {
	name: string
	type?: InputType
	value?: string
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
	onBlur?: () => void
	onFocus?: () => void
	error?: string
	disabled?: boolean
}

export const AuthInput = ({
	name,
	type,
	value = '',
	onChange,
	onBlur,
	onFocus,
	error,
	disabled,
}: IAuthInputProps): ReactElement => {
	const [isFocused, setIsFocused] = useState(false)

	const handleFocus = () => {
		setIsFocused(true)
		onFocus?.()
	}

	const handleBlur = () => {
		if (!value) {
			setIsFocused(false)
		}
		onBlur?.()
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange?.(e)
	}

	return (
		<div className='relative w-full'>
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
				className='w-full pt-8 pb-2'
				type={type}
				onFocus={handleFocus}
				onBlur={handleBlur}
				onChange={handleChange}
				value={value}
				disabled={disabled}
			/>
			{error && <p className='text-destructive text-sm mt-1'>{error}</p>}
		</div>
	)
}
