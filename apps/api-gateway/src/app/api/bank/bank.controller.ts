import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Patch,
	Post,
} from '@nestjs/common'
import {
	ApiBadRequestResponse,
	ApiBody,
	ApiCreatedResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from '@nestjs/swagger'

import { Authorized, Protected } from '../../common'

import { BankService } from './bank.service'
import { BAD_REQUEST_BANK_NOT_CREATED_EXAMPLE } from './constants'
import {
	BankCreateRequest,
	BankCreateResponse,
	BankDeleteResponse,
	BankGetResponse,
	BankGetResponseSwagger,
	BankUpdateRequest,
	BankUpdateResponse,
} from './dto'

@ApiTags('Bank interact')
@Controller('banks')
export class BankController {
	public constructor(private readonly bankService: BankService) {}

	@ApiOperation({ summary: 'Create bank' })
	@ApiBody({ type: BankCreateRequest })
	@ApiCreatedResponse({ type: BankCreateResponse })
	@ApiBadRequestResponse({
		...BAD_REQUEST_BANK_NOT_CREATED_EXAMPLE,
	})
	@HttpCode(HttpStatus.CREATED)
	@Protected()
	@Post()
	public async create(
		@Body() dto: BankCreateRequest,
		@Authorized('id') userId: string,
	): Promise<BankCreateResponse> {
		return await this.bankService.create(userId, dto)
	}

	@ApiOperation({ summary: 'Get bank' })
	@ApiOkResponse({ type: BankGetResponseSwagger })
	@ApiBadRequestResponse({
		...BAD_REQUEST_BANK_NOT_CREATED_EXAMPLE,
	})
	@HttpCode(HttpStatus.OK)
	@Protected()
	@Get()
	public async get(
		@Authorized('id') userId: string,
	): Promise<BankGetResponse> {
		return await this.bankService.get(userId)
	}

	@ApiOperation({ summary: 'Update bank' })
	@ApiBody({ type: BankUpdateRequest })
	@ApiOkResponse({ type: BankUpdateResponse })
	@ApiBadRequestResponse({
		...BAD_REQUEST_BANK_NOT_CREATED_EXAMPLE,
	})
	@HttpCode(HttpStatus.OK)
	@Protected()
	@Patch()
	public async update(
		@Authorized('bankId') bankId: string | null,
		@Body() dto: BankUpdateRequest,
	): Promise<BankUpdateResponse> {
		return await this.bankService.update(bankId, dto)
	}

	@ApiOperation({ summary: 'Delete bank' })
	@ApiOkResponse({ type: BankDeleteResponse })
	@ApiBadRequestResponse({
		...BAD_REQUEST_BANK_NOT_CREATED_EXAMPLE,
	})
	@HttpCode(HttpStatus.OK)
	@Protected()
	@Delete()
	public async delete(
		@Authorized('bankId') bankId: string | null,
	): Promise<BankDeleteResponse> {
		return await this.bankService.delete(bankId)
	}
}
