'use client'

import type { TransactionUpdateRequest } from '@hermes/contracts'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared'

import { transactionsService } from '../services'

export function useUpdateTransactionMutation() {
	const queryClient = useQueryClient()
	const { mutate: updateTransaction, isPending: isLoadingUpdate } =
		useMutation({
			mutationKey: ['update transaction'],
			mutationFn: ({
				transactionId,
				values,
			}: {
				transactionId: string
				values: TransactionUpdateRequest
			}) => transactionsService.updateTransaction(transactionId, values),
			onSuccess() {
				queryClient.invalidateQueries({ queryKey: ['transactions'] })
				toast.success('Транзакция успешно обновлена')
			},
			onError(error) {
				toastMessageHandler(error)
			},
		})

	return {
		updateTransaction,
		isLoadingUpdate,
	}
}
