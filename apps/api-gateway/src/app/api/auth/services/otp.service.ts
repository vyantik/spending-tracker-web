import { BadRequestException, Inject, Injectable } from '@nestjs/common'

import { MailService } from '../../../libs/mail/mail.service'
import type { IOtpRepository } from '../interfaces'
import { OTP_REPOSITORY_TOKEN } from '../tokens'

@Injectable()
export class OtpService {
	private readonly OTP_EXPIRATION_SECONDS = 600 // 10 минут
	private readonly OTP_LENGTH = 6

	public constructor(
		@Inject(OTP_REPOSITORY_TOKEN)
		private readonly otpRepository: IOtpRepository,
		private readonly mailService: MailService,
	) {}

	public async generateAndSendOtp(email: string): Promise<string> {
		await this.otpRepository.deleteByEmail(email)

		const code = this.generateOtpCode()

		await this.otpRepository.createOtp(
			email,
			code,
			this.OTP_EXPIRATION_SECONDS,
		)

		await this.mailService.sendEmailVerification(email, code)

		return code
	}

	public async verifyOtp(email: string, code: string): Promise<void> {
		const storedCode = await this.otpRepository.findByEmailAndCode(
			email,
			code,
		)

		if (!storedCode || storedCode !== code) {
			throw new BadRequestException('Неверный код верификации')
		}

		await this.otpRepository.deleteOtp(email, code)
	}

	private generateOtpCode(): string {
		const digits = '0123456789'
		let code = ''
		for (let i = 0; i < this.OTP_LENGTH; i++) {
			code += digits.charAt(Math.floor(Math.random() * digits.length))
		}
		return code
	}
}
