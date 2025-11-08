import type {
	BankCreateResponse,
	BankDeleteResponse,
	BankGetResponse,
	BankUpdateResponse,
} from '@hermes/contracts'

import type { BankCreateRequest, BankUpdateRequest } from '../dto'

export interface IBankService {
	get(userId: string): Promise<BankGetResponse>
	create(userId: string, dto: BankCreateRequest): Promise<BankCreateResponse>
	update(
		bankId: string | null,
		dto: BankUpdateRequest,
	): Promise<BankUpdateResponse>
	delete(bankId: string | null): Promise<BankDeleteResponse>
}
