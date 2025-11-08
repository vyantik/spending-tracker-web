'use client'

import { useQuery } from '@tanstack/react-query'

import { invitationsService } from '../services'

export function useGetOutgoingInvitations() {
	const {
		data: invitations,
		isLoading: isLoadingInvitations,
		refetch: refetchInvitations,
	} = useQuery({
		queryKey: ['outgoing-invitations'],
		queryFn: () => invitationsService.getOutgoingInvitations(),
	})

	return {
		invitations: invitations || [],
		isLoadingInvitations,
		refetchInvitations,
	}
}
