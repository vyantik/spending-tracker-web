import type { RegisterRequest } from '@hermes/contracts'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared'

import { authService } from '../services'

export function useRegisterMutation(onSuccessCallback?: () => void) {
	const router = useRouter()
	const { mutate: register, isPending: isLoadingRegister } = useMutation({
		mutationKey: ['register user'],
		mutationFn: ({ values }: { values: RegisterRequest }) =>
			authService.register(values),
		onSuccess() {
			toast.success('Успешная регистрация', {
				description:
					'Подтвердите почту. Сообщение было отправлено на ваш почтовый адрес.',
			})
			onSuccessCallback?.()
			router.push('/auth/login')
		},
		onError(error) {
			toastMessageHandler(error)
		},
	})

	return {
		register,
		isLoadingRegister,
	}
}
