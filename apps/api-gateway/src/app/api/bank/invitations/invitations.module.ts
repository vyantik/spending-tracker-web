import { Module } from '@nestjs/common'

import { UsersModule } from '../../users/users.module'
import { BankRepository } from '../bank.repository'
import { BANK_REPOSITORY_TOKEN } from '../tokens'

import { InvitationsController } from './invitations.controller'
import { InvitationsRepository } from './invitations.repository'
import { InvitationsService } from './invitations.service'
import {
	INVITATIONS_REPOSITORY_TOKEN,
	INVITATIONS_SERVICE_TOKEN,
} from './tokens'

@Module({
	imports: [UsersModule],
	controllers: [InvitationsController],
	providers: [
		{
			provide: INVITATIONS_REPOSITORY_TOKEN,
			useClass: InvitationsRepository,
		},
		{
			provide: INVITATIONS_SERVICE_TOKEN,
			useClass: InvitationsService,
		},
		{
			provide: BANK_REPOSITORY_TOKEN,
			useClass: BankRepository,
		},
		InvitationsRepository,
		InvitationsService,
		BankRepository,
	],
	exports: [INVITATIONS_SERVICE_TOKEN, InvitationsService],
})
export class InvitationsModule {}
