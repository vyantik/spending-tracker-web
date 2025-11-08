'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared'

import { invitationsService } from '../services'

export function useDeclineInvitationMutation() {
	const queryClient = useQueryClient()
	const { mutate: declineInvitation, isPending: isLoadingDecline } =
		useMutation({
			mutationKey: ['decline invitation'],
			mutationFn: (invitationId: string) =>
				invitationsService.declineInvitation(invitationId),
			onSuccess() {
				queryClient.invalidateQueries({
					queryKey: ['incoming-invitations'],
				})
				queryClient.refetchQueries({
					queryKey: ['incoming-invitations'],
				})
				toast.success('Приглашение отклонено')
			},
			onError(error) {
				toastMessageHandler(error)
			},
		})

	return {
		declineInvitation,
		isLoadingDecline,
	}
}
