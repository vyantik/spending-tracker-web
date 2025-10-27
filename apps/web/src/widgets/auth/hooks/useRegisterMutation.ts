import type { RegisterRequest } from '@hermes/contracts'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared'

import { authService } from '../services'

export function useRegisterMutation(onSuccessCallback?: () => void) {
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
