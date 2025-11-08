'use client'

import { useQuery } from '@tanstack/react-query'

import { FetchError } from '@/shared/utils/fetch'

import { invitationsService } from '../services'

export function useGetIncomingInvitations() {
	const {
		data: invitations,
		isLoading: isLoadingInvitations,
		isError: isErrorInvitations,
		error: invitationsError,
		refetch: refetchInvitations,
	} = useQuery({
		queryKey: ['incoming-invitations'],
		queryFn: () => invitationsService.getIncomingInvitations(),
		retry: false,
	})

	const isUserHasBank =
		isErrorInvitations &&
		invitationsError instanceof FetchError &&
		invitationsError.statusCode === 400

	return {
		invitations: invitations || [],
		isLoadingInvitations,
		isErrorInvitations,
		isUserHasBank,
		refetchInvitations,
	}
}
