'use client'

import type { BankGetTransactionsRequest } from '@hermes/contracts'
import { useQuery } from '@tanstack/react-query'

import { transactionsService } from '../services'

export function useGetTransactions(params?: BankGetTransactionsRequest) {
	const { data, isLoading, isError, error } = useQuery({
		queryKey: ['transactions', params?.page, params?.limit],
		queryFn: () => transactionsService.getTransactions(params),
		retry: false,
	})

	return {
		transactions: data?.transactions || [],
		total: data?.total || 0,
		page: data?.page || 1,
		limit: data?.limit || 10,
		totalPages: data?.totalPages || 0,
		isLoading,
		isError,
		error,
	}
}
