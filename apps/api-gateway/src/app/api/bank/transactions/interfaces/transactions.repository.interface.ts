import type { Transaction } from '@prisma/client'

import type { TransactionCreateRequest, TransactionUpdateRequest } from '../dto'
import type {
	TransactionForExcel,
	TransactionWithUser,
} from '../transactions.repository'

export interface ITransactionsRepository {
	getBankTransactions(
		bankId: string,
		page?: number,
		limit?: number,
	): Promise<{ transactions: TransactionWithUser[]; total: number }>
	addTransaction(
		bankId: string,
		userId: string,
		dto: TransactionCreateRequest,
	): Promise<Transaction>
	updateTransaction(
		dto: TransactionUpdateRequest,
		id: string,
		bankId: string,
	): Promise<Transaction>
	getAllBankTransactions(bankId: string): Promise<TransactionForExcel[]>
	findByBankId(id: string, bankId: string): Promise<Transaction | null>
	deleteByBankId(id: string, bankId: string): Promise<Transaction>
}
