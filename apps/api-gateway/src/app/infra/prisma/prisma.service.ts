import {
	Injectable,
	Logger,
	OnModuleDestroy,
	OnModuleInit,
} from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy
{
	private readonly logger = new Logger(PrismaService.name)

	public async onModuleDestroy() {
		try {
			await this.$disconnect()
		} catch (err) {
			this.logger.error(
				`❌ Failed to disconnect from database: ${err.message}`,
			)
			throw err
		}
	}

	public async onModuleInit() {
		try {
			await this.$connect()
			this.logger.log('✅ Database connected')
		} catch (err) {
			this.logger.error(
				`❌ Failed to connect to database: ${err.message}`,
			)
			throw err
		}
	}
}
