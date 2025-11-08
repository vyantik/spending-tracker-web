import { Injectable } from '@nestjs/common'

import { RedisService } from '../../../infra/redis/redis.service'
import type { IOtpRepository } from '../interfaces'

@Injectable()
export class OtpRepository implements IOtpRepository {
	private readonly OTP_KEY_PREFIX = 'otp:'

	public constructor(private readonly redisService: RedisService) {}

	private getKey(email: string, code: string): string {
		return `${this.OTP_KEY_PREFIX}${email}:${code}`
	}

	private getEmailKey(email: string): string {
		return `${this.OTP_KEY_PREFIX}${email}:*`
	}

	public async findByEmailAndCode(
		email: string,
		code: string,
	): Promise<string | null> {
		const key = this.getKey(email, code)
		return await this.redisService.get(key)
	}

	public async findValidByEmail(email: string): Promise<string | null> {
		const pattern = this.getEmailKey(email)
		const keys = await this.redisService.getKeys(pattern)

		if (keys.length === 0) {
			return null
		}

		const firstKey = keys[0]
		const parts = firstKey.split(':')
		if (parts.length === 3) {
			return parts[2]
		}
		return null
	}

	public async createOtp(
		email: string,
		code: string,
		ttl: number,
	): Promise<void> {
		const key = this.getKey(email, code)
		await this.redisService.set(key, code, ttl)
	}

	public async deleteOtp(email: string, code: string): Promise<void> {
		const key = this.getKey(email, code)
		await this.redisService.del(key)
	}

	public async deleteByEmail(email: string): Promise<void> {
		const pattern = this.getEmailKey(email)
		const keys = await this.redisService.getKeys(pattern)

		if (keys.length > 0) {
			await Promise.all(keys.map(key => this.redisService.del(key)))
		}
	}
}
