import type { LoginRequest } from '@hermes/contracts'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared'

import { authService } from '../services'

export function useLoginMutation(onSuccessCallback?: () => void) {
	const { mutate: login, isPending: isLoadingLogin } = useMutation({
		mutationKey: ['login user'],
		mutationFn: ({ values }: { values: LoginRequest }) =>
			authService.login(values),
		onSuccess() {
			toast.success('Успешная авторизация')
			onSuccessCallback?.()
		},
		onError(error) {
			toastMessageHandler(error)
		},
	})

	return {
		login,
		isLoadingLogin,
	}
}
