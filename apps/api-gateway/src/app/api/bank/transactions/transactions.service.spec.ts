import { BadRequestException } from '@nestjs/common'
import { Test, type TestingModule } from '@nestjs/testing'
import { Decimal } from '@prisma/client/runtime/library'

import type { IFilesService } from '../../../infra/files/interfaces'
import { FILES_SERVICE_TOKEN } from '../../../infra/files/tokens'

import type { ITransactionsRepository } from './interfaces'
import { TRANSACTIONS_REPOSITORY_TOKEN } from './tokens'
import { TransactionsService } from './transactions.service'

describe('TransactionsService', () => {
	let service: TransactionsService
	let transactionsRepository: jest.Mocked<ITransactionsRepository>
	let filesService: jest.Mocked<IFilesService>

	beforeEach(async () => {
		const mockTransactionsRepository = {
			getBankTransactions: jest.fn(),
			addTransaction: jest.fn(),
			updateTransaction: jest.fn(),
			getAllBankTransactions: jest.fn(),
			findUnique: jest.fn(),
			delete: jest.fn(),
		}

		const mockFilesService = {
			uploadAvatar: jest.fn(),
			getAvatarByFilename: jest.fn(),
			generateTransactionsExcel: jest.fn(),
		}

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TransactionsService,
				{
					provide: TRANSACTIONS_REPOSITORY_TOKEN,
					useValue: mockTransactionsRepository,
				},
				{
					provide: FILES_SERVICE_TOKEN,
					useValue: mockFilesService,
				},
			],
		}).compile()

		service = module.get<TransactionsService>(TransactionsService)
		transactionsRepository = module.get(TRANSACTIONS_REPOSITORY_TOKEN)
		filesService = module.get(FILES_SERVICE_TOKEN)
	})

	describe('addTransaction', () => {
		it('should throw BadRequestException if user has no bank', async () => {
			const user = {
				id: 'user-id',
				username: 'testuser',
				email: 'test@example.com',
				password: 'password',
				role: 'REGULAR' as const,
				bankId: null,
				avatar: null,
				createdAt: new Date(),
				updatedAt: new Date(),
			}

			await expect(
				service.addTransaction(
					{
						amount: 100,
						type: 'DEPOSIT',
						description: 'Test transaction',
						depositType: 'SALARY',
					},
					user,
				),
			).rejects.toThrow(BadRequestException)
		})

		it('should create transaction successfully', async () => {
			const user = {
				id: 'user-id',
				username: 'testuser',
				email: 'test@example.com',
				password: 'password',
				role: 'REGULAR' as const,
				bankId: 'bank-id',
				avatar: null,
				createdAt: new Date(),
				updatedAt: new Date(),
			}

			transactionsRepository.addTransaction.mockResolvedValue({
				id: 'transaction-id',
				amount: new Decimal(100),
				description: 'Test transaction',
				type: 'DEPOSIT',
				category: null,
				depositType: null,
				bankId: 'bank-id',
				userId: 'user-id',
				createdAt: new Date(),
				updatedAt: new Date(),
			})

			const result = await service.addTransaction(
				{
					amount: 100,
					type: 'DEPOSIT',
					description: 'Test transaction',
					depositType: 'SALARY',
				},
				user,
			)

			expect(result).toEqual({ message: 'ok' })
			expect(transactionsRepository.addTransaction).toHaveBeenCalledWith(
				'bank-id',
				'user-id',
				{
					amount: 100,
					type: 'DEPOSIT',
					description: 'Test transaction',
					depositType: 'SALARY',
				},
			)
		})
	})

	describe('getTransactions', () => {
		it('should throw BadRequestException if bankId is null', async () => {
			await expect(service.getTransactions(null)).rejects.toThrow(
				BadRequestException,
			)
		})

		it('should return transactions with pagination', async () => {
			const mockTransactions = [
				{
					id: 'transaction-id',
					amount: new Decimal(100),
					description: 'Test transaction',
					type: 'DEPOSIT' as const,
					category: null,
					depositType: null,
					bankId: 'bank-id',
					userId: 'user-id',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			]

			transactionsRepository.getBankTransactions.mockResolvedValue({
				transactions: mockTransactions,
				total: 1,
			})

			const result = await service.getTransactions('bank-id', 1, 10)

			expect(result).toHaveProperty('transactions')
			expect(result).toHaveProperty('total', 1)
			expect(result).toHaveProperty('page', 1)
			expect(result).toHaveProperty('limit', 10)
			expect(result).toHaveProperty('totalPages', 1)
		})
	})
})
