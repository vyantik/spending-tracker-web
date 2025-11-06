import type { ProfileGetResponse } from '@hermes/contracts'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { User } from '@prisma/client'

import { FilesService } from '../../infra'

import { UsersRepository } from './users.repository'

@Injectable()
export class UsersService {
	private readonly API_URL: string
	public constructor(
		private readonly filesService: FilesService,
		private readonly configService: ConfigService,
		private readonly usersRepository: UsersRepository,
	) {
		this.API_URL = this.configService.getOrThrow<string>('HTTP_HOST')
	}

	public async getMe(user: User): Promise<ProfileGetResponse> {
		return {
			username: user.username,
			email: user.email,
			avatar: user.avatar
				? `${this.API_URL}/files/avatar/${user.avatar}`
				: null,
		}
	}

	public async uploadAvatar(user: User, file: Uint8Array): Promise<void> {
		const avatar = await this.filesService.uploadAvatar(user.id, file)
		await this.usersRepository.updateUser(user.id, { avatar })
	}
}
