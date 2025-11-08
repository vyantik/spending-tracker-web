'use client'

import type { ProfileGetResponse } from '@hermes/contracts'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { isAuthenticated } from '@/shared/utils'
import { userService } from '@/widgets'

interface IUseProfile {
	user: ProfileGetResponse | undefined
	isLoadingUser: boolean
}
export function useProfile(): IUseProfile {
	const router = useRouter()
	const queryClient = useQueryClient()
	const hasAuth = isAuthenticated()

	const {
		data: user,
		isLoading: isLoadingUser,
		error,
	} = useQuery({
		queryKey: ['profile'],
		queryFn: () => userService.getProfile(),
		enabled: hasAuth,
		retry: false,
		staleTime: 5 * 60 * 1000, // 5 минут
		gcTime: 10 * 60 * 1000, // 10 минут
	})

	useEffect(() => {
		if (error) {
			const statusCode =
				(error as any)?.statusCode || (error as any)?.status
			if (statusCode === 401) {
				queryClient.setQueryData<ProfileGetResponse | undefined>(
					['profile'],
					undefined,
				)
				if (typeof window !== 'undefined') {
					localStorage.removeItem('access_token')
					const pathname = window.location.pathname
					if (!pathname.startsWith('/auth') && pathname !== '/') {
						router.push('/auth/login')
					}
				}
			}
		}
	}, [error, queryClient, router])

	return {
		user,
		isLoadingUser: hasAuth ? isLoadingUser : false,
	}
}
