import { BadRequestException } from '@nestjs/common'
import { Test, type TestingModule } from '@nestjs/testing'

import { BankService } from './bank.service'
import type { IBankRepository } from './interfaces'
import { BANK_REPOSITORY_TOKEN } from './tokens'

describe('BankService', () => {
	let service: BankService
	let bankRepository: jest.Mocked<IBankRepository>

	beforeEach(async () => {
		const mockBankRepository = {
			findByUserId: jest.fn(),
			findUnique: jest.fn(),
			create: jest.fn(),
			update: jest.fn(),
			delete: jest.fn(),
		}

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				BankService,
				{
					provide: BANK_REPOSITORY_TOKEN,
					useValue: mockBankRepository,
				},
			],
		}).compile()

		service = module.get<BankService>(BankService)
		bankRepository = module.get(BANK_REPOSITORY_TOKEN)
	})

	describe('create', () => {
		it('should throw BadRequestException if user already has a bank', async () => {
			bankRepository.findByUserId.mockResolvedValue({
				id: 'bank-id',
				name: 'Existing Bank',
				description: '',
				createdAt: new Date(),
				updatedAt: new Date(),
			})

			await expect(
				service.create('user-id', {
					name: 'New Bank',
					description: 'Test bank',
				}),
			).rejects.toThrow(BadRequestException)

			expect(bankRepository.findByUserId).toHaveBeenCalledWith('user-id')
		})

		it('should create bank successfully', async () => {
			bankRepository.findByUserId.mockResolvedValue(null)
			bankRepository.create.mockResolvedValue({
				id: 'bank-id',
				name: 'New Bank',
				description: 'Test bank',
				createdAt: new Date(),
				updatedAt: new Date(),
			})

			const result = await service.create('user-id', {
				name: 'New Bank',
				description: 'Test bank',
			})

			expect(result).toEqual({ message: 'ok' })
			expect(bankRepository.create).toHaveBeenCalledWith({
				name: 'New Bank',
				description: 'Test bank',
				users: { connect: { id: 'user-id' } },
			})
		})
	})

	describe('get', () => {
		it('should throw BadRequestException if bank not found', async () => {
			bankRepository.findByUserId.mockResolvedValue(null)

			await expect(service.get('user-id')).rejects.toThrow(
				BadRequestException,
			)
		})

		it('should return bank if found', async () => {
			const bank = {
				id: 'bank-id',
				name: 'Test Bank',
				description: 'Test description',
				createdAt: new Date(),
				updatedAt: new Date(),
			}

			bankRepository.findByUserId.mockResolvedValue(bank)

			const result = await service.get('user-id')

			expect(result).toEqual(bank)
		})
	})
})
