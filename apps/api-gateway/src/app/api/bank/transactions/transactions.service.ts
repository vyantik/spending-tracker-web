import type {
	BankGetTransactionsResponse,
	TransactionCreateResponse,
	TransactionDeleteResponse,
	TransactionGetResponse,
	TransactionUpdateResponse,
} from '@hermes/contracts'
import { TransactionData } from '@hermes/types/proto/files'
import { BadRequestException, Injectable } from '@nestjs/common'
import type { User } from '@prisma/client'

import { FilesService } from '../../../infra'

import type { TransactionCreateRequest, TransactionUpdateRequest } from './dto'
import { TransactionsRepository } from './transactions.repository'

@Injectable()
export class TransactionsService {
	public constructor(
		private readonly transactionsRepository: TransactionsRepository,
		private readonly filesService: FilesService,
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
				id: transaction.id,
				amount: transaction.amount.toNumber(),
				description: transaction.description,
				type: transaction.type,
				category: transaction.category,
				depositType: transaction.depositType,
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
		if (!transaction) {
			throw new BadRequestException('Транзакция не найдена')
		}
		return {
			id: transaction.id,
			amount: transaction.amount.toNumber(),
			description: transaction.description,
			type: transaction.type,
			category: transaction.category,
			depositType: transaction.depositType,
		}
	}

	public async deleteTransaction(
		transactionId: string,
		userId: string,
	): Promise<TransactionDeleteResponse> {
		await this.transactionsRepository.delete({
			id: transactionId,
			userId: userId,
		})
		return {
			message: 'ok',
		}
	}

	public async generateTransactionsExcel(
		bankId: string | null,
	): Promise<{ file: Uint8Array; filename: string }> {
		if (bankId === null) {
			throw new BadRequestException('Пользователь еще не создал банк')
		}

		const transactions =
			await this.transactionsRepository.getAllBankTransactions(bankId)

		const transactionData: TransactionData[] = transactions.map(t => ({
			id: t.id,
			amount: t.amount.toNumber(),
			description: t.description || '',
			type: t.type,
			category: t.category || undefined,
			depositType: t.depositType || undefined,
			createdAt: Math.floor(t.createdAt.getTime() / 1000),
		}))

		return await this.filesService.generateTransactionsExcel(
			transactionData,
			bankId,
		)
	}
}
