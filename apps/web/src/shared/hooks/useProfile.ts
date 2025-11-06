'use client'

import type { ProfileGetResponse } from '@hermes/contracts'
import { useQuery } from '@tanstack/react-query'

import { userService } from '@/widgets'

interface IUseProfile {
	user: ProfileGetResponse | undefined
	isLoadingUser: boolean
}
export function useProfile(): IUseProfile {
	const { data: user, isLoading: isLoadingUser } = useQuery({
		queryKey: ['profile'],
		queryFn: () => userService.getProfile(),
		retry: false,
	})

	return {
		user,
		isLoadingUser,
	}
}
