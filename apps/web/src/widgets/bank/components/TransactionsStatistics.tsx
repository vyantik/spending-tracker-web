'use client'

import type { Transaction } from '@hermes/contracts'
import { Download } from 'lucide-react'
import { type ReactElement, useState } from 'react'

import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Skeleton,
} from '@/shared'

import { useGetTransactions } from '../hooks'
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

function calculateStatistics(transactions: Transaction[]) {
	const totalDeposit = transactions
		.filter(t => t.type === 'DEPOSIT')
		.reduce((sum, t) => sum + t.amount, 0)
	const totalWithdraw = transactions
		.filter(t => t.type === 'WITHDRAW')
		.reduce((sum, t) => sum + t.amount, 0)
	const balance = totalDeposit - totalWithdraw

	const categoryStats = transactions.reduce(
		(acc, t) => {
			if (t.type === 'WITHDRAW' && t.category) {
				if (!acc[t.category]) {
					acc[t.category] = { amount: 0, count: 0 }
				}
				acc[t.category].amount += t.amount
				acc[t.category].count += 1
			} else if (t.type === 'DEPOSIT' && t.depositType) {
				const key = `DEPOSIT_${t.depositType}`
				if (!acc[key]) {
					acc[key] = { amount: 0, count: 0 }
				}
				acc[key].amount += t.amount
				acc[key].count += 1
			}
			return acc
		},
		{} as Record<string, { amount: number; count: number }>,
	)

	return {
		totalDeposit,
		totalWithdraw,
		balance,
		categoryStats,
	}
}

export function TransactionsStatistics(): ReactElement {
	const { transactions, isLoading } = useGetTransactions({ limit: 1000 })
	const [isDownloading, setIsDownloading] = useState(false)

	const handleDownloadExcel = async () => {
		try {
			setIsDownloading(true)
			const blob = await transactionsService.generateTransactionsExcel()
			const url = window.URL.createObjectURL(blob)
			const link = document.createElement('a')
			link.href = url
			link.download = `transactions_${Date.now()}.xlsx`
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
			window.URL.revokeObjectURL(url)
		} catch (error) {
			console.error('Failed to download Excel file:', error)
		} finally {
			setIsDownloading(false)
		}
	}

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<Skeleton className='h-6 w-48' />
				</CardHeader>
				<CardContent>
					<div className='space-y-4'>
						<Skeleton className='h-20 w-full' />
						<Skeleton className='h-20 w-full' />
						<Skeleton className='h-40 w-full' />
					</div>
				</CardContent>
			</Card>
		)
	}

	const stats = calculateStatistics(transactions)
	const maxCategoryAmount = Math.max(
		...Object.values(stats.categoryStats).map(s => s.amount),
		1,
	)

	return (
		<Card>
			<CardHeader>
				<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0'>
					<CardTitle>Статистика транзакций</CardTitle>
					<Button
						variant='outline'
						size='sm'
						onClick={handleDownloadExcel}
						disabled={isDownloading}
						className='w-full sm:w-auto'
					>
						<Download className='h-4 w-4' />
						<span className='hidden sm:inline'>
							{isDownloading ? 'Загрузка...' : 'Скачать Excel'}
						</span>
						<span className='sm:hidden'>
							{isDownloading ? 'Загрузка...' : 'Excel'}
						</span>
					</Button>
				</div>
			</CardHeader>
			<CardContent className='space-y-6'>
				<div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
					<div className='space-y-1'>
						<p className='text-sm text-muted-foreground'>
							Пополнения
						</p>
						<p className='text-xl sm:text-2xl font-semibold text-green-600'>
							{stats.totalDeposit.toLocaleString('ru-RU', {
								style: 'currency',
								currency: 'RUB',
								minimumFractionDigits: 0,
							})}
						</p>
					</div>
					<div className='space-y-1'>
						<p className='text-sm text-muted-foreground'>Снятия</p>
						<p className='text-xl sm:text-2xl font-semibold text-red-600'>
							{stats.totalWithdraw.toLocaleString('ru-RU', {
								style: 'currency',
								currency: 'RUB',
								minimumFractionDigits: 0,
							})}
						</p>
					</div>
					<div className='space-y-1'>
						<p className='text-sm text-muted-foreground'>Баланс</p>
						<p
							className={`text-xl sm:text-2xl font-semibold ${
								stats.balance >= 0
									? 'text-green-600'
									: 'text-red-600'
							}`}
						>
							{stats.balance.toLocaleString('ru-RU', {
								style: 'currency',
								currency: 'RUB',
								minimumFractionDigits: 0,
							})}
						</p>
					</div>
				</div>

				<div className='space-y-4'>
					<h3 className='text-lg font-semibold'>
						Распределение по категориям
					</h3>
					<div className='space-y-3'>
						{Object.entries(stats.categoryStats)
							.sort((a, b) => b[1].amount - a[1].amount)
							.map(([key, { amount, count }]) => {
								const label = key.startsWith('DEPOSIT_')
									? depositTypeLabels[
											key.replace('DEPOSIT_', '')
										] || key
									: categoryLabels[key] || key
								return (
									<div key={key} className='space-y-2'>
										<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0'>
											<span className='text-sm font-medium'>
												{label}
											</span>
											<span className='text-xs sm:text-sm text-muted-foreground'>
												{amount.toLocaleString(
													'ru-RU',
													{
														style: 'currency',
														currency: 'RUB',
														minimumFractionDigits: 0,
													},
												)}{' '}
												({count} транзакций)
											</span>
										</div>
										<div className='h-2 w-full rounded-full bg-accent overflow-hidden'>
											<div
												className='h-full bg-primary transition-all'
												style={{
													width: `${
														(maxCategoryAmount > 0
															? amount /
																maxCategoryAmount
															: 0) * 100
													}%`,
												}}
											/>
										</div>
									</div>
								)
							})}
						{Object.keys(stats.categoryStats).length === 0 && (
							<p className='text-sm text-muted-foreground text-center py-4'>
								Нет транзакций для отображения
							</p>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
