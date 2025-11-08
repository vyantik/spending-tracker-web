'use client'

import { AmountInput, DescriptionInput, FormSelect } from '.'
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
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Form,
	FormField,
	toastMessageHandler,
} from '@/shared'

import {
	categoryLabels,
	depositTypeLabels,
	typeLabels,
} from '../constants/labels'
import { transactionsService } from '../services'

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
		if (values.type === 'DEPOSIT') {
			values.category = undefined
		} else if (values.type === 'WITHDRAW') {
			values.depositType = undefined
		}
		updateTransaction({ transactionId: transaction.id, values })
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant='outline' size='sm'>
					Редактировать
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Редактировать транзакцию</DialogTitle>
				</DialogHeader>
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
									disabled={isLoadingUpdate}
									error={form.formState.errors.type?.message}
									onChange={e => {
										field.onChange(e)
										if (e.target.value === 'DEPOSIT') {
											form.setValue('category', undefined)
											if (
												!form.getValues('depositType')
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
											if (!form.getValues('category')) {
												form.setValue(
													'category',
													'OTHER',
												)
											}
										}
									}}
								/>
							)}
						/>
						{transactionType === 'WITHDRAW' && (
							<FormField
								control={form.control}
								name='category'
								render={({ field }) => (
									<FormSelect
										field={field}
										label='Категория'
										options={categoryLabels}
										disabled={isLoadingUpdate}
										error={
											form.formState.errors.category
												?.message
										}
									/>
								)}
							/>
						)}
						{transactionType === 'DEPOSIT' && (
							<FormField
								control={form.control}
								name='depositType'
								render={({ field }) => (
									<FormSelect
										field={field}
										label='Тип пополнения'
										options={depositTypeLabels}
										disabled={isLoadingUpdate}
										error={
											form.formState.errors.depositType
												?.message
										}
									/>
								)}
							/>
						)}
						<FormField
							control={form.control}
							name='amount'
							render={({ field }) => (
								<AmountInput
									field={field}
									disabled={isLoadingUpdate}
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
									disabled={isLoadingUpdate}
									error={
										form.formState.errors.description
											?.message
									}
								/>
							)}
						/>
						<DialogFooter>
							<Button
								type='button'
								variant='outline'
								onClick={() => setIsOpen(false)}
								disabled={isLoadingUpdate}
							>
								Отмена
							</Button>
							<Button type='submit' disabled={isLoadingUpdate}>
								{isLoadingUpdate ? 'Обновление...' : 'Обновить'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
