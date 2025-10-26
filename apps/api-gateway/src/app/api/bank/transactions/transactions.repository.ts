import { Injectable } from '@nestjs/common'
import { Prisma, Transaction } from '@prisma/client'
import { DefaultArgs } from '@prisma/client/runtime/library'

import { BaseRepository } from '../../../common'

import type { TransactionCreateRequest, TransactionUpdateRequest } from './dto'

@Injectable()
export class TransactionsRepository extends BaseRepository<
  Transaction,
  Prisma.TransactionCreateInput,
  Prisma.TransactionUpdateInput,
  Prisma.TransactionWhereInput,
  Prisma.TransactionWhereUniqueInput
> {
  protected get model(): Prisma.TransactionDelegate<DefaultArgs> {
    return this.prismaService.transaction
  }

  public async getBankTransactions(bankId: string): Promise<Transaction[]> {
    return await this.findMany({ bankId })
  }

  public async addTransaction(
    bankId: string,
    userId: string,
    dto: TransactionCreateRequest,
  ): Promise<Transaction> {
    return await this.create({
      ...dto,
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
    })
  }

  public async updateTransaction(
    dto: TransactionUpdateRequest,
    id: string,
    userId: string,
  ): Promise<Transaction> {
    return await this.update({ id, userId }, dto)
  }
}
