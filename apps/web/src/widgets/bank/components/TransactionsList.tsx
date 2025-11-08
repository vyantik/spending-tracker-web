'use client'

import type { ReactElement } from 'react'
import { useState } from 'react'

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Skeleton,
} from '@/shared'

import { useDeleteTransactionMutation, useGetTransactions } from '../hooks'

import { UpdateTransactionForm } from './UpdateTransactionForm'

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

export function TransactionsList(): ReactElement {
	const [page, setPage] = useState(1)
	const limit = 10
	const {
		transactions,
		totalPages,
		page: currentPage,
		isLoading,
	} = useGetTransactions({ page, limit })
	const { deleteTransaction, isLoadingDelete } =
		useDeleteTransactionMutation()

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<Skeleton className='h-6 w-48' />
				</CardHeader>
				<CardContent>
					<div className='space-y-4'>
						{Array.from({ length: 5 }).map((_, i) => (
							<Skeleton key={i} className='h-16 w-full' />
						))}
					</div>
				</CardContent>
			</Card>
		)
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Последние транзакции</CardTitle>
			</CardHeader>
			<CardContent className='space-y-4'>
				{transactions.length === 0 ? (
					<p className='text-sm text-muted-foreground text-center py-8'>
						Нет транзакций
					</p>
				) : (
					<>
						<div className='space-y-2'>
							{transactions.map(transaction => (
								<div key={transaction.id} className='space-y-2'>
									<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-3 rounded-lg border bg-card'>
										<div className='flex-1 space-y-1'>
											<div className='flex flex-wrap items-center gap-2'>
												<span
													className={`text-sm font-medium ${
														transaction.type ===
														'DEPOSIT'
															? 'text-green-600'
															: 'text-red-600'
													}`}
												>
													{typeLabels[
														transaction.type
													] || transaction.type}
												</span>
												{transaction.type === 'DEPOSIT'
													? transaction.depositType && (
															<span className='text-xs text-muted-foreground'>
																{depositTypeLabels[
																	transaction
																		.depositType
																] ||
																	transaction.depositType}
															</span>
														)
													: transaction.category && (
															<span className='text-xs text-muted-foreground'>
																{categoryLabels[
																	transaction
																		.category
																] ||
																	transaction.category}
															</span>
														)}
												{transaction.user && (
													<div className='flex items-center gap-2'>
														<Avatar className='size-5'>
															<AvatarImage
																src={
																	transaction
																		.user
																		.avatar ||
																	undefined
																}
																alt={
																	transaction
																		.user
																		.username
																}
															/>
															<AvatarFallback className='text-xs'>
																{transaction.user.username
																	.slice(0, 1)
																	.toUpperCase()}
															</AvatarFallback>
														</Avatar>
														<span className='text-xs text-muted-foreground'>
															Создал:{' '}
															{
																transaction.user
																	.username
															}
														</span>
													</div>
												)}
											</div>
											{transaction.description && (
												<p className='text-sm text-muted-foreground'>
													{transaction.description}
												</p>
											)}
										</div>
										<div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-2'>
											<div className='text-left sm:text-right'>
												<p
													className={`font-semibold ${
														transaction.type ===
														'DEPOSIT'
															? 'text-green-600'
															: 'text-red-600'
													}`}
												>
													{transaction.type ===
													'DEPOSIT'
														? '+'
														: '-'}
													{transaction.amount.toLocaleString(
														'ru-RU',
														{
															style: 'currency',
															currency: 'RUB',
															minimumFractionDigits: 0,
														},
													)}
												</p>
											</div>
											<div className='flex gap-2'>
												<UpdateTransactionForm
													transaction={transaction}
												/>
												<Button
													variant='destructive'
													size='sm'
													onClick={() =>
														deleteTransaction(
															transaction.id,
														)
													}
													disabled={isLoadingDelete}
													className='flex-1 sm:flex-initial'
												>
													Удалить
												</Button>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>

						{totalPages > 1 && (
							<div className='flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 pt-4 border-t'>
								<Button
									variant='outline'
									size='sm'
									onClick={() =>
										setPage(p => Math.max(1, p - 1))
									}
									disabled={currentPage === 1}
									className='w-full sm:w-auto'
								>
									Назад
								</Button>
								<span className='text-sm text-muted-foreground'>
									Страница {currentPage} из {totalPages}
								</span>
								<Button
									variant='outline'
									size='sm'
									onClick={() =>
										setPage(p =>
											Math.min(totalPages, p + 1),
										)
									}
									disabled={currentPage === totalPages}
									className='w-full sm:w-auto'
								>
									Вперед
								</Button>
							</div>
						)}
					</>
				)}
			</CardContent>
		</Card>
	)
}
