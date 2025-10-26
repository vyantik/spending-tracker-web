import z from 'zod'

import { strongPasswordRegex } from './register'

export const LoginRequestSchema = z.object({
	email: z.email().max(320),
	password: z.string().regex(strongPasswordRegex),
})

export const LoginResponseSchema = z.object({
	access_token: z.string(),
})

export type LoginRequest = z.infer<typeof LoginRequestSchema>
export type LoginResponse = z.infer<typeof LoginResponseSchema>
