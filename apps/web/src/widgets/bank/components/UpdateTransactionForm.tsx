'use client'

import type { Transaction, TransactionUpdateRequest } from '@hermes/contracts'
import { TransactionUpdateRequestSchema } from '@hermes/contracts'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ReactElement } from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

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
	toastMessageHandler,
} from '@/shared'

import { transactionsService } from '../services'

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

const depositTypeLabels: Record<string, string> = {
	SALARY: 'Зарплата',
	GIFT: 'Подарок',
	TRANSFER: 'Перевод',
	REFUND: 'Возврат',
	OTHER: 'Другое',
}

const typeLabels: Record<string, string> = {
	DEPOSIT: 'Пополнение',
	WITHDRAW: 'Снятие',
}

interface UpdateTransactionFormProps {
	transaction: Transaction
	onSuccess?: () => void
}

export function UpdateTransactionForm({
	transaction,
	onSuccess,
}: UpdateTransactionFormProps): ReactElement {
	const [isOpen, setIsOpen] = useState(false)
	const queryClient = useQueryClient()
	const { mutate: updateTransaction, isPending: isLoadingUpdate } =
		useMutation({
			mutationKey: ['update transaction'],
			mutationFn: ({
				transactionId,
				values,
			}: {
				transactionId: string
				values: TransactionUpdateRequest
			}) => transactionsService.updateTransaction(transactionId, values),
			onSuccess() {
				queryClient.invalidateQueries({ queryKey: ['transactions'] })
				toast.success('Транзакция успешно обновлена')
				setIsOpen(false)
				onSuccess?.()
			},
			onError(error) {
				toastMessageHandler(error)
			},
		})

	const form = useForm<TransactionUpdateRequest>({
		resolver: zodResolver(TransactionUpdateRequestSchema),
		defaultValues: {
			amount: transaction.amount,
			type: transaction.type,
			category: transaction.category || undefined,
			depositType: transaction.depositType || undefined,
			description: transaction.description || '',
		},
	})

	const transactionType = form.watch('type')

	const onSubmit = (values: TransactionUpdateRequest) => {
		// Очищаем неиспользуемые поля в зависимости от типа
		if (values.type === 'DEPOSIT') {
			values.category = undefined
		} else if (values.type === 'WITHDRAW') {
			values.depositType = undefined
		}
		updateTransaction({ transactionId: transaction.id, values })
	}

	if (!isOpen) {
		return (
			<Button variant='outline' size='sm' onClick={() => setIsOpen(true)}>
				Редактировать
			</Button>
		)
	}

	return (
		<Card className='w-full max-w-md'>
			<CardHeader>
				<CardTitle>Редактировать транзакцию</CardTitle>
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
								<div className='space-y-2'>
									<Label htmlFor='type'>Тип</Label>
									<select
										id='type'
										{...field}
										onChange={e => {
											field.onChange(e)
											if (e.target.value === 'DEPOSIT') {
												form.setValue(
													'category',
													undefined,
												)
												if (
													!form.getValues(
														'depositType',
													)
												) {
													form.setValue(
														'depositType',
														'OTHER',
													)
												}
											} else {
												form.setValue(
													'depositType',
													undefined,
												)
												if (
													!form.getValues('category')
												) {
													form.setValue(
														'category',
														'OTHER',
													)
												}
											}
										}}
										disabled={isLoadingUpdate}
										className='h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'
									>
										{Object.entries(typeLabels).map(
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
									{form.formState.errors.type && (
										<p className='text-sm text-destructive'>
											{form.formState.errors.type.message}
										</p>
									)}
								</div>
							)}
						/>
						{transactionType === 'WITHDRAW' && (
							<FormField
								control={form.control}
								name='category'
								render={({ field }) => (
									<div className='space-y-2'>
										<Label htmlFor='category'>
											Категория
										</Label>
										<select
											id='category'
											{...field}
											disabled={isLoadingUpdate}
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
													form.formState.errors
														.category.message
												}
											</p>
										)}
									</div>
								)}
							/>
						)}
						{transactionType === 'DEPOSIT' && (
							<FormField
								control={form.control}
								name='depositType'
								render={({ field }) => (
									<div className='space-y-2'>
										<Label htmlFor='depositType'>
											Тип пополнения
										</Label>
										<select
											id='depositType'
											{...field}
											disabled={isLoadingUpdate}
											className='h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'
										>
											{Object.entries(
												depositTypeLabels,
											).map(([value, label]) => (
												<option
													key={value}
													value={value}
												>
													{label}
												</option>
											))}
										</select>
										{form.formState.errors.depositType && (
											<p className='text-sm text-destructive'>
												{
													form.formState.errors
														.depositType.message
												}
											</p>
										)}
									</div>
								)}
							/>
						)}
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
										value={field.value || ''}
										disabled={isLoadingUpdate}
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
										value={field.value || ''}
										disabled={isLoadingUpdate}
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
						<div className='flex gap-2'>
							<Button
								type='submit'
								disabled={isLoadingUpdate}
								className='flex-1'
							>
								{isLoadingUpdate ? 'Обновление...' : 'Обновить'}
							</Button>
							<Button
								type='button'
								variant='outline'
								onClick={() => setIsOpen(false)}
								disabled={isLoadingUpdate}
							>
								Отмена
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}
