import {
	BankInvitationAcceptRequestSchema,
	BankInvitationAcceptResponseSchema,
	BankInvitationCreateRequestSchema,
	BankInvitationCreateResponseSchema,
	BankInvitationDeclineRequestSchema,
	BankInvitationDeclineResponseSchema,
	BankInvitationGetResponseSchema,
	BankInvitationListResponseSchema,
} from '@hermes/contracts'
import { createZodDto } from 'nestjs-zod'

export class BankInvitationCreateRequest extends createZodDto(
	BankInvitationCreateRequestSchema,
) {}

export class BankInvitationCreateResponse extends createZodDto(
	BankInvitationCreateResponseSchema,
) {}

export class BankInvitationGetResponse extends createZodDto(
	BankInvitationGetResponseSchema,
) {}

export class BankInvitationListResponse extends createZodDto(
	BankInvitationListResponseSchema,
) {}

export class BankInvitationAcceptRequest extends createZodDto(
	BankInvitationAcceptRequestSchema,
) {}

export class BankInvitationAcceptResponse extends createZodDto(
	BankInvitationAcceptResponseSchema,
) {}

export class BankInvitationDeclineRequest extends createZodDto(
	BankInvitationDeclineRequestSchema,
) {}

export class BankInvitationDeclineResponse extends createZodDto(
	BankInvitationDeclineResponseSchema,
) {}
