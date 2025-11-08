'use client'

import type { ReactElement } from 'react'

import { Button, Card, CardContent, CardHeader, CardTitle } from '@/shared'

import {
	useAcceptInvitationMutation,
	useDeclineInvitationMutation,
	useGetIncomingInvitations,
} from '../hooks'

export function IncomingInvitationsList(): ReactElement {
	const { invitations, isLoadingInvitations, isUserHasBank } =
		useGetIncomingInvitations()
	const { acceptInvitation, isLoadingAccept } = useAcceptInvitationMutation()
	const { declineInvitation, isLoadingDecline } =
		useDeclineInvitationMutation()

	if (isLoadingInvitations) {
		return (
			<Card className='w-full'>
				<CardHeader>
					<CardTitle>Входящие приглашения</CardTitle>
				</CardHeader>
				<CardContent>
					<p className='text-sm text-muted-foreground'>Загрузка...</p>
				</CardContent>
			</Card>
		)
	}

	if (isUserHasBank) {
		return (
			<Card className='w-full'>
				<CardHeader>
					<CardTitle>Входящие приглашения</CardTitle>
				</CardHeader>
				<CardContent>
					<p className='text-sm text-muted-foreground'>
						Пользователи с банком не могут получать входящие
						приглашения
					</p>
				</CardContent>
			</Card>
		)
	}

	if (invitations.length === 0) {
		return (
			<Card className='w-full'>
				<CardHeader>
					<CardTitle>Входящие приглашения</CardTitle>
				</CardHeader>
				<CardContent>
					<p className='text-sm text-muted-foreground'>
						У вас нет входящих приглашений
					</p>
				</CardContent>
			</Card>
		)
	}

	return (
		<Card className='w-full'>
			<CardHeader>
				<CardTitle>Входящие приглашения</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					{invitations.map(invitation => (
						<div
							key={invitation.id}
							className='flex items-center justify-between p-4 border rounded-lg'
						>
							<div className='flex flex-col gap-1'>
								<p className='font-medium'>
									Банк: {invitation.bankName}
								</p>
								<p className='text-sm text-muted-foreground'>
									От: {invitation.inviterUsername}
								</p>
								<p className='text-xs text-muted-foreground'>
									{new Date(
										invitation.createdAt,
									).toLocaleDateString('ru-RU')}
								</p>
							</div>
							{invitation.status === 'PENDING' && (
								<div className='flex gap-2'>
									<Button
										variant='outline'
										size='sm'
										onClick={() =>
											declineInvitation(invitation.id)
										}
										disabled={
											isLoadingDecline || isLoadingAccept
										}
									>
										Отклонить
									</Button>
									<Button
										size='sm'
										onClick={() =>
											acceptInvitation(invitation.id)
										}
										disabled={
											isLoadingAccept || isLoadingDecline
										}
									>
										Принять
									</Button>
								</div>
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
