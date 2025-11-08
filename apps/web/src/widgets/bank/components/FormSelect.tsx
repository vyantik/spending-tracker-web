'use client'

import type { ReactElement } from 'react'
import type { ControllerRenderProps, FieldValues, Path } from 'react-hook-form'

import { Label, Select } from '@/shared'

interface FormSelectProps<TFieldValues extends FieldValues = FieldValues> {
	field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>
	label: string
	options: Record<string, string>
	disabled?: boolean
	error?: string
	onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

export function FormSelect<TFieldValues extends FieldValues = FieldValues>({
	field,
	label,
	options,
	disabled = false,
	error,
	onChange,
}: FormSelectProps<TFieldValues>): ReactElement {
	return (
		<div className='space-y-2'>
			<Label htmlFor={field.name}>{label}</Label>
			<Select
				id={field.name}
				{...field}
				disabled={disabled}
				onChange={onChange || field.onChange}
			>
				{Object.entries(options).map(([value, optionLabel]) => (
					<option key={value} value={value}>
						{optionLabel}
					</option>
				))}
			</Select>
			{error && <p className='text-sm text-destructive'>{error}</p>}
		</div>
	)
}
