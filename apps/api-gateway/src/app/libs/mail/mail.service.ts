import { type ISendMailOptions, MailerService } from '@nestjs-modules/mailer'
import { InjectQueue } from '@nestjs/bullmq'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { render } from '@react-email/components'
import { Queue } from 'bullmq'

import { EmailVerificationTemplate } from './templates'

@Injectable()
export class MailService {
	private readonly logger = new Logger(MailService.name)

	private readonly APP_URL: string

	public constructor(
		private readonly mailerService: MailerService,
		@InjectQueue('mail') private readonly mailQueue: Queue,
		configService: ConfigService,
	) {
		this.APP_URL = configService.getOrThrow<string>('HTTP_CORS')
	}

	public async sendEmailVerification(email: string, otpCode: string) {
		const html = await render(EmailVerificationTemplate({ otpCode }))
		this.logger.log(`📧 Sending email verification mail to ${email}`)

		await this.mailQueue.add(
			'send-mail',
			{
				email,
				subject: 'Email verification',
				html,
			},
			{
				removeOnComplete: true,
			},
		)
	}

	public async sendMail(options: ISendMailOptions) {
		try {
			await this.mailerService.sendMail(options)
		} catch (error) {
			this.logger.error(`Failed to send mail: `, error)
			throw error
		}
	}
}
