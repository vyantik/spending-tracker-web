import { Module } from '@nestjs/common'

import { FilesModule } from '../../infra'

import { USERS_REPOSITORY_TOKEN, USERS_SERVICE_TOKEN } from './tokens'
import { UsersCleanupService } from './users-cleanup.service'
import { UsersController } from './users.controller'
import { UsersRepository } from './users.repository'
import { UsersService } from './users.service'

@Module({
	imports: [FilesModule],
	controllers: [UsersController],
	providers: [
		{
			provide: USERS_REPOSITORY_TOKEN,
			useClass: UsersRepository,
		},
		{
			provide: USERS_SERVICE_TOKEN,
			useClass: UsersService,
		},
		UsersRepository,
		UsersService,
		UsersCleanupService,
	],
	exports: [USERS_REPOSITORY_TOKEN, UsersRepository],
})
export class UsersModule {}
