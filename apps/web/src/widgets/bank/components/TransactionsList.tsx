'use client'

import type { ReactElement } from 'react'
import { useState } from 'react'

import {
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
	const [editingId, setEditingId] = useState<string | null>(null)
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
									{editingId === transaction.id ? (
										<UpdateTransactionForm
											transaction={transaction}
											onSuccess={() => setEditingId(null)}
										/>
									) : (
										<div className='flex items-center justify-between p-3 rounded-lg border bg-card'>
											<div className='flex-1 space-y-1'>
												<div className='flex items-center gap-2'>
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
													{transaction.type ===
													'DEPOSIT'
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
												</div>
												{transaction.description && (
													<p className='text-sm text-muted-foreground'>
														{
															transaction.description
														}
													</p>
												)}
											</div>
											<div className='flex items-center gap-2'>
												<div className='text-right'>
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
												<Button
													variant='outline'
													size='sm'
													onClick={() =>
														setEditingId(
															transaction.id,
														)
													}
													disabled={isLoadingDelete}
												>
													Редактировать
												</Button>
												<Button
													variant='destructive'
													size='sm'
													onClick={() =>
														deleteTransaction(
															transaction.id,
														)
													}
													disabled={isLoadingDelete}
												>
													Удалить
												</Button>
											</div>
										</div>
									)}
								</div>
							))}
						</div>

						{totalPages > 1 && (
							<div className='flex items-center justify-between pt-4 border-t'>
								<Button
									variant='outline'
									size='sm'
									onClick={() =>
										setPage(p => Math.max(1, p - 1))
									}
									disabled={currentPage === 1}
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
