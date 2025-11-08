import {
	BadRequestException,
	Inject,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import type { User } from '@prisma/client'
import { hash, verify } from 'argon2'
import type { Request, Response } from 'express'

import { IS_DEV_ENV, ms, type StringValue } from '../../common'
import type { IUsersRepository } from '../users/interfaces'
import { USERS_REPOSITORY_TOKEN } from '../users/tokens'

import {
	LoginRequest,
	LoginResponse,
	RegisterRequest,
	type RegisterResponse,
} from './dto'
import type { IAuthService } from './interfaces'
import type { JwtPayload } from './interfaces'

@Injectable()
export class AuthService implements IAuthService {
	private readonly ACCESS_TOKEN_TTL: StringValue
	private readonly REFRESH_TOKEN_TTL: StringValue
	private readonly COOKIES_DOMAIN: string

	public constructor(
		@Inject(USERS_REPOSITORY_TOKEN)
		private readonly usersRepo: IUsersRepository,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
	) {
		this.ACCESS_TOKEN_TTL = this.configService.getOrThrow<StringValue>(
			'JWT_ACCESS_TOKEN_TTL',
		)
		this.REFRESH_TOKEN_TTL = this.configService.getOrThrow<StringValue>(
			'JWT_REFRESH_TOKEN_TTL',
		)
		this.COOKIES_DOMAIN =
			this.configService.getOrThrow<string>('COOKIES_DOMAIN')
	}

	public async register({
		username,
		email,
		password,
	}: RegisterRequest): Promise<RegisterResponse> {
		const isUserExist = await this.usersRepo.exists({
			OR: [{ email }, { username }],
		})

		if (isUserExist) {
			throw new BadRequestException(
				'Пользователь с таким именем или почтой уже существует',
			)
		}

		const hashedPassword = await hash(password)

		await this.usersRepo.createUser({
			username,
			email,
			password: hashedPassword,
		})

		return { message: 'Пользователь успешно зарегестрирован' }
	}

	public async login(
		{ email, password }: LoginRequest,
		res: Response,
	): Promise<LoginResponse> {
		const user = await this.usersRepo.findByEmail(email)

		if (!user) {
			throw new BadRequestException('Неверный email или пароль')
		}

		if (!(await verify(user.password, password))) {
			throw new BadRequestException('Неверный email или пароль')
		}

		const access_token = await this.auth(res, user)

		return {
			access_token: access_token.accessToken,
		}
	}

	public logout(res: Response) {
		this.setCookies(res, 'refreshToken', new Date(0))
	}

	public async refresh(req: Request, res: Response): Promise<LoginResponse> {
		if (!req.cookies || !req.cookies['refreshToken']) {
			throw new UnauthorizedException('No token provided')
		}

		const refreshToken = req.cookies['refreshToken'] as string
		const payload =
			await this.jwtService.verifyAsync<JwtPayload>(refreshToken)

		if (payload) {
			const user = await this.usersRepo.findById(payload.id)

			if (user) {
				const accessToken = await this.auth(res, user)
				return {
					access_token: accessToken.accessToken,
				}
			} else {
				throw new UnauthorizedException('Invalid token')
			}
		} else {
			throw new UnauthorizedException('Invalid token')
		}
	}

	private async generateToken(user: User) {
		const payload: JwtPayload = {
			id: user.id,
		}

		const accessToken = await this.jwtService.signAsync(payload, {
			expiresIn: this.ACCESS_TOKEN_TTL,
		})
		const refreshToken = await this.jwtService.signAsync(payload, {
			expiresIn: this.REFRESH_TOKEN_TTL,
		})

		const refreshTokenExpires = new Date(
			Date.now() + ms(this.REFRESH_TOKEN_TTL),
		)

		return {
			accessToken,
			refreshToken,
			refreshTokenExpires: refreshTokenExpires,
		}
	}

	private setCookies(res: Response, value: string, expires: Date) {
		res.cookie('refreshToken', value, {
			httpOnly: true,
			domain: this.COOKIES_DOMAIN,
			expires,
			secure: !IS_DEV_ENV,
		})
	}

	private async auth(res: Response, user: User) {
		const { accessToken, refreshToken, refreshTokenExpires } =
			await this.generateToken(user)

		this.setCookies(res, refreshToken, refreshTokenExpires)

		return { accessToken }
	}
}
