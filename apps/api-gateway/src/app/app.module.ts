import { FILES_PACKAGE_NAME } from '@hermes/types/proto/files'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { join } from 'path'

import { ApiModule } from './api/api.module'
import { InfraModule } from './infra/infra.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		ClientsModule.register([
			{
				name: FILES_PACKAGE_NAME,
				transport: Transport.GRPC,
				options: {
					package: FILES_PACKAGE_NAME,
					protoPath: join(__dirname, 'proto/files.proto'),
				},
			},
		]),
		ApiModule,
		InfraModule,
	],
})
export class AppModule {}
