'use client'

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
	Input,
	Label,
} from '@/shared'

import { useCreateTransactionMutation } from '../hooks'

const categoryLabels: Record<string, string> = {
	FOOD: 'Еда',
	CLOTHES: 'Одежда',
	MARKETPLACES: 'Маркетплейсы',
	CHEMICALS: 'Химия',
	DRUGS: 'Лекарства',
	TECHNIQUE: 'Техника',
	GAMES: 'Игры',
	OTHER: 'Другое',
}

export function CreateWithdrawForm(): ReactElement {
	const { createTransaction, isLoadingCreate } =
		useCreateTransactionMutation()

	const form = useForm<TransactionCreateRequest>({
		resolver: zodResolver(TransactionCreateRequestSchema),
		defaultValues: {
			amount: 0,
			type: 'WITHDRAW',
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
				<CardTitle>Снятие</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-4'
					>
						<FormField
							control={form.control}
							name='category'
							render={({ field }) => (
								<div className='space-y-2'>
									<Label htmlFor='category'>Категория</Label>
									<select
										id='category'
										{...field}
										disabled={isLoadingCreate}
										className='h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'
									>
										{Object.entries(categoryLabels).map(
											([value, label]) => (
												<option
													key={value}
													value={value}
												>
													{label}
												</option>
											),
										)}
									</select>
									{form.formState.errors.category && (
										<p className='text-sm text-destructive'>
											{
												form.formState.errors.category
													.message
											}
										</p>
									)}
								</div>
							)}
						/>
						<FormField
							control={form.control}
							name='amount'
							render={({ field }) => (
								<div className='space-y-2'>
									<Label htmlFor='amount'>Сумма</Label>
									<Input
										id='amount'
										type='number'
										step='0.01'
										min='0'
										{...field}
										onChange={e =>
											field.onChange(
												parseFloat(e.target.value) || 0,
											)
										}
										disabled={isLoadingCreate}
										placeholder='Введите сумму'
									/>
									{form.formState.errors.amount && (
										<p className='text-sm text-destructive'>
											{
												form.formState.errors.amount
													.message
											}
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
										placeholder='Введите описание (необязательно)'
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
							{isLoadingCreate
								? 'Создание...'
								: 'Создать снятие'}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}

