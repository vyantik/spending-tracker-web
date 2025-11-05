import z from 'zod'

export const ProfileGetResponseSchema = z.object({
	username: z.string().min(2).max(32),
	email: z.email(),
})

export type ProfileGetResponse = z.infer<typeof ProfileGetResponseSchema>
