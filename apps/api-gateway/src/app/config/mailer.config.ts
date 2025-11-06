import { MailerOptions } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'

export function getMailerConfig(config: ConfigService): MailerOptions {
	return {
		transport: {
			host: config.getOrThrow<string>('MAIL_HOST'),
			port: config.getOrThrow<number>('MAIL_PORT'),
			auth: {
				user: config.getOrThrow<string>('MAIL_LOGIN'),
				pass: config.getOrThrow<string>('MAIL_PASSWORD'),
			},
		},
		defaults: {
			from: `"Payment Service" <${config.getOrThrow<string>('MAIL_LOGIN')}>`,
		},
	}
}
