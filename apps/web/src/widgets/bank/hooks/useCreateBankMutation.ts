'use client'

import type { BankCreateRequest } from '@hermes/contracts'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared'

import { bankService } from '../services'

export function useCreateBankMutation() {
	const queryClient = useQueryClient()
	const { mutate: createBank, isPending: isLoadingCreate } = useMutation({
		mutationKey: ['create bank'],
		mutationFn: (values: BankCreateRequest) =>
			bankService.createBank(values),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['bank'] })
			queryClient.refetchQueries({ queryKey: ['bank'] })
			toast.success('Банк успешно создан')
		},
		onError(error) {
			toastMessageHandler(error)
		},
	})

	return {
		createBank,
		isLoadingCreate,
	}
}
