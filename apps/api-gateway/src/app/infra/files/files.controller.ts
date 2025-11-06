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
		description: 'Avatar filename (e.g., userId.jpg)',
		type: 'string',
	})
	@ApiOkResponse({
		description: 'Avatar file',
		content: {
			'image/jpeg': {},
			'image/png': {},
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

		const extension = filename.split('.').pop()?.toLowerCase()
		let contentType = 'image/jpeg'

		switch (extension) {
			case 'png':
				contentType = 'image/png'
				break
			case 'webp':
				contentType = 'image/webp'
				break
			case 'jpg':
			case 'jpeg':
			default:
				contentType = 'image/jpeg'
				break
		}

		res.setHeader('Content-Type', contentType)
		res.setHeader('Content-Length', fileData.length)
		res.send(Buffer.from(fileData))
	}
}
