import { Module } from '@nestjs/common'

import { FilesModule } from './files'
import { PrismaModule } from './prisma'
import { RedisModule } from './redis'

@Module({
	imports: [PrismaModule, RedisModule, FilesModule],
})
export class InfraModule {}
