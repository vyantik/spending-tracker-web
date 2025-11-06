import type {
	ProfileGetResponse,
	UploadAvatarResponse,
} from '@hermes/contracts'

import { api } from '@/shared/api'

class UserService {
	public async getProfile(): Promise<ProfileGetResponse> {
		return await api.get<ProfileGetResponse>('/users/@me')
	}

	public async logout(): Promise<undefined> {
		return await api.post<undefined>('/auth/logout')
	}

	public async uploadAvatar(file: File): Promise<UploadAvatarResponse> {
		return await api.uploadFile<UploadAvatarResponse>(
			'/users/@me/avatar',
			file,
		)
	}
}

export const userService = new UserService()
