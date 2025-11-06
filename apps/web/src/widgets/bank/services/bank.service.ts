import type {
	BankCreateRequest,
	BankCreateResponse,
	BankGetResponse,
	BankUpdateRequest,
	BankUpdateResponse,
} from '@hermes/contracts'

import { api } from '@/shared/api'

class BankService {
	public async getBank(): Promise<BankGetResponse> {
		return await api.get<BankGetResponse>('/banks')
	}

	public async createBank(
		data: BankCreateRequest,
	): Promise<BankCreateResponse> {
		return await api.post<BankCreateResponse>('/banks', data)
	}

	public async updateBank(
		data: BankUpdateRequest,
	): Promise<BankUpdateResponse> {
		return await api.patch<BankUpdateResponse>('/banks', data)
	}
}

export const bankService = new BankService()
