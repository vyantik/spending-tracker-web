import type { Transaction } from '@prisma/client'

import type { TransactionCreateRequest, TransactionUpdateRequest } from '../dto'
import type {
	TransactionForExcel,
	TransactionWhereUnique,
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
		userId: string,
	): Promise<Transaction>
	getAllBankTransactions(bankId: string): Promise<TransactionForExcel[]>
	findUnique(where: TransactionWhereUnique): Promise<Transaction | null>
	delete(where: TransactionWhereUnique): Promise<Transaction>
}
