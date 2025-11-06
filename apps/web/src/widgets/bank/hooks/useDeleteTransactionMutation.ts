'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared'

import { transactionsService } from '../services'

export function useDeleteTransactionMutation() {
	const queryClient = useQueryClient()
	const { mutate: deleteTransaction, isPending: isLoadingDelete } =
		useMutation({
			mutationKey: ['delete transaction'],
			mutationFn: (transactionId: string) =>
				transactionsService.deleteTransaction(transactionId),
			onSuccess() {
				queryClient.invalidateQueries({ queryKey: ['transactions'] })
				toast.success('Транзакция успешно удалена')
			},
			onError(error) {
				toastMessageHandler(error)
			},
		})

	return {
		deleteTransaction,
		isLoadingDelete,
	}
}
