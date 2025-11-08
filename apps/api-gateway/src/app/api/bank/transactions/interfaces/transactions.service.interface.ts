import type {
	BankGetTransactionsResponse,
	TransactionCreateResponse,
	TransactionDeleteResponse,
	TransactionGetResponse,
	TransactionUpdateResponse,
} from '@hermes/contracts'
import type { User } from '@prisma/client'

import type { TransactionCreateRequest, TransactionUpdateRequest } from '../dto'

export interface ITransactionsService {
	getTransactions(
		bankId: string | null,
		page?: number,
		limit?: number,
	): Promise<BankGetTransactionsResponse>
	addTransaction(
		dto: TransactionCreateRequest,
		user: User,
	): Promise<TransactionCreateResponse>
	updateTransaction(
		dto: TransactionUpdateRequest,
		userId: string,
		transactionId: string,
	): Promise<TransactionUpdateResponse>
	getTransaction(
		transactionId: string,
		userId: string,
	): Promise<TransactionGetResponse>
	deleteTransaction(
		transactionId: string,
		userId: string,
	): Promise<TransactionDeleteResponse>
	generateTransactionsExcel(bankId: string | null): Promise<{
		file: Uint8Array
		filename: string
	}>
}
