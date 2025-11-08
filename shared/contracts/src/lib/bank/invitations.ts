import z from 'zod'

export const InvitationStatusEnum = ['PENDING', 'ACCEPTED', 'DECLINED'] as const

export const InvitationStatus = z.enum(InvitationStatusEnum)

export const BankInvitationCreateRequestSchema = z.object({
	inviteeUsername: z
		.string()
		.min(1, { message: 'Имя пользователя обязательно' })
		.max(32, {
			message: 'Имя пользователя должно содержать максимум 32 символа',
		}),
})

export const BankInvitationCreateResponseSchema = z.object({
	message: z.string(),
})

export type BankInvitationCreateRequest = z.infer<
	typeof BankInvitationCreateRequestSchema
>
export type BankInvitationCreateResponse = z.infer<
	typeof BankInvitationCreateResponseSchema
>

export const BankInvitationGetResponseSchema = z.object({
	id: z.uuid(),
	bankId: z.uuid(),
	bankName: z.string(),
	inviterId: z.uuid(),
	inviterUsername: z.string(),
	inviteeId: z.uuid(),
	inviteeUsername: z.string(),
	status: InvitationStatus,
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
})

export type BankInvitationGetResponse = z.infer<
	typeof BankInvitationGetResponseSchema
>

export const BankInvitationListResponseSchema = z.array(
	BankInvitationGetResponseSchema,
)

export type BankInvitationListResponse = z.infer<
	typeof BankInvitationListResponseSchema
>

export const BankInvitationAcceptRequestSchema = z.object({
	id: z.uuid(),
})

export const BankInvitationAcceptResponseSchema = z.object({
	message: z.string(),
})

export type BankInvitationAcceptRequest = z.infer<
	typeof BankInvitationAcceptRequestSchema
>
export type BankInvitationAcceptResponse = z.infer<
	typeof BankInvitationAcceptResponseSchema
>

export const BankInvitationDeclineRequestSchema = z.object({
	id: z.uuid(),
})

export const BankInvitationDeclineResponseSchema = z.object({
	message: z.string(),
})

export type BankInvitationDeclineRequest = z.infer<
	typeof BankInvitationDeclineRequestSchema
>
export type BankInvitationDeclineResponse = z.infer<
	typeof BankInvitationDeclineResponseSchema
>
