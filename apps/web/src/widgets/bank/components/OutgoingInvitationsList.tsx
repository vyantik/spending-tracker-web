'use client'

import type { ReactElement } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/shared'

import { useGetOutgoingInvitations } from '../hooks'

export function OutgoingInvitationsList(): ReactElement {
	const { invitations, isLoadingInvitations } = useGetOutgoingInvitations()

	if (isLoadingInvitations) {
		return (
			<Card className='w-full'>
				<CardHeader>
					<CardTitle>Исходящие приглашения</CardTitle>
				</CardHeader>
				<CardContent>
					<p className='text-sm text-muted-foreground'>Загрузка...</p>
				</CardContent>
			</Card>
		)
	}

	if (invitations.length === 0) {
		return (
			<Card className='w-full'>
				<CardHeader>
					<CardTitle>Исходящие приглашения</CardTitle>
				</CardHeader>
				<CardContent>
					<p className='text-sm text-muted-foreground'>
						Вы не отправляли приглашений
					</p>
				</CardContent>
			</Card>
		)
	}

	return (
		<Card className='w-full'>
			<CardHeader>
				<CardTitle>Исходящие приглашения</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					{invitations.map(invitation => (
						<div
							key={invitation.id}
							className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-4 border rounded-lg'
						>
							<div className='flex flex-col gap-1 flex-1'>
								<p className='font-medium'>
									Кому: {invitation.inviteeUsername}
								</p>
								<p className='text-sm text-muted-foreground'>
									Банк: {invitation.bankName}
								</p>
								<p className='text-xs text-muted-foreground'>
									{new Date(
										invitation.createdAt,
									).toLocaleDateString('ru-RU')}
								</p>
							</div>
							{invitation.status === 'PENDING' && (
								<span className='text-sm text-yellow-600'>
									Ожидает ответа
								</span>
							)}
							{invitation.status === 'ACCEPTED' && (
								<span className='text-sm text-green-600'>
									Принято
								</span>
							)}
							{invitation.status === 'DECLINED' && (
								<span className='text-sm text-red-600'>
									Отклонено
								</span>
							)}
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	)
}
