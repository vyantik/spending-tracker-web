import { TransactionGetRequestSchema } from '@hermes/contracts'
import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	Query,
} from '@nestjs/common'
import {
	ApiBadRequestResponse,
	ApiCreatedResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from '@nestjs/swagger'
import type { User } from '@prisma/client'
import z from 'zod'

import { Authorized, Protected } from '../../../common'
import { BAD_REQUEST_BANK_NOT_CREATED_EXAMPLE } from '../constants'
import { BankGetTransactionsResponse } from '../dto'

import {
	TransactionCreateRequest,
	TransactionCreateResponse,
	TransactionGetResponse,
	TransactionUpdateRequest,
	TransactionUpdateResponse,
} from './dto'
import { TransactionsService } from './transactions.service'

@ApiTags('Transactions interact')
@Controller('banks/transactions')
export class TransactionsController {
	public constructor(
		private readonly transactionsService: TransactionsService,
	) {}

	@ApiOperation({ summary: 'Get bank transactions' })
	@ApiOkResponse({ type: BankGetTransactionsResponse })
	@ApiBadRequestResponse({
		...BAD_REQUEST_BANK_NOT_CREATED_EXAMPLE,
	})
	@HttpCode(HttpStatus.OK)
	@Protected()
	@Get()
	public async getTransactions(
		@Authorized('bankId') bankId: string | null,
		@Query('page') page?: string,
		@Query('limit') limit?: string,
	): Promise<BankGetTransactionsResponse> {
		const pageNum = page ? parseInt(page, 10) : 1
		const limitNum = limit ? parseInt(limit, 10) : 10
		return await this.transactionsService.getTransactions(
			bankId,
			pageNum,
			limitNum,
		)
	}

	@ApiOperation({ summary: 'Add transactions' })
	@ApiCreatedResponse({ type: TransactionCreateResponse })
	@ApiBadRequestResponse({
		...BAD_REQUEST_BANK_NOT_CREATED_EXAMPLE,
	})
	@HttpCode(HttpStatus.CREATED)
	@Protected()
	@Post()
	public async addTransaction(
		@Authorized() user: User,
		@Body() dto: TransactionCreateRequest,
	): Promise<TransactionCreateResponse> {
		return this.transactionsService.addTransaction(dto, user)
	}

	@ApiOperation({ summary: 'Add transactions' })
	@ApiCreatedResponse({ type: TransactionUpdateResponse })
	@ApiBadRequestResponse({
		...BAD_REQUEST_BANK_NOT_CREATED_EXAMPLE,
	})
	@HttpCode(HttpStatus.OK)
	@Protected()
	@Patch('/:transactionId')
	public async updateTransaction(
		@Authorized('id') userId: string,
		@Param() transactionId: string,
		@Body() dto: TransactionUpdateRequest,
	): Promise<TransactionUpdateResponse> {
		await z.parseAsync(TransactionGetRequestSchema, {
			id: transactionId,
		})
		return this.transactionsService.updateTransaction(
			dto,
			userId,
			transactionId,
		)
	}

	@ApiOperation({ summary: 'Add transactions' })
	@ApiCreatedResponse({ type: TransactionGetResponse })
	@HttpCode(HttpStatus.OK)
	@Protected()
	@Get('/:transactionId')
	public async getTransaction(
		@Authorized('id') userId: string,
		@Param() transactionId: string,
	): Promise<TransactionGetResponse> {
		await z.parseAsync(TransactionGetRequestSchema, {
			id: transactionId,
		})
		return this.transactionsService.getTransaction(transactionId, userId)
	}
}
