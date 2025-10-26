import z from 'zod'

export const BankCreateRequestSchema = z.object({
	name: z.string().min(2).max(32),
	description: z.string().min(1).max(1000).optional(),
})

export const BankCreateResponseSchema = z.object({
	message: z.string(),
})

export type BankCreateRequest = z.infer<typeof BankCreateRequestSchema>
export type BankCreateResponse = z.infer<typeof BankCreateResponseSchema>

export const BankUpdateRequestSchema = z.object({
	name: z.string().min(2).max(32).optional(),
	description: z.string().min(1).max(1000).optional(),
})

export const BankUpdateResponseSchema = z.object({
	message: z.string(),
})

export type BankUpdateRequest = z.infer<typeof BankUpdateRequestSchema>
export type BankUpdateResponse = z.infer<typeof BankUpdateResponseSchema>

export const BankDeleteRequestSchema = z.object({})

export const BankDeleteResponseSchema = z.object({
	message: z.string(),
})

export type BankDeleteRequest = z.infer<typeof BankDeleteRequestSchema>
export type BankDeleteResponse = z.infer<typeof BankDeleteResponseSchema>

export const BankGetRequestSchema = z.object({})

export const BankGetResponseSchema = z.object({
	id: z.uuid(),
	name: z.string().max(32),
	description: z.string().max(1000),
	createdAt: z.date(),
	updatedAt: z.date(),
})

export type BankGetRequest = z.infer<typeof BankGetRequestSchema>
export type BankGetResponse = z.infer<typeof BankGetResponseSchema>
