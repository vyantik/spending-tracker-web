import z from 'zod'

import { strongPasswordRegex } from './register'

export const LoginRequestSchema = z.object({
	email: z
		.email({ message: 'Некорректный адрес электронной почты' })
		.max(320),
	password: z.string().regex(strongPasswordRegex, {
		message:
			'Пароль должен содержать минимум 8 символов, включая заглавные и строчные буквы, цифры и символы !@#$%^&*',
	}),
})

export const LoginResponseSchema = z.object({
	access_token: z.string(),
})

export type LoginRequest = z.infer<typeof LoginRequestSchema>
export type LoginResponse = z.infer<typeof LoginResponseSchema>
