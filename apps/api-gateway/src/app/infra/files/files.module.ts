import { Module } from '@nestjs/common'

import { FilesController } from './files.controller'
import { FilesService } from './files.service'
import { FILES_SERVICE_TOKEN } from './tokens'

@Module({
	controllers: [FilesController],
	providers: [
		{
			provide: FILES_SERVICE_TOKEN,
			useClass: FilesService,
		},
		FilesService,
	],
	exports: [FILES_SERVICE_TOKEN, FilesService],
})
export class FilesModule {}
