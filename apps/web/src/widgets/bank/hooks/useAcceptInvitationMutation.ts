'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared'

import { invitationsService } from '../services'

export function useAcceptInvitationMutation() {
	const queryClient = useQueryClient()
	const { mutate: acceptInvitation, isPending: isLoadingAccept } =
		useMutation({
			mutationKey: ['accept invitation'],
			mutationFn: (invitationId: string) =>
				invitationsService.acceptInvitation(invitationId),
			onSuccess() {
				queryClient.invalidateQueries({
					queryKey: ['incoming-invitations'],
				})
				queryClient.invalidateQueries({ queryKey: ['bank'] })
				queryClient.refetchQueries({ queryKey: ['bank'] })
				queryClient.refetchQueries({
					queryKey: ['incoming-invitations'],
				})
				toast.success('Приглашение принято')
			},
			onError(error) {
				toastMessageHandler(error)
			},
		})

	return {
		acceptInvitation,
		isLoadingAccept,
	}
}
