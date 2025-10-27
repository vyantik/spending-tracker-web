import type { ProfileGetResponse } from '@hermes/contracts'

import { api } from '@/shared/api'

class UserService {
	public async getProfile(): Promise<ProfileGetResponse> {
		return await api.get<ProfileGetResponse>('/users/@me')
	}

	public async logout(): Promise<undefined> {
		return await api.post<undefined>('/auth/logout')
	}
}

export const userService = new UserService()
