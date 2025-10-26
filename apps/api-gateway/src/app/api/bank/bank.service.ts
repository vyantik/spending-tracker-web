import type {
	BankCreateResponse,
	BankDeleteResponse,
	BankGetResponse,
	BankUpdateResponse,
} from '@hermes/contracts'
import { BadRequestException, Injectable } from '@nestjs/common'

import { BankRepository } from './bank.repository'
import type { BankCreateRequest, BankUpdateRequest } from './dto'

@Injectable()
export class BankService {
	public constructor(private readonly bankRepository: BankRepository) {}

	public async get(bankId: string | null): Promise<BankGetResponse> {
		if (bankId === null) {
			throw new BadRequestException('Пользователь еще не создал банк')
		}

		return await this.bankRepository.findUnique({ id: bankId })
	}

	public async create(
		bankId: string | null,
		dto: BankCreateRequest,
	): Promise<BankCreateResponse> {
		if (bankId !== null) {
			throw new BadRequestException('Пользователь уже создал банк')
		}

		await this.bankRepository.create({ ...dto })

		return {
			message: 'ok',
		}
	}

	public async update(
		bankId: string | null,
		dto: BankUpdateRequest,
	): Promise<BankUpdateResponse> {
		if (bankId === null) {
			throw new BadRequestException('Пользователь еще не создал банк')
		}

		await this.bankRepository.update({ id: bankId }, { ...dto })

		return {
			message: 'ok',
		}
	}

	public async delete(bankId: string | null): Promise<BankDeleteResponse> {
		if (bankId === null) {
			throw new BadRequestException('Пользователь еще не создал банк')
		}

		await this.bankRepository.delete({ id: bankId })

		return {
			message: 'ok',
		}
	}
}
