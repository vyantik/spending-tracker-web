import type { LoginRequest } from '@hermes/contracts'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared'

import { authService } from '../services'

export function useLoginMutation(onSuccessCallback?: () => void) {
	const router = useRouter()
	const { mutate: login, isPending: isLoadingLogin } = useMutation({
		mutationKey: ['login user'],
		mutationFn: ({ values }: { values: LoginRequest }) =>
			authService.login(values),
		onSuccess() {
			toast.success('Успешная авторизация')
			onSuccessCallback?.()
			router.push('/profile')
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
