import z from 'zod'

export const UploadAvatarResponseSchema = z.object({
	message: z.string(),
})

export type UploadAvatarResponse = z.infer<typeof UploadAvatarResponseSchema>
