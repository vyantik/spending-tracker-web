import { Module } from '@nestjs/common'

import { AuthModule } from './auth'
import { BankModule } from './bank'
import { UsersModule } from './users'

@Module({
	imports: [AuthModule, UsersModule, BankModule],
})
export class ApiModule {}
