import { Module } from '@nestjs/common'

import { UsersModule } from '../../users/users.module'
import { BankRepository } from '../bank.repository'

import { InvitationsController } from './invitations.controller'
import { InvitationsRepository } from './invitations.repository'
import { InvitationsService } from './invitations.service'

@Module({
	imports: [UsersModule],
	controllers: [InvitationsController],
	providers: [InvitationsService, InvitationsRepository, BankRepository],
	exports: [InvitationsService],
})
export class InvitationsModule {}
