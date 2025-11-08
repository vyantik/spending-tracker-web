import type { VerifyOtpRequest } from '@hermes/contracts'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared'

import { authService } from '../services'

export function useVerifyOtpMutation(onSuccessCallback?: () => void) {
	const router = useRouter()
	const { mutate: verifyOtp, isPending: isLoadingVerify } = useMutation({
		mutationKey: ['verify otp'],
		mutationFn: ({ values }: { values: VerifyOtpRequest }) =>
			authService.verifyOtp(values),
		onSuccess() {
			toast.success('Email успешно подтвержден', {
				description: 'Теперь вы можете войти в систему',
			})
			onSuccessCallback?.()
			router.push('/auth/login')
		},
		onError(error) {
			toastMessageHandler(error)
		},
	})

	return {
		verifyOtp,
		isLoadingVerify,
	}
}
