'use client'

import type { ReactElement } from 'react'
import type { ControllerRenderProps, FieldValues, Path } from 'react-hook-form'

import { Input, Label } from '@/shared'

interface AmountInputProps<TFieldValues extends FieldValues = FieldValues> {
	field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>
	label?: string
	disabled?: boolean
	placeholder?: string
	error?: string
}

export function AmountInput<TFieldValues extends FieldValues = FieldValues>({
	field,
	label = 'Сумма',
	disabled = false,
	placeholder = 'Введите сумму',
	error,
}: AmountInputProps<TFieldValues>): ReactElement {
	return (
		<div className='space-y-2'>
			<Label htmlFor={field.name}>{label}</Label>
			<Input
				id={field.name}
				type='number'
				step='0.01'
				min='0'
				{...field}
				value={field.value != null ? field.value : ''}
				onChange={e => {
					const value = e.target.value
					if (value === '') {
						field.onChange(undefined)
					} else {
						const numValue = parseFloat(value)
						field.onChange(isNaN(numValue) ? undefined : numValue)
					}
				}}
				disabled={disabled}
				placeholder={placeholder}
			/>
			{error && <p className='text-sm text-destructive'>{error}</p>}
		</div>
	)
}
