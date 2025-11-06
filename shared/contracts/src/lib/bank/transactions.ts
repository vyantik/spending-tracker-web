import z from 'zod'

import { TransactionSchema } from '../transaction/transaction'

export const BankGetTransactionsRequestSchema = z.object({
	page: z.coerce.number().int().min(1).default(1).optional(),
	limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
})
export const BankGetTransactionsResponseSchema = z.object({
	transactions: z.array(TransactionSchema),
	total: z.number().int().min(0),
	page: z.number().int().min(1),
	limit: z.number().int().min(1),
	totalPages: z.number().int().min(0),
})

export type BankGetTransactionsRequest = z.infer<
	typeof BankGetTransactionsRequestSchema
>
export type BankGetTransactionsResponse = z.infer<
	typeof BankGetTransactionsResponseSchema
>
