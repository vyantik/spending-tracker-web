import { Module } from '@nestjs/common'

import { FilesModule } from './files'

@Module({
	imports: [FilesModule],
})
export class AppModule {}
