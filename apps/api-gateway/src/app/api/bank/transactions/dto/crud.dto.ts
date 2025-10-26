import {
  TransactionCreateRequestSchema,
  TransactionCreateResponseSchema,
  TransactionDeleteRequestSchema,
  TransactionDeleteResponseSchema,
  TransactionGetRequestSchema,
  TransactionGetResponseSchema,
  TransactionUpdateRequestSchema,
  TransactionUpdateResponseSchema,
} from '@hermes/contracts'
import { createZodDto } from 'nestjs-zod'

export class TransactionCreateRequest extends createZodDto(
  TransactionCreateRequestSchema,
) { }
export class TransactionGetRequest extends createZodDto(
  TransactionGetRequestSchema,
) { }
export class TransactionUpdateRequest extends createZodDto(
  TransactionUpdateRequestSchema,
) { }
export class TransactionDeleteRequest extends createZodDto(
  TransactionDeleteRequestSchema,
) { }

export class TransactionCreateResponse extends createZodDto(
  TransactionCreateResponseSchema,
) { }
export class TransactionGetResponse extends createZodDto(
  TransactionGetResponseSchema,
) { }
export class TransactionUpdateResponse extends createZodDto(
  TransactionUpdateResponseSchema,
) { }
export class TransactionDeleteResponse extends createZodDto(
  TransactionDeleteResponseSchema,
) { }
