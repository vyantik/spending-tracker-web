import z from 'zod'

import { UserSchema } from './user'

export const ProfileGetResponseSchema = UserSchema

export type ProfileGetResponse = z.infer<typeof ProfileGetResponseSchema>
