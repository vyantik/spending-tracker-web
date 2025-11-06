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

import { useGetTransactions } from '../hooks'

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
								<div
									key={transaction.id}
									className='flex items-center justify-between p-3 rounded-lg border bg-card'
								>
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
												{typeLabels[transaction.type] ||
													transaction.type}
											</span>
											<span className='text-xs text-muted-foreground'>
												{categoryLabels[
													transaction.category
												] || transaction.category}
											</span>
										</div>
										{transaction.description && (
											<p className='text-sm text-muted-foreground'>
												{transaction.description}
											</p>
										)}
									</div>
									<div className='text-right'>
										<p
											className={`font-semibold ${
												transaction.type === 'DEPOSIT'
													? 'text-green-600'
													: 'text-red-600'
											}`}
										>
											{transaction.type === 'DEPOSIT'
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
