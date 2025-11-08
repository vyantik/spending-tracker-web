'use client'

import type { ReactElement } from 'react'
import type { ControllerRenderProps, FieldValues, Path } from 'react-hook-form'

import { Input, Label } from '@/shared'

interface FormInputProps<TFieldValues extends FieldValues = FieldValues> {
	field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>
	label: string
	disabled?: boolean
	placeholder?: string
	error?: string
	type?: string
}

export function FormInput<TFieldValues extends FieldValues = FieldValues>({
	field,
	label,
	disabled = false,
	placeholder,
	error,
	type = 'text',
}: FormInputProps<TFieldValues>): ReactElement {
	return (
		<div className='space-y-2'>
			<Label htmlFor={field.name}>{label}</Label>
			<Input
				id={field.name}
				type={type}
				{...field}
				disabled={disabled}
				placeholder={placeholder}
			/>
			{error && <p className='text-sm text-destructive'>{error}</p>}
		</div>
	)
}
