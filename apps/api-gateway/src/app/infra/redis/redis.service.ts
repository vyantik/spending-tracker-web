import {
	Injectable,
	Logger,
	OnModuleDestroy,
	OnModuleInit,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Redis from 'ioredis'

import { getRedisConfig } from '../../config'

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
	private readonly logger = new Logger(RedisService.name)
	private redis: Redis

	public constructor(private readonly configService: ConfigService) {}

	onModuleInit() {
		this.redis = new Redis({ ...getRedisConfig(this.configService) })

		this.redis.on('error', err => {
			this.logger.error('❌ Redis connection failed')
			throw err
		})

		this.logger.log('✅ Redis connected')
	}

	onModuleDestroy() {
		throw new Error('Method not implemented.')
	}

	public async set(key: string, value: string, ttl?: number): Promise<'OK'> {
		if (ttl) {
			return this.redis.set(key, value, 'EX', ttl)
		}
		return this.redis.set(key, value)
	}

	public async get(key: string): Promise<string | null> {
		return this.redis.get(key)
	}

	public async del(key: string): Promise<number> {
		return this.redis.del(key)
	}

	public async exists(key: string): Promise<number> {
		return this.redis.exists(key)
	}

	public async getKeys(pattern: string): Promise<string[]> {
		return this.redis.keys(pattern)
	}
}
