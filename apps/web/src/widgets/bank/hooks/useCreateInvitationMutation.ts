'use client'

import type { BankInvitationCreateRequest } from '@hermes/contracts'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared'

import { invitationsService } from '../services'

export function useCreateInvitationMutation() {
	const queryClient = useQueryClient()
	const { mutate: createInvitation, isPending: isLoadingCreate } =
		useMutation({
			mutationKey: ['create invitation'],
			mutationFn: (values: BankInvitationCreateRequest) =>
				invitationsService.createInvitation(values),
			onSuccess() {
				queryClient.invalidateQueries({
					queryKey: ['outgoing-invitations'],
				})
				queryClient.refetchQueries({
					queryKey: ['outgoing-invitations'],
				})
				toast.success('Приглашение успешно отправлено')
			},
			onError(error) {
				toastMessageHandler(error)
			},
		})

	return {
		createInvitation,
		isLoadingCreate,
	}
}
