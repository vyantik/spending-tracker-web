import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { JwtStrategy } from '../../common'
import { getJwtConfig } from '../../config'
import { UsersRepository } from '../users/users.repository'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
	imports: [
		PassportModule,
		JwtModule.registerAsync({
			useFactory: getJwtConfig,
			inject: [ConfigService],
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, UsersRepository, JwtStrategy],
})
export class AuthModule {}
