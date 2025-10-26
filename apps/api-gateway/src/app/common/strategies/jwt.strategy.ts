import { Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { JwtPayload } from '../../api/auth/interfaces'
import { PrismaService } from '../../infra/prisma/prisma.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	public constructor(
		configService: ConfigService,
		private readonly prismaService: PrismaService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
			algorithms: ['HS256'],
		})
	}

	public async validate(payload: JwtPayload) {
		const user = await this.prismaService.user.findFirst({
			where: {
				id: payload.id,
			},
		})

		if (!user) throw new NotFoundException('User not found')

		return user
	}
}
