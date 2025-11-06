'use client'

import {
	BankInfo,
	BankSkeleton,
	CreateBankForm,
	CreateDepositForm,
	CreateWithdrawForm,
	TransactionsList,
	TransactionsStatistics,
	UpdateBankForm,
} from '.'
import type { ReactElement } from 'react'

import { useProfile } from '@/shared'

import { useGetBank } from '../hooks'

export function Banks(): ReactElement | undefined {
	const { isLoadingUser } = useProfile()
	const { bank, isLoadingBank, isBankNotFound } = useGetBank()

	if (isLoadingUser) return

	if (isLoadingBank) {
		return (
			<div className='w-full h-full flex justify-center items-center'>
				<BankSkeleton />
			</div>
		)
	}

	return (
		<div className='w-full h-full flex justify-center items-center p-4'>
			{isBankNotFound ? (
				<div className='w-full flex justify-center items-center'>
					<CreateBankForm />
				</div>
			) : bank ? (
				<div className='flex flex-col gap-6 w-full max-w-4xl'>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<BankInfo bank={bank} />
						<UpdateBankForm bank={bank} />
					</div>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<CreateDepositForm />
						<CreateWithdrawForm />
					</div>
					<TransactionsStatistics />
					<TransactionsList />
				</div>
			) : null}
		</div>
	)
}
