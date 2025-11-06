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
			<div className='w-screen h-screen flex justify-center items-center pt-[7vh]'>
				<BankSkeleton />
			</div>
		)
	}

	return (
		<div className='w-screen min-h-screen flex justify-center items-start p-4 pt-[calc(7vh+1rem)]'>
			<div className='flex flex-col gap-6 w-full max-w-4xl'>
				{isBankNotFound ? (
					<CreateBankForm />
				) : bank ? (
					<>
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
					</>
				) : null}
			</div>
		</div>
	)
}
