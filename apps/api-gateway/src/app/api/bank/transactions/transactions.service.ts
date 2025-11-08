import type {
	BankGetTransactionsResponse,
	TransactionCreateResponse,
	TransactionDeleteResponse,
	TransactionGetResponse,
	TransactionUpdateResponse,
} from '@hermes/contracts'
import type { TransactionData } from '@hermes/types/proto/files'
import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import type { User } from '@prisma/client'

import type { IFilesService } from '../../../infra/files/interfaces'
import { FILES_SERVICE_TOKEN } from '../../../infra/files/tokens'

import type { TransactionCreateRequest, TransactionUpdateRequest } from './dto'
import type {
	ITransactionsRepository,
	ITransactionsService,
} from './interfaces'
import { TRANSACTIONS_REPOSITORY_TOKEN } from './tokens'

@Injectable()
export class TransactionsService implements ITransactionsService {
	public constructor(
		@Inject(TRANSACTIONS_REPOSITORY_TOKEN)
		private readonly transactionsRepository: ITransactionsRepository,
		@Inject(FILES_SERVICE_TOKEN)
		private readonly filesService: IFilesService,
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
