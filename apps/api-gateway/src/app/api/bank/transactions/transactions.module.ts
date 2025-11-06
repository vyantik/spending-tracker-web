import { Module } from '@nestjs/common'

import { FilesModule } from '../../../infra'

import { TransactionsController } from './transactions.controller'
import { TransactionsRepository } from './transactions.repository'
import { TransactionsService } from './transactions.service'

@Module({
	imports: [FilesModule],
	controllers: [TransactionsController],
	providers: [TransactionsService, TransactionsRepository],
	exports: [TransactionsService, TransactionsRepository],
})
export class TransactionsModule {}
