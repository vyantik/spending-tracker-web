import z from 'zod'

export const strongPasswordRegex = new RegExp(
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,32}$/,
)

export const RegisterRequestSchema = z
	.object({
		username: z
			.string()
			.min(2, {
				message: 'Имя пользователя должно содержать минимум 2 символа',
			})
			.max(32, {
				message:
					'Имя пользователя должно содержать максимум 32 символа',
			}),
		email: z
			.email({ message: 'Некорректный адрес электронной почты' })
			.max(320),
		password: z.string().regex(strongPasswordRegex, {
			message:
				'Пароль должен содержать минимум 8 символов, включая заглавные и строчные буквы, цифры и символы !@#$%^&*',
		}),
		passwordRepeat: z.string().regex(strongPasswordRegex, {
			message:
				'Пароль должен содержать минимум 8 символов, включая заглавные и строчные буквы, цифры и символы !@#$%^&*',
		}),
	})
	.refine(data => data.password === data.passwordRepeat, {
		message: 'Пароли не совпадают',
	})

export const RegisterResponseSchema = z.object({
	message: z.string(),
})

export type RegisterRequest = z.infer<typeof RegisterRequestSchema>
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>
