'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared'

import { userService } from '../services'

export function useLogoutMutation() {
	const queryClient = useQueryClient()
	const { mutate: logout, isPending: isLoadingLogout } = useMutation({
		mutationKey: ['logout user'],
		mutationFn: () => userService.logout(),
		onSuccess() {
			localStorage.removeItem('access_token')
			queryClient.resetQueries({ queryKey: ['profile'] })
			toast.success('Успешный выход из аккаунта')
			window.location.reload()
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
