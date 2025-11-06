'use client'

import type { BankCreateRequest } from '@hermes/contracts'
import { BankCreateRequestSchema } from '@hermes/contracts'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ReactElement } from 'react'
import { useForm } from 'react-hook-form'

import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Form,
	FormField,
	Input,
	Label,
} from '@/shared'

import { useCreateBankMutation } from '../hooks'

export function CreateBankForm(): ReactElement {
	const { createBank, isLoadingCreate } = useCreateBankMutation()

	const form = useForm<BankCreateRequest>({
		resolver: zodResolver(BankCreateRequestSchema),
		defaultValues: {
			name: '',
			description: '',
		},
	})

	const onSubmit = (values: BankCreateRequest) => {
		createBank(values)
	}

	return (
		<Card className='w-full max-w-md'>
			<CardHeader>
				<CardTitle>Создать банк</CardTitle>
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
										disabled={isLoadingCreate}
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
										disabled={isLoadingCreate}
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
							disabled={isLoadingCreate}
							className='w-full'
						>
							{isLoadingCreate ? 'Создание...' : 'Создать банк'}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}
