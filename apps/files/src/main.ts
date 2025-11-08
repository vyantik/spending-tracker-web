import { FILES_PACKAGE_NAME } from '@hermes/types/proto/files'
import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { type MicroserviceOptions, Transport } from '@nestjs/microservices'
import { join } from 'path'

import { AppModule } from './app/app.module'

async function bootstrap() {
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(
		AppModule,
		{
			transport: Transport.GRPC,
			options: {
				package: FILES_PACKAGE_NAME,
				protoPath: join(__dirname, 'proto/files.proto'),
			},
		},
	)
	await app.listen()

	Logger.log(`🚀 Files Microservice started`)
}

bootstrap()
