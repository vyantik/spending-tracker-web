'use client'

import type { ProfileGetResponse } from '@hermes/contracts'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { hasAccessToken, hasRefreshToken } from '@/shared/utils'
import { userService } from '@/widgets'
import { authService } from '@/widgets/auth/services'

interface IUseProfile {
	user: ProfileGetResponse | undefined
	isLoadingUser: boolean
}
export function useProfile(): IUseProfile {
	const router = useRouter()
	const queryClient = useQueryClient()
	const [isRefreshing, setIsRefreshing] = useState(false)
	const [isMounted, setIsMounted] = useState(false)
	const refreshAttempted = useRef(false)

	useEffect(() => {
		setIsMounted(true)
	}, [])

	const hasAccess = isMounted ? hasAccessToken() : false
	const hasRefresh = isMounted ? hasRefreshToken() : false
	const hasAuth = hasAccess || hasRefresh

	useEffect(() => {
		if (
			!hasAccess &&
			hasRefresh &&
			!isRefreshing &&
			!refreshAttempted.current
		) {
			refreshAttempted.current = true
			setIsRefreshing(true)
			authService
				.refresh()
				.then(data => {
					if (typeof window !== 'undefined') {
						localStorage.setItem('access_token', data.access_token)
					}
					queryClient.invalidateQueries({ queryKey: ['profile'] })
					refreshAttempted.current = false
				})
				.catch(() => {
					if (typeof window !== 'undefined') {
						localStorage.removeItem('access_token')
						authService.logout().catch(() => {})
						const pathname = window.location.pathname
						const publicPaths = ['/', '/auth']
						const isPublicPath = publicPaths.some(
							path =>
								pathname === path ||
								pathname.startsWith(`${path}/`),
						)
						if (!isPublicPath) {
							router.replace('/auth/login')
						}
					}
					queryClient.setQueryData<ProfileGetResponse | undefined>(
						['profile'],
						undefined,
					)
					refreshAttempted.current = false
				})
				.finally(() => {
					setIsRefreshing(false)
				})
		}
		if (hasAccess) {
			refreshAttempted.current = false
		}
	}, [hasAccess, hasRefresh, isRefreshing, queryClient, router])

	const {
		data: user,
		isLoading: isLoadingUser,
		error,
	} = useQuery({
		queryKey: ['profile'],
		queryFn: () => userService.getProfile(),
		enabled: hasAccess && !isRefreshing,
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
					authService.logout().catch(() => {})
					const pathname = window.location.pathname
					const publicPaths = ['/', '/auth']
					const isPublicPath = publicPaths.some(
						path =>
							pathname === path ||
							pathname.startsWith(`${path}/`),
					)
					if (!isPublicPath) {
						router.replace('/auth/login')
					}
				}
			}
		}
	}, [error, queryClient, router])

	return {
		user,
		isLoadingUser: hasAuth ? isLoadingUser || isRefreshing : false,
	}
}
