import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'

import { ApiModule } from './api/api.module'
import { ClientsGlobalModule } from './clients.module'
import { InfraModule } from './infra/infra.module'
import { LibsModule } from './libs/libs.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		ScheduleModule.forRoot(),
		ClientsGlobalModule,
		ApiModule,
		InfraModule,
		LibsModule,
	],
})
export class AppModule {}
