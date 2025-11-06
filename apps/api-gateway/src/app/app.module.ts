import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { ApiModule } from './api/api.module'
import { ClientsGlobalModule } from './clients.module'
import { InfraModule } from './infra/infra.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		ClientsGlobalModule,
		ApiModule,
		InfraModule,
	],
})
export class AppModule {}
