import type { ProfileGetResponse } from '@hermes/contracts'
import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import type { User } from '@prisma/client'

import { Authorized, Protected } from '../../common'

import { UsersService } from './users.service'

@ApiTags('User features')
@Controller('users')
export class UsersController {
	public constructor(private readonly usersService: UsersService) {}

	@Protected()
	@HttpCode(HttpStatus.OK)
	@Get('@me')
	public getMe(@Authorized() user: User): ProfileGetResponse {
		return user
	}
}
