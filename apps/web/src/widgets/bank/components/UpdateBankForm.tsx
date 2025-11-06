'use client'

import type { BankGetResponse, BankUpdateRequest } from '@hermes/contracts'
import { BankUpdateRequestSchema } from '@hermes/contracts'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ReactElement } from 'react'
import { useForm } from 'react-hook-form'

import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Form,
	FormField,
	Input,
	Label,
} from '@/shared'

import { useUpdateBankMutation } from '../hooks'

interface UpdateBankFormProps {
	bank: BankGetResponse
}

export function UpdateBankForm({ bank }: UpdateBankFormProps): ReactElement {
	const { updateBank, isLoadingUpdate } = useUpdateBankMutation()

	const form = useForm<BankUpdateRequest>({
		resolver: zodResolver(BankUpdateRequestSchema),
		defaultValues: {
			name: bank.name,
			description: bank.description || '',
		},
	})

	const onSubmit = (values: BankUpdateRequest) => {
		updateBank(values)
	}

	return (
		<Card className='w-full max-w-md'>
			<CardHeader>
				<CardTitle>Редактировать банк</CardTitle>
				<CardDescription>Измените информацию о банке</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-4'
					>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<div className='space-y-2'>
									<Label htmlFor='name'>Название</Label>
									<Input
										id='name'
										{...field}
										disabled={isLoadingUpdate}
										placeholder='Введите название банка'
									/>
									{form.formState.errors.name && (
										<p className='text-sm text-destructive'>
											{form.formState.errors.name.message}
										</p>
									)}
								</div>
							)}
						/>
						<FormField
							control={form.control}
							name='description'
							render={({ field }) => (
								<div className='space-y-2'>
									<Label htmlFor='description'>
										Описание
									</Label>
									<Input
										id='description'
										{...field}
										disabled={isLoadingUpdate}
										placeholder='Введите описание банка (необязательно)'
									/>
									{form.formState.errors.description && (
										<p className='text-sm text-destructive'>
											{
												form.formState.errors
													.description.message
											}
										</p>
									)}
								</div>
							)}
						/>
						<Button
							type='submit'
							disabled={isLoadingUpdate}
							className='w-full'
						>
							{isLoadingUpdate
								? 'Обновление...'
								: 'Обновить банк'}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}
