import {
	TransactionCategory as PrismaTransactionCategory,
	TransactionType as PrismaTransactionType,
} from '@prisma/client'
import z from 'zod'

export const TransactionType = z.enum(PrismaTransactionType)
export const TransactionCategory = z.enum(PrismaTransactionCategory)

export const TransactionSchema = z.object({
	id: z.uuid(),
	amount: z.number().min(0),
	description: z.string().max(1000),
	type: TransactionType,
	category: TransactionCategory,
})
