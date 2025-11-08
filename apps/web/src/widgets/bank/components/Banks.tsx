'use client'

import {
	BankInfo,
	BankSkeleton,
	CreateBankForm,
	CreateDepositForm,
	CreateWithdrawForm,
	InvitationsTab,
	TransactionsList,
	TransactionsStatistics,
	UpdateBankForm,
} from '.'
import type { ReactElement } from 'react'
import { useState } from 'react'

import { Button, useProfile } from '@/shared'

import { useGetBank } from '../hooks'

export function Banks(): ReactElement | undefined {
	const { isLoadingUser } = useProfile()
	const { bank, isLoadingBank, isBankNotFound } = useGetBank()
	const [activeTab, setActiveTab] = useState<'main' | 'invitations'>('main')

	if (isLoadingUser) return

	if (isLoadingBank) {
		return (
			<div className='w-full h-full flex justify-center items-center'>
				<BankSkeleton />
			</div>
		)
	}

	return (
		<div className='w-full min-h-screen flex justify-center items-start p-2 sm:p-4'>
			{isBankNotFound ? (
				<div className='w-full flex flex-col gap-4 sm:gap-6 max-w-4xl items-center'>
					<CreateBankForm />
					<InvitationsTab hasBank={false} />
				</div>
			) : bank ? (
				<div className='flex flex-col gap-4 sm:gap-6 w-full max-w-4xl'>
					<div className='flex flex-col sm:flex-row gap-2'>
						<Button
							variant={
								activeTab === 'main' ? 'default' : 'outline'
							}
							onClick={() => setActiveTab('main')}
							className='w-full sm:w-auto'
						>
							Основное
						</Button>
						<Button
							variant={
								activeTab === 'invitations'
									? 'default'
									: 'outline'
							}
							onClick={() => setActiveTab('invitations')}
							className='w-full sm:w-auto'
						>
							Приглашения
						</Button>
					</div>
					{activeTab === 'main' ? (
						<>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6'>
								<BankInfo bank={bank} />
								<UpdateBankForm bank={bank} />
							</div>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6'>
								<CreateDepositForm />
								<CreateWithdrawForm />
							</div>
							<TransactionsStatistics />
							<TransactionsList />
						</>
					) : (
						<InvitationsTab hasBank={true} />
					)}
				</div>
			) : null}
		</div>
	)
}
