import { UserRole as UserRoleEnum } from '@prisma/client'
import z from 'zod'

export const UserRole = z.enum(UserRoleEnum)

export const UserSchema = z.object({
	id: z.string(),
	username: z.string(),
	email: z.string(),
	password: z.string(),
	role: UserRole,
	bankId: z.string().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
})
