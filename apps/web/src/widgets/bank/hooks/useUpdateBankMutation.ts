'use client'

import type { BankUpdateRequest } from '@hermes/contracts'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared'

import { bankService } from '../services'

export function useUpdateBankMutation() {
	const queryClient = useQueryClient()
	const { mutate: updateBank, isPending: isLoadingUpdate } = useMutation({
		mutationKey: ['update bank'],
		mutationFn: (values: BankUpdateRequest) =>
			bankService.updateBank(values),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['bank'] })
			queryClient.refetchQueries({ queryKey: ['bank'] })
			toast.success('Банк успешно обновлен')
		},
		onError(error) {
			toastMessageHandler(error)
		},
	})

	return {
		updateBank,
		isLoadingUpdate,
	}
}
