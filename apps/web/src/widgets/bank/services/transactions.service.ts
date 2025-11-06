import type {
	BankGetTransactionsRequest,
	BankGetTransactionsResponse,
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
}

export const transactionsService = new TransactionsService()
