'use client'

import type { ReactElement } from 'react'

import { Card, CardContent, CardHeader, Skeleton } from '@/shared'

export function BankSkeleton(): ReactElement {
	return (
		<div className='w-full max-w-md space-y-4'>
			<Card>
				<CardHeader>
					<Skeleton className='h-6 w-48' />
					<Skeleton className='h-4 w-32 mt-2' />
				</CardHeader>
				<CardContent className='space-y-4'>
					<div className='space-y-2'>
						<Skeleton className='h-4 w-20' />
						<Skeleton className='h-9 w-full' />
					</div>
					<div className='space-y-2'>
						<Skeleton className='h-4 w-24' />
						<Skeleton className='h-9 w-full' />
					</div>
					<Skeleton className='h-9 w-full' />
				</CardContent>
			</Card>
		</div>
	)
}
