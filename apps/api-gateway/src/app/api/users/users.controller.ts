import type { ProfileGetResponse } from '@hermes/contracts'
import {
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import {
	ApiBody,
	ApiConsumes,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from '@nestjs/swagger'
import type { User } from '@prisma/client'

import { Authorized, Protected } from '../../common'

import { UsersService } from './users.service'

@ApiTags('User features')
@Controller('users')
export class UsersController {
	public constructor(private readonly usersService: UsersService) {}

	@Protected()
	@HttpCode(HttpStatus.OK)
	@Get('@me')
	public async getMe(@Authorized() user: User): Promise<ProfileGetResponse> {
		return await this.usersService.getMe(user)
	}

	@Protected()
	@Post('@me/avatar')
	@HttpCode(HttpStatus.OK)
	@UseInterceptors(FileInterceptor('file'))
	@ApiOperation({ summary: 'Upload user avatar' })
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				file: {
					type: 'string',
					format: 'binary',
				},
			},
		},
	})
	@ApiOkResponse({ description: 'Avatar uploaded successfully' })
	public async uploadAvatar(
		@Authorized() user: User,
		@UploadedFile()
		file: { buffer: Buffer; mimetype: string; size: number },
	): Promise<{ message: string }> {
		if (!file) {
			throw new Error('File is required')
		}

		await this.usersService.uploadAvatar(user, new Uint8Array(file.buffer))

		return { message: 'ok' }
	}
}
