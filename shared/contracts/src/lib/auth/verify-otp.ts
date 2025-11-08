import z from 'zod'

export const VerifyOtpRequestSchema = z.object({
	email: z
		.email({ message: 'Некорректный адрес электронной почты' })
		.max(320),
	code: z
		.string()
		.length(6, { message: 'Код должен содержать 6 цифр' })
		.regex(/^\d+$/, { message: 'Код должен содержать только цифры' }),
})

export const VerifyOtpResponseSchema = z.object({
	message: z.string(),
})

export type VerifyOtpRequest = z.infer<typeof VerifyOtpRequestSchema>
export type VerifyOtpResponse = z.infer<typeof VerifyOtpResponseSchema>
