import type {
	LoginRequest,
	LoginResponse,
	RegisterRequest,
	RegisterResponse,
} from '@hermes/contracts'

import { api } from '@/shared/api'

class AuthService {
	public async register(body: RegisterRequest): Promise<RegisterResponse> {
		return await api.post<RegisterResponse>('/auth/register', body)
	}

	public async login(body: LoginRequest): Promise<LoginResponse> {
		return await api.post<LoginResponse>('/auth/login', body)
	}

	public async logout(): Promise<undefined> {
		return await api.post<undefined>('/auth/logout')
	}

	public async refresh(): Promise<LoginResponse> {
		return await api.post<LoginResponse>('/auth/refresh')
	}
}

export const authService = new AuthService()
