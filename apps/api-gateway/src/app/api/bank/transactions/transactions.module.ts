import { Module } from '@nestjs/common'

import { FilesModule } from '../../../infra'

import {
	TRANSACTIONS_REPOSITORY_TOKEN,
	TRANSACTIONS_SERVICE_TOKEN,
} from './tokens'
import { TransactionsController } from './transactions.controller'
import { TransactionsRepository } from './transactions.repository'
import { TransactionsService } from './transactions.service'

@Module({
	imports: [FilesModule],
	controllers: [TransactionsController],
	providers: [
		{
			provide: TRANSACTIONS_REPOSITORY_TOKEN,
			useClass: TransactionsRepository,
		},
		{
			provide: TRANSACTIONS_SERVICE_TOKEN,
			useClass: TransactionsService,
		},
		TransactionsRepository,
		TransactionsService,
	],
	exports: [
		TRANSACTIONS_REPOSITORY_TOKEN,
		TRANSACTIONS_SERVICE_TOKEN,
		TransactionsRepository,
		TransactionsService,
	],
})
export class TransactionsModule {}
