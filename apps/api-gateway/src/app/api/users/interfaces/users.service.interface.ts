import type { ProfileGetResponse } from '@hermes/contracts'
import type { User } from '@prisma/client'

export interface IUsersService {
	getMe(user: User): Promise<ProfileGetResponse>
	uploadAvatar(user: User, file: Uint8Array): Promise<void>
}
