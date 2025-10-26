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
  ) { }

  public async getTransactions(
    bankId: string | null,
  ): Promise<BankGetTransactionsResponse> {
    if (bankId === null) {
      throw new BadRequestException('Пользователь еще не создал банк')
    }
    return {
      transactions: (
        await this.transactionsRepository.getBankTransactions(bankId)
      ).map(transaction => ({
        ...transaction,
        amount: transaction.amount.toNumber(),
      })),
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
