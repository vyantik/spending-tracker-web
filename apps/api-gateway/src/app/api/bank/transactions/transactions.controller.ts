import { TransactionGetRequestSchema } from '@hermes/contracts'
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	Query,
	Res,
} from '@nestjs/common'
import {
	ApiBadRequestResponse,
	ApiCreatedResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from '@nestjs/swagger'
import type { User } from '@prisma/client'
import type { Response } from 'express'
import z from 'zod'

import { Authorized, Protected } from '../../../common'
import { BAD_REQUEST_BANK_NOT_CREATED_EXAMPLE } from '../constants'
import { BankGetTransactionsResponse } from '../dto'

import {
	TransactionCreateRequest,
	TransactionCreateResponse,
	TransactionDeleteResponse,
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
		@Authorized('bankId') bankId: string | null,
		@Param('transactionId') transactionId: string,
		@Body() dto: TransactionUpdateRequest,
	): Promise<TransactionUpdateResponse> {
		await z.parseAsync(TransactionGetRequestSchema, {
			id: transactionId,
		})
		return this.transactionsService.updateTransaction(
			dto,
			bankId,
			transactionId,
		)
	}

	@ApiOperation({ summary: 'Get transaction' })
	@ApiCreatedResponse({ type: TransactionGetResponse })
	@HttpCode(HttpStatus.OK)
	@Protected()
	@Get('/:transactionId')
	public async getTransaction(
		@Authorized('bankId') bankId: string | null,
		@Param('transactionId') transactionId: string,
	): Promise<TransactionGetResponse> {
		await z.parseAsync(TransactionGetRequestSchema, {
			id: transactionId,
		})
		return this.transactionsService.getTransaction(transactionId, bankId)
	}

	@ApiOperation({ summary: 'Delete transaction' })
	@ApiOkResponse({ type: TransactionDeleteResponse })
	@HttpCode(HttpStatus.OK)
	@Protected()
	@Delete('/:transactionId')
	public async deleteTransaction(
		@Authorized('bankId') bankId: string | null,
		@Param('transactionId') transactionId: string,
	): Promise<TransactionDeleteResponse> {
		await z.parseAsync(TransactionGetRequestSchema, {
			id: transactionId,
		})
		return this.transactionsService.deleteTransaction(transactionId, bankId)
	}

	@ApiOperation({
		summary: 'Generate Excel file with transactions statistics',
	})
	@ApiOkResponse({
		description: 'Excel file with transactions statistics',
		content: {
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
				{},
		},
	})
	@ApiBadRequestResponse({
		...BAD_REQUEST_BANK_NOT_CREATED_EXAMPLE,
	})
	@HttpCode(HttpStatus.OK)
	@Protected()
	@Get('/export/excel')
	public async generateTransactionsExcel(
		@Authorized('bankId') bankId: string | null,
		@Res() res: Response,
	): Promise<void> {
		const { file, filename } =
			await this.transactionsService.generateTransactionsExcel(bankId)

		res.setHeader(
			'Content-Type',
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		)
		res.setHeader(
			'Content-Disposition',
			`attachment; filename="${filename}"`,
		)
		res.send(Buffer.from(file))
	}
}
