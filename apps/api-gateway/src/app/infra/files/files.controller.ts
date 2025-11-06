import {
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Res,
} from '@nestjs/common'
import {
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
} from '@nestjs/swagger'
import type { Response } from 'express'

import { FilesService } from './files.service'

@ApiTags('Files')
@Controller('files')
export class FilesController {
	public constructor(private readonly filesService: FilesService) {}

	@Get('avatar/:filename')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Get user avatar by filename' })
	@ApiParam({
		name: 'filename',
		description: 'Avatar filename (e.g., userId.webp)',
		type: 'string',
	})
	@ApiOkResponse({
		description: 'Avatar file',
		content: {
			'image/webp': {},
		},
	})
	@ApiNotFoundResponse({ description: 'Avatar not found' })
	public async getAvatar(
		@Param('filename') filename: string,
		@Res() res: Response,
	): Promise<void> {
		const userId = filename.replace(/\.[^.]+$/, '')

		const fileData = await this.filesService.getAvatar(userId)

		res.setHeader('Content-Type', 'image/webp')
		res.setHeader('Content-Length', fileData.length)
		res.send(Buffer.from(fileData))
	}
}
