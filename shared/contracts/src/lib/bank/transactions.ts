import z from 'zod'

import { TransactionSchema } from '../transaction/transaction'

export const BankGetTransactionsRequestSchema = z.object({})
export const BankGetTransactionsResponseSchema = z.object({
	transactions: z.array(TransactionSchema),
})

export type BankGetTransactionsRequest = z.infer<
	typeof BankGetTransactionsRequestSchema
>
export type BankGetTransactionsResponse = z.infer<
	typeof BankGetTransactionsResponseSchema
>
