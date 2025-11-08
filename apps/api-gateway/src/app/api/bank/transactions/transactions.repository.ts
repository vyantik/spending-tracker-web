import { Injectable } from '@nestjs/common'
import type { Prisma, Transaction } from '@prisma/client'
import type { DefaultArgs } from '@prisma/client/runtime/library'

import { BaseRepository } from '../../../common'

import type { TransactionCreateRequest, TransactionUpdateRequest } from './dto'
import type { ITransactionsRepository } from './interfaces'

export type TransactionWithUser = Prisma.TransactionGetPayload<{
	include: {
		user: {
			select: {
				id: true
				username: true
				email: true
				avatar: true
			}
		}
	}
}>

@Injectable()
export class TransactionsRepository
	extends BaseRepository<
		Transaction,
		Prisma.TransactionCreateInput,
		Prisma.TransactionUpdateInput,
		Prisma.TransactionWhereInput,
		Prisma.TransactionWhereUniqueInput
	>
	implements ITransactionsRepository
{
	protected get model(): Prisma.TransactionDelegate<DefaultArgs> {
		return this.prismaService.transaction
	}

	public async getBankTransactions(
		bankId: string,
		page: number = 1,
		limit: number = 10,
	): Promise<{ transactions: TransactionWithUser[]; total: number }> {
		const skip = (page - 1) * limit
		const [transactions, total] = await Promise.all([
			this.model.findMany({
				where: { bankId },
				skip,
				take: limit,
				orderBy: { createdAt: 'desc' },
				include: {
					user: {
						select: {
							id: true,
							username: true,
							email: true,
							avatar: true,
						},
					},
				},
			}),
			this.model.count({ where: { bankId } }),
		])
		return { transactions, total }
	}

	public async addTransaction(
		bankId: string,
		userId: string,
		dto: TransactionCreateRequest,
	): Promise<Transaction> {
		const data: Prisma.TransactionCreateInput = {
			amount: dto.amount,
			description: dto.description || '',
			type: dto.type,
			category: dto.category || null,
			depositType: dto.depositType || null,
			bank: {
				connect: {
					id: bankId,
				},
			},
			user: {
				connect: {
					id: userId,
				},
			},
		}
		return await this.create(data)
	}

	public async updateTransaction(
		dto: TransactionUpdateRequest,
		id: string,
		userId: string,
	): Promise<Transaction> {
		return await this.update({ id, userId }, dto)
	}

	public async getAllBankTransactions(
		bankId: string,
	): Promise<Transaction[]> {
		return await this.model.findMany({
			where: { bankId },
			orderBy: { createdAt: 'desc' },
		})
	}
}
