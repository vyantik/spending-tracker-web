import { Module } from '@nestjs/common'

import { FilesController } from './files.controller'
import { FilesRepository } from './files.repository'
import { FilesService } from './files.service'
import { FILES_REPOSITORY_TOKEN, FILES_SERVICE_TOKEN } from './tokens'

@Module({
	controllers: [FilesController],
	providers: [
		{
			provide: FILES_REPOSITORY_TOKEN,
			useClass: FilesRepository,
		},
		{
			provide: FILES_SERVICE_TOKEN,
			useClass: FilesService,
		},
		FilesRepository,
		FilesService,
	],
	exports: [FILES_SERVICE_TOKEN, FilesService],
})
export class FilesModule {}
