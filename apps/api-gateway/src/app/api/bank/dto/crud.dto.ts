import {
	BankCreateRequestSchema,
	BankCreateResponseSchema,
	BankDeleteRequestSchema,
	BankDeleteResponseSchema,
	BankGetRequestSchema,
	BankGetResponseSchema,
	BankGetTransactionsRequestSchema,
	BankGetTransactionsResponseSchema,
	BankUpdateRequestSchema,
	BankUpdateResponseSchema,
} from '@hermes/contracts'
import { ApiProperty } from '@nestjs/swagger'
import { createZodDto } from 'nestjs-zod'

export class BankCreateRequest extends createZodDto(BankCreateRequestSchema) {}
export class BankGetRequest extends createZodDto(BankGetRequestSchema) {}
export class BankGetTransactionsRequest extends createZodDto(
	BankGetTransactionsRequestSchema,
) {}
export class BankUpdateRequest extends createZodDto(BankUpdateRequestSchema) {}
export class BankDeleteRequest extends createZodDto(BankDeleteRequestSchema) {}

export class BankCreateResponse extends createZodDto(
	BankCreateResponseSchema,
) {}
export class BankDeleteResponse extends createZodDto(
	BankDeleteResponseSchema,
) {}
export class BankGetResponse extends createZodDto(BankGetResponseSchema) {}
export class BankGetTransactionsResponse extends createZodDto(
	BankGetTransactionsResponseSchema,
) {}
export class BankUpdateResponse extends createZodDto(
	BankUpdateResponseSchema,
) {}

export class BankGetResponseSwagger {
	@ApiProperty({ type: 'string', format: 'uuid' })
	id: string

	@ApiProperty({ type: 'string', maxLength: 32 })
	name: string

	@ApiProperty({ type: 'string', maxLength: 1000 })
	description: string

	@ApiProperty({ type: 'string', format: 'date-time' })
	createdAt: Date

	@ApiProperty({ type: 'string', format: 'date-time' })
	updatedAt: Date
}
