'use client'

import type { TransactionCreateRequest } from '@hermes/contracts'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared'

import { transactionsService } from '../services'

export function useCreateTransactionMutation() {
	const queryClient = useQueryClient()
	const { mutate: createTransaction, isPending: isLoadingCreate } =
		useMutation({
			mutationKey: ['create transaction'],
			mutationFn: (values: TransactionCreateRequest) =>
				transactionsService.createTransaction(values),
			onSuccess() {
				queryClient.invalidateQueries({ queryKey: ['transactions'] })
				toast.success('Транзакция успешно создана')
			},
			onError(error) {
				toastMessageHandler(error)
			},
		})

	return {
		createTransaction,
		isLoadingCreate,
	}
}
