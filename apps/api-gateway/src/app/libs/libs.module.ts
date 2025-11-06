import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { getBullMQConfig } from '../config'

import { MailModule } from './mail/mail.module'

@Module({
	imports: [
		BullModule.forRootAsync({
			useFactory: getBullMQConfig,
			inject: [ConfigService],
		}),
		MailModule,
	],
})
export class LibsModule {}
