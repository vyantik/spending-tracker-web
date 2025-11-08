import { BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Test, type TestingModule } from '@nestjs/testing'
import { hash } from 'argon2'
import type { Response } from 'express'

import type { IUsersRepository } from '../users/interfaces'
import { USERS_REPOSITORY_TOKEN } from '../users/tokens'

import { AuthService } from './auth.service'

describe('AuthService', () => {
	let service: AuthService
	let usersRepository: jest.Mocked<IUsersRepository>
	let mockJwtService: {
		signAsync: jest.Mock
		verifyAsync: jest.Mock
	}
	let mockConfigService: {
		getOrThrow: jest.Mock
	}
	let mockResponse: jest.Mocked<Response>

	beforeEach(async () => {
		mockResponse = {
			cookie: jest.fn(),
		} as unknown as jest.Mocked<Response>

		const mockUsersRepository = {
			exists: jest.fn(),
			createUser: jest.fn(),
			findByEmail: jest.fn(),
		}

		mockJwtService = {
			signAsync: jest.fn(),
			verifyAsync: jest.fn(),
		}

		mockConfigService = {
			getOrThrow: jest.fn((key: string) => {
				if (key === 'JWT_ACCESS_TOKEN_TTL') return '15m'
				if (key === 'JWT_REFRESH_TOKEN_TTL') return '7d'
				if (key === 'COOKIES_DOMAIN') return 'localhost'
				return ''
			}),
		}

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{
					provide: USERS_REPOSITORY_TOKEN,
					useValue: mockUsersRepository,
				},
				{
					provide: JwtService,
					useValue: mockJwtService as unknown as JwtService,
				},
				{
					provide: ConfigService,
					useValue: mockConfigService as unknown as ConfigService,
				},
			],
		}).compile()

		service = module.get<AuthService>(AuthService)
		usersRepository = module.get(USERS_REPOSITORY_TOKEN)
	})

	describe('register', () => {
		it('should throw BadRequestException if user already exists', async () => {
			usersRepository.exists.mockResolvedValue(true)

			await expect(
				service.register({
					username: 'testuser',
					email: 'test@example.com',
					password: 'password123',
					passwordRepeat: 'password123',
				}),
			).rejects.toThrow(BadRequestException)

			expect(usersRepository.exists).toHaveBeenCalledWith({
				OR: [{ email: 'test@example.com' }, { username: 'testuser' }],
			})
		})

		it('should create user successfully', async () => {
			usersRepository.exists.mockResolvedValue(false)
			usersRepository.createUser.mockResolvedValue({
				id: 'user-id',
				username: 'testuser',
				email: 'test@example.com',
				password: 'hashed-password',
				role: 'REGULAR',
				bankId: null,
				avatar: null,
				createdAt: new Date(),
				updatedAt: new Date(),
			})

			const result = await service.register({
				username: 'testuser',
				email: 'test@example.com',
				password: 'password123',
				passwordRepeat: 'password123',
			})

			expect(result).toEqual({
				message: 'Пользователь успешно зарегестрирован',
			})
			expect(usersRepository.createUser).toHaveBeenCalled()
			expect(
				usersRepository.createUser.mock.calls[0][0].password,
			).not.toBe('password123')
		})
	})

	describe('login', () => {
		it('should throw BadRequestException if user not found', async () => {
			usersRepository.findByEmail.mockResolvedValue(null)

			await expect(
				service.login(
					{
						email: 'test@example.com',
						password: 'password123',
					},
					mockResponse,
				),
			).rejects.toThrow(BadRequestException)
		})

		it('should throw BadRequestException if password is incorrect', async () => {
			const hashedPassword = await hash('correct-password')
			usersRepository.findByEmail.mockResolvedValue({
				id: 'user-id',
				username: 'testuser',
				email: 'test@example.com',
				password: hashedPassword,
				role: 'REGULAR',
				bankId: null,
				avatar: null,
				createdAt: new Date(),
				updatedAt: new Date(),
			})

			await expect(
				service.login(
					{
						email: 'test@example.com',
						password: 'wrong-password',
					},
					mockResponse,
				),
			).rejects.toThrow(BadRequestException)
		})

		it('should return access token on successful login', async () => {
			const hashedPassword = await hash('password123')
			const user = {
				id: 'user-id',
				username: 'testuser',
				email: 'test@example.com',
				password: hashedPassword,
				role: 'REGULAR' as const,
				bankId: null,
				avatar: null,
				createdAt: new Date(),
				updatedAt: new Date(),
			}

			usersRepository.findByEmail.mockResolvedValue(user)
			mockJwtService.signAsync.mockResolvedValue('access-token')

			const result = await service.login(
				{
					email: 'test@example.com',
					password: 'password123',
				},
				mockResponse,
			)

			expect(result).toHaveProperty('access_token')
			expect(mockResponse.cookie).toHaveBeenCalled()
		})
	})
})
