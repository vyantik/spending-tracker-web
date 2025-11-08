import { Module } from '@nestjs/common'

import { BankController } from './bank.controller'
import { BankRepository } from './bank.repository'
import { BankService } from './bank.service'
import { InvitationsModule } from './invitations'
import { BANK_REPOSITORY_TOKEN, BANK_SERVICE_TOKEN } from './tokens'
import { TransactionsModule } from './transactions'

@Module({
	imports: [TransactionsModule, InvitationsModule],
	controllers: [BankController],
	providers: [
		{
			provide: BANK_REPOSITORY_TOKEN,
			useClass: BankRepository,
		},
		{
			provide: BANK_SERVICE_TOKEN,
			useClass: BankService,
		},
		BankRepository,
		BankService,
	],
	exports: [
		BANK_REPOSITORY_TOKEN,
		BANK_SERVICE_TOKEN,
		BankRepository,
		BankService,
	],
})
export class BankModule {}
