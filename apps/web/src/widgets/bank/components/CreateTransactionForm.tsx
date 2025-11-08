'use client'

import { AmountInput, DescriptionInput, FormSelect } from '.'
import type { TransactionCreateRequest } from '@hermes/contracts'
import { TransactionCreateRequestSchema } from '@hermes/contracts'
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

import { categoryLabels, typeLabels } from '../constants/labels'
import { useCreateTransactionMutation } from '../hooks'

export function CreateTransactionForm(): ReactElement {
	const { createTransaction, isLoadingCreate } =
		useCreateTransactionMutation()

	const form = useForm<TransactionCreateRequest>({
		resolver: zodResolver(TransactionCreateRequestSchema),
		defaultValues: {
			amount: 0,
			type: 'DEPOSIT',
			category: 'OTHER',
			description: '',
		},
	})

	const onSubmit = (values: TransactionCreateRequest) => {
		createTransaction(values)
		form.reset()
	}

	return (
		<Card className='w-full max-w-md'>
			<CardHeader>
				<CardTitle>Создать транзакцию</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-4'
					>
						<FormField
							control={form.control}
							name='type'
							render={({ field }) => (
								<FormSelect
									field={field}
									label='Тип'
									options={typeLabels}
									disabled={isLoadingCreate}
									error={form.formState.errors.type?.message}
								/>
							)}
						/>
						<FormField
							control={form.control}
							name='category'
							render={({ field }) => (
								<FormSelect
									field={field}
									label='Категория'
									options={categoryLabels}
									disabled={isLoadingCreate}
									error={
										form.formState.errors.category?.message
									}
								/>
							)}
						/>
						<FormField
							control={form.control}
							name='amount'
							render={({ field }) => (
								<AmountInput
									field={field}
									disabled={isLoadingCreate}
									error={
										form.formState.errors.amount?.message
									}
								/>
							)}
						/>
						<FormField
							control={form.control}
							name='description'
							render={({ field }) => (
								<DescriptionInput
									field={field}
									disabled={isLoadingCreate}
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
							{isLoadingCreate
								? 'Создание...'
								: 'Создать транзакцию'}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}
