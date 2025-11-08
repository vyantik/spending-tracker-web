import type { ProfileGetResponse } from '@hermes/contracts'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { User } from '@prisma/client'

import type { IFilesService } from '../../infra/files/interfaces'
import { FILES_SERVICE_TOKEN } from '../../infra/files/tokens'

import type { IUsersRepository, IUsersService } from './interfaces'
import { USERS_REPOSITORY_TOKEN } from './tokens'

@Injectable()
export class UsersService implements IUsersService {
	private readonly API_URL: string
	public constructor(
		@Inject(FILES_SERVICE_TOKEN)
		private readonly filesService: IFilesService,
		private readonly configService: ConfigService,
		@Inject(USERS_REPOSITORY_TOKEN)
		private readonly usersRepository: IUsersRepository,
	) {
		this.API_URL = this.configService.getOrThrow<string>('HTTP_HOST')
	}

	public async getMe(user: User): Promise<ProfileGetResponse> {
		return {
			username: user.username,
			email: user.email,
			avatar: user.avatar
				? `${this.API_URL}/api/v1/files/avatar/${user.avatar}`
				: null,
		}
	}

	public async uploadAvatar(user: User, file: Uint8Array): Promise<void> {
		const oldFilename = user.avatar || undefined
		const avatar = await this.filesService.uploadAvatar(file, oldFilename)
		await this.usersRepository.updateUser(user.id, { avatar })
	}
}
