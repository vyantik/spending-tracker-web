import z from 'zod'

export const strongPasswordRegex = new RegExp(
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,32}$/,
)

export const RegisterRequestSchema = z.object({
	username: z.string().min(2).max(32),
	email: z.email().max(320),
	password: z.string().regex(strongPasswordRegex),
})

export const RegisterResponseSchema = z.object({
	message: z.string(),
})

export type RegisterRequest = z.infer<typeof RegisterRequestSchema>
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>
