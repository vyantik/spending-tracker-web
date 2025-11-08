'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared'

import { userService } from '../services'

export function useLogoutMutation() {
	const queryClient = useQueryClient()
	const router = useRouter()
	const { mutate: logout, isPending: isLoadingLogout } = useMutation({
		mutationKey: ['logout user'],
		mutationFn: () => userService.logout(),
		onSuccess() {
			localStorage.removeItem('access_token')
			queryClient.resetQueries({ queryKey: ['profile'] })
			queryClient.clear()
			toast.success('Успешный выход из аккаунта')
			router.push('/')
			router.refresh()
		},
		onError(error) {
			toastMessageHandler(error)
		},
	})

	return {
		logout,
		isLoadingLogout,
	}
}
