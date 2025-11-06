'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared'

import { userService } from '../services'

export function useUploadAvatarMutation() {
	const queryClient = useQueryClient()
	const { mutate: uploadAvatar, isPending: isLoadingUpload } = useMutation({
		mutationKey: ['upload avatar'],
		mutationFn: (file: File) => userService.uploadAvatar(file),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['profile'] })
			queryClient.refetchQueries({ queryKey: ['profile'] })
			toast.success('Аватар успешно загружен')
		},
		onError(error) {
			toastMessageHandler(error)
		},
	})

	return {
		uploadAvatar,
		isLoadingUpload,
	}
}
