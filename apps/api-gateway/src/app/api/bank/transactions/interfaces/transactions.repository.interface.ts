import type { Transaction } from '@prisma/client'

import type { TransactionCreateRequest, TransactionUpdateRequest } from '../dto'

export interface ITransactionsRepository {
	getBankTransactions(
		bankId: string,
		page?: number,
		limit?: number,
	): Promise<{ transactions: Transaction[]; total: number }>
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
	getAllBankTransactions(bankId: string): Promise<Transaction[]>
	findUnique(where: {
		id: string
		userId: string
	}): Promise<Transaction | null>
	delete(where: { id: string; userId: string }): Promise<Transaction>
}
