import { FILES_PACKAGE_NAME } from '@hermes/types/proto/files'
import { Global, Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { join } from 'path'

@Global()
@Module({
	imports: [
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
	],
	exports: [ClientsModule],
})
export class ClientsGlobalModule {}
