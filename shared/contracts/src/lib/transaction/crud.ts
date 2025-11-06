import z from 'zod'

import {
	DepositType,
	TransactionCategory,
	TransactionSchema,
	TransactionType,
} from './transaction'

export const TransactionCreateRequestSchema = z
	.object({
		amount: z
			.number({
				message: 'Сумма должна быть числом',
			})
			.refine(val => val !== undefined, {
				message: 'Сумма обязательна',
			})
			.min(1, {
				message: 'Сумма должна быть больше или равна 1',
			}),
		description: z
			.string()
			.max(1000, {
				message: 'Описание должно содержать максимум 1000 символов',
			})
			.optional(),
		type: TransactionType,
		category: TransactionCategory.optional(),
		depositType: DepositType.optional(),
	})
	.refine(
		data => {
			if (data.type === 'DEPOSIT') {
				return data.depositType !== undefined
			}
			return true
		},
		{
			message: 'Тип пополнения обязателен для пополнений',
			path: ['depositType'],
		},
	)
	.refine(
		data => {
			if (data.type === 'WITHDRAW') {
				return data.category !== undefined
			}
			return true
		},
		{
			message: 'Категория обязательна для снятий',
			path: ['category'],
		},
	)

export const TransactionCreateResponseSchema = z.object({
	message: z.string(),
})

export type TransactionCreateRequest = z.infer<
	typeof TransactionCreateRequestSchema
>
export type TransactionCreateResponse = z.infer<
	typeof TransactionCreateResponseSchema
>

export const TransactionUpdateRequestSchema = z.object({
	amount: z
		.number()
		.min(0, { message: 'Сумма должна быть больше или равна 0' })
		.optional(),
	description: z
		.string()
		.max(1000, {
			message: 'Описание должно содержать максимум 1000 символов',
		})
		.optional(),
	type: TransactionType.optional(),
	category: TransactionCategory.optional(),
	depositType: DepositType.optional(),
})

export const TransactionUpdateResponseSchema = z.object({
	message: z.string(),
})

export type TransactionUpdateRequest = z.infer<
	typeof TransactionUpdateRequestSchema
>
export type TransactionUpdateResponse = z.infer<
	typeof TransactionUpdateResponseSchema
>

export const TransactionDeleteRequestSchema = z.object({
	id: z.uuid(),
})

export const TransactionDeleteResponseSchema = z.object({
	message: z.string(),
})

export type TransactionDeleteRequest = z.infer<
	typeof TransactionDeleteRequestSchema
>
export type TransactionDeleteResponse = z.infer<
	typeof TransactionDeleteResponseSchema
>

export const TransactionGetRequestSchema = z.object({
	id: z.uuid(),
})

export const TransactionGetResponseSchema = TransactionSchema

export type TransactionGetRequest = z.infer<typeof TransactionGetRequestSchema>
export type TransactionGetResponse = z.infer<
	typeof TransactionGetResponseSchema
>
