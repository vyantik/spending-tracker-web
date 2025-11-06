import z from 'zod'

export const BankCreateRequestSchema = z.object({
	name: z
		.string()
		.min(2, { message: 'Название должно содержать минимум 2 символа' })
		.max(32, { message: 'Название должно содержать максимум 32 символа' }),
	description: z
		.string()
		.max(1000, {
			message: 'Описание должно содержать максимум 1000 символов',
		})
		.optional(),
})

export const BankCreateResponseSchema = z.object({
	message: z.string(),
})

export type BankCreateRequest = z.infer<typeof BankCreateRequestSchema>
export type BankCreateResponse = z.infer<typeof BankCreateResponseSchema>

export const BankUpdateRequestSchema = z.object({
	name: z
		.string()
		.min(2, { message: 'Название должно содержать минимум 2 символа' })
		.max(32, { message: 'Название должно содержать максимум 32 символа' })
		.optional(),
	description: z
		.string()
		.max(1000, {
			message: 'Описание должно содержать максимум 1000 символов',
		})
		.optional(),
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
	name: z
		.string()
		.max(32, { message: 'Название должно содержать максимум 32 символа' }),
	description: z.string().max(1000, {
		message: 'Описание должно содержать максимум 1000 символов',
	}),
	createdAt: z.date(),
	updatedAt: z.date(),
})

export type BankGetRequest = z.infer<typeof BankGetRequestSchema>
export type BankGetResponse = z.infer<typeof BankGetResponseSchema>
