import { Module } from '@nestjs/common'

import { FilesModule } from '../../infra'

import { UsersController } from './users.controller'
import { UsersRepository } from './users.repository'
import { UsersService } from './users.service'

@Module({
	imports: [FilesModule],
	controllers: [UsersController],
	providers: [UsersService, UsersRepository],
	exports: [UsersRepository],
})
export class UsersModule {}
