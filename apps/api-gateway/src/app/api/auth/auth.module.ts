import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { JwtStrategy } from '../../common'
import { getJwtConfig } from '../../config'
import { USERS_REPOSITORY_TOKEN } from '../users/tokens'
import { UsersRepository } from '../users/users.repository'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { OtpRepository } from './repositories/otp.repository'
import { OtpService } from './services/otp.service'
import { AUTH_SERVICE_TOKEN } from './tokens'
import { OTP_REPOSITORY_TOKEN } from './tokens'

@Module({
	imports: [
		PassportModule,
		JwtModule.registerAsync({
			useFactory: getJwtConfig,
			inject: [ConfigService],
		}),
	],
	controllers: [AuthController],
	providers: [
		{
			provide: AUTH_SERVICE_TOKEN,
			useClass: AuthService,
		},
		AuthService,
		{
			provide: USERS_REPOSITORY_TOKEN,
			useClass: UsersRepository,
		},
		UsersRepository,
		JwtStrategy,
		{
			provide: OTP_REPOSITORY_TOKEN,
			useClass: OtpRepository,
		},
		OtpRepository,
		OtpService,
	],
})
export class AuthModule {}
