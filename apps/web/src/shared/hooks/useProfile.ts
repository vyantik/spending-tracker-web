'use client'

import { useQuery } from '@tanstack/react-query'

import { userService } from '@/widgets'

export function useProfile() {
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
