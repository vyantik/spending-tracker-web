import type {
	BankCreateResponse,
	BankDeleteResponse,
	BankGetResponse,
	BankUpdateResponse,
} from '@hermes/contracts'
import { BadRequestException, Inject, Injectable } from '@nestjs/common'

import type { BankCreateRequest, BankUpdateRequest } from './dto'
import type { IBankRepository, IBankService } from './interfaces'
import { BANK_REPOSITORY_TOKEN } from './tokens'

@Injectable()
export class BankService implements IBankService {
	public constructor(
		@Inject(BANK_REPOSITORY_TOKEN)
		private readonly bankRepository: IBankRepository,
	) {}

	public async get(userId: string): Promise<BankGetResponse> {
		const bank = await this.bankRepository.findByUserId(userId)

		if (!bank) {
			throw new BadRequestException('Пользователь еще не создал банк')
		}

		return {
			...bank,
		}
	}

	public async create(
		userId: string,
		dto: BankCreateRequest,
	): Promise<BankCreateResponse> {
		const bank = await this.bankRepository.findByUserId(userId)

		if (bank) {
			throw new BadRequestException('Пользователь уже создал банк')
		}

		await this.bankRepository.create({
			...dto,
			users: { connect: { id: userId } },
		})

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
