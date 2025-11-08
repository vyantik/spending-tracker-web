import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Injectable, Logger } from '@nestjs/common'
import type { Job } from 'bullmq'

import { MailService } from './mail.service'

export type MailJob = {
	email: string
	subject: string
	html: string
}

@Processor('mail')
@Injectable()
export class MailProcessor extends WorkerHost {
	private readonly logger = new Logger(MailProcessor.name)

	public constructor(private readonly mailService: MailService) {
		super()
	}

	public async process(job: Job<MailJob>) {
		const { email, subject, html } = job.data

		try {
			this.logger.log(`⏳ Sending mail to ${email}`)
			await this.mailService.sendMail({
				to: email,
				subject,
				html,
			})
			this.logger.log(`✅ Mail sent to ${email}`)
		} catch (error) {
			this.logger.error(
				`❌ Failed to send mail to ${email}: ${error.message}`,
			)
		}
	}
}
