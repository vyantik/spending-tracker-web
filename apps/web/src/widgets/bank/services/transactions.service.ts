import type {
	BankGetTransactionsRequest,
	BankGetTransactionsResponse,
	TransactionCreateRequest,
	TransactionCreateResponse,
	TransactionDeleteResponse,
	TransactionUpdateRequest,
	TransactionUpdateResponse,
} from '@hermes/contracts'

import { api } from '@/shared/api'

class TransactionsService {
	public async getTransactions(
		params?: BankGetTransactionsRequest,
	): Promise<BankGetTransactionsResponse> {
		const searchParams = new URLSearchParams()
		if (params?.page) {
			searchParams.append('page', params.page.toString())
		}
		if (params?.limit) {
			searchParams.append('limit', params.limit.toString())
		}
		const queryString = searchParams.toString()
		const url = `/banks/transactions${queryString ? `?${queryString}` : ''}`
		return await api.get<BankGetTransactionsResponse>(url)
	}

	public async createTransaction(
		data: TransactionCreateRequest,
	): Promise<TransactionCreateResponse> {
		return await api.post<TransactionCreateResponse>(
			'/banks/transactions',
			data,
		)
	}

	public async updateTransaction(
		transactionId: string,
		data: TransactionUpdateRequest,
	): Promise<TransactionUpdateResponse> {
		return await api.patch<TransactionUpdateResponse>(
			`/banks/transactions/${transactionId}`,
			data,
		)
	}

	public async deleteTransaction(
		transactionId: string,
	): Promise<TransactionDeleteResponse> {
		return await api.delete<TransactionDeleteResponse>(
			`/banks/transactions/${transactionId}`,
		)
	}

	public async generateTransactionsExcel(): Promise<Blob> {
		const baseUrl = process.env.NEXT_PUBLIC_API_URL as string
		const url = `${baseUrl}/banks/transactions/export/excel`
		const token =
			typeof window !== 'undefined'
				? localStorage.getItem('access_token')
				: null

		const response = await fetch(url, {
			method: 'GET',
			credentials: 'include',
			headers: {
				...(token && { Authorization: `Bearer ${token}` }),
			},
		})

		if (!response.ok) {
			throw new Error('Failed to generate Excel file')
		}

		return await response.blob()
	}
}

export const transactionsService = new TransactionsService()
