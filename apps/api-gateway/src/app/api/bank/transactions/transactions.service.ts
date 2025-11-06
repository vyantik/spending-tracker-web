import type {
	BankGetTransactionsResponse,
	TransactionCreateResponse,
	TransactionGetResponse,
	TransactionUpdateResponse,
} from '@hermes/contracts'
import { BadRequestException, Injectable } from '@nestjs/common'
import type { User } from '@prisma/client'

import type { TransactionCreateRequest, TransactionUpdateRequest } from './dto'
import { TransactionsRepository } from './transactions.repository'

@Injectable()
export class TransactionsService {
	public constructor(
		private readonly transactionsRepository: TransactionsRepository,
	) {}

	public async getTransactions(
		bankId: string | null,
		page: number = 1,
		limit: number = 10,
	): Promise<BankGetTransactionsResponse> {
		if (bankId === null) {
			throw new BadRequestException('Пользователь еще не создал банк')
		}
		const { transactions, total } =
			await this.transactionsRepository.getBankTransactions(
				bankId,
				page,
				limit,
			)
		const totalPages = Math.ceil(total / limit)
		return {
			transactions: transactions.map(transaction => ({
				...transaction,
				amount: transaction.amount.toNumber(),
			})),
			total,
			page,
			limit,
			totalPages,
		}
	}

	public async addTransaction(
		dto: TransactionCreateRequest,
		{ bankId, id }: User,
	): Promise<TransactionCreateResponse> {
		if (bankId === null) {
			throw new BadRequestException('Пользователь еще не создал банк')
		}
		await this.transactionsRepository.addTransaction(bankId, id, dto)
		return {
			message: 'ok',
		}
	}

	public async updateTransaction(
		dto: TransactionUpdateRequest,
		userId: string,
		transactionId: string,
	): Promise<TransactionUpdateResponse> {
		await this.transactionsRepository.updateTransaction(
			dto,
			transactionId,
			userId,
		)
		return {
			message: 'ok',
		}
	}

	public async getTransaction(
		transactionId: string,
		userId: string,
	): Promise<TransactionGetResponse> {
		const transaction = await this.transactionsRepository.findUnique({
			id: transactionId,
			userId: userId,
		})
		return {
			...transaction,
			amount: transaction.amount.toNumber(),
		}
	}
}
