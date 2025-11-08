'use client'

import type { ReactElement } from 'react'
import type { ControllerRenderProps, FieldValues, Path } from 'react-hook-form'

import { Input, Label } from '@/shared'

interface DescriptionInputProps<
	TFieldValues extends FieldValues = FieldValues,
> {
	field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>
	label?: string
	disabled?: boolean
	placeholder?: string
	error?: string
}

export function DescriptionInput<
	TFieldValues extends FieldValues = FieldValues,
>({
	field,
	label = 'Описание',
	disabled = false,
	placeholder = 'Введите описание (необязательно)',
	error,
}: DescriptionInputProps<TFieldValues>): ReactElement {
	return (
		<div className='space-y-2'>
			<Label htmlFor={field.name}>{label}</Label>
			<Input
				id={field.name}
				{...field}
				disabled={disabled}
				placeholder={placeholder}
			/>
			{error && <p className='text-sm text-destructive'>{error}</p>}
		</div>
	)
}
