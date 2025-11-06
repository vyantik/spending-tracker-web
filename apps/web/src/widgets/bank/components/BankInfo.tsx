'use client'

import type { BankGetResponse } from '@hermes/contracts'
import type { ReactElement } from 'react'

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/shared'

interface BankInfoProps {
	bank: BankGetResponse
}

export function BankInfo({ bank }: BankInfoProps): ReactElement {
	return (
		<Card className='w-full max-w-md'>
			<CardHeader>
				<CardTitle>Информация о банке</CardTitle>
				<CardDescription>ID: {bank.id}</CardDescription>
			</CardHeader>
			<CardContent className='space-y-4'>
				<div>
					<p className='text-sm font-medium text-muted-foreground'>
						Название
					</p>
					<p className='text-base font-semibold'>{bank.name}</p>
				</div>
				{bank.description && (
					<div>
						<p className='text-sm font-medium text-muted-foreground'>
							Описание
						</p>
						<p className='text-base'>{bank.description}</p>
					</div>
				)}
				<div>
					<p className='text-sm font-medium text-muted-foreground'>
						Создан
					</p>
					<p className='text-base'>
						{new Date(bank.createdAt).toLocaleString('ru-RU')}
					</p>
				</div>
				<div>
					<p className='text-sm font-medium text-muted-foreground'>
						Обновлен
					</p>
					<p className='text-base'>
						{new Date(bank.updatedAt).toLocaleString('ru-RU')}
					</p>
				</div>
			</CardContent>
		</Card>
	)
}
