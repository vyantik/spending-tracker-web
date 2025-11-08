import { Module } from '@nestjs/common'

import { BankController } from './bank.controller'
import { BankRepository } from './bank.repository'
import { BankService } from './bank.service'
import { InvitationsModule } from './invitations'
import { TransactionsModule } from './transactions'

@Module({
	imports: [TransactionsModule, InvitationsModule],
	controllers: [BankController],
	providers: [BankService, BankRepository],
	exports: [BankRepository, BankService],
})
export class BankModule {}
