import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Req,
	Res,
} from '@nestjs/common'
import {
	ApiBadRequestResponse,
	ApiBody,
	ApiCreatedResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from '@nestjs/swagger'
import type { Request, Response } from 'express'

import { AuthService } from './auth.service'
import {
	LoginRequest,
	LoginResponse,
	RegisterRequest,
	RegisterResponse,
	VerifyOtpRequest,
	VerifyOtpResponse,
} from './dto'

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
	public constructor(private readonly authService: AuthService) {}

	@ApiOperation({ summary: 'Register user' })
	@ApiBody({ type: RegisterRequest })
	@ApiCreatedResponse({ type: RegisterResponse })
	@ApiBadRequestResponse({
		example: {
			message: 'Пользователь с таким именем или почтой уже существует',
			error: 'Bad Request',
			statusCode: 400,
		},
	})
	@HttpCode(HttpStatus.CREATED)
	@Post('register')
	public async register(
		@Body() dto: RegisterRequest,
	): Promise<RegisterResponse> {
		return await this.authService.register(dto)
	}

	@ApiOperation({ summary: 'Login user' })
	@ApiBody({ type: LoginRequest })
	@ApiOkResponse({ type: LoginResponse })
	@ApiBadRequestResponse({
		example: {
			message: 'Неверный email или пароль',
			error: 'Bad Request',
			statusCode: 400,
		},
	})
	@HttpCode(HttpStatus.OK)
	@Post('login')
	public async login(
		@Body() dto: LoginRequest,
		@Res({ passthrough: true }) res: Response,
	): Promise<LoginResponse> {
		return await this.authService.login(dto, res)
	}

	@ApiOperation({ summary: 'Logout user' })
	@HttpCode(HttpStatus.NO_CONTENT)
	@Post('logout')
	public logout(@Res({ passthrough: true }) res: Response): void {
		return this.authService.logout(res)
	}

	@ApiOperation({ summary: 'Refresh user' })
	@ApiOkResponse({ type: LoginResponse })
	@HttpCode(HttpStatus.OK)
	@Post('refresh')
	public async refresh(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
	): Promise<LoginResponse> {
		return await this.authService.refresh(req, res)
	}

	@ApiOperation({ summary: 'Verify OTP' })
	@ApiBody({ type: VerifyOtpRequest })
	@ApiOkResponse({ type: VerifyOtpResponse })
	@ApiBadRequestResponse({
		example: {
			message: 'Неверный код верификации',
			error: 'Bad Request',
			statusCode: 400,
		},
	})
	@HttpCode(HttpStatus.OK)
	@Post('verify-otp')
	public async verifyOtp(
		@Body() dto: VerifyOtpRequest,
	): Promise<VerifyOtpResponse> {
		return await this.authService.verifyOtp(dto)
	}
}
