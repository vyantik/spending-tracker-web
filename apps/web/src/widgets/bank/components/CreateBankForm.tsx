'use client'

import { FormInput } from '.'
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
								<FormInput
									field={field}
									label='Название'
									disabled={isLoadingCreate}
									placeholder='Введите название банка'
									error={form.formState.errors.name?.message}
								/>
							)}
						/>
						<FormField
							control={form.control}
							name='description'
							render={({ field }) => (
								<FormInput
									field={field}
									label='Описание'
									disabled={isLoadingCreate}
									placeholder='Введите описание банка (необязательно)'
									error={
										form.formState.errors.description
											?.message
									}
								/>
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
