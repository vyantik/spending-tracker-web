'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared'

import { userService } from '../services'

export function useLogoutMutation() {
	const router = useRouter()

	const { mutate: logout, isPending: isLoadingLogout } = useMutation({
		mutationKey: ['logout user'],
		mutationFn: () => userService.logout(),
		onSuccess() {
			toast.success('Успешный выход из аккаунта')
			router.push('/')
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
