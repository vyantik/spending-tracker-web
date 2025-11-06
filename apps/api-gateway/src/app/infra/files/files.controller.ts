import {
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Req,
	Res,
} from '@nestjs/common'
import {
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
} from '@nestjs/swagger'
import { createHash } from 'crypto'
import type { Request, Response } from 'express'

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
		@Req() req: Request,
		@Res() res: Response,
	): Promise<void> {
		if (!filename || !filename.endsWith('.webp')) {
			res.status(400).send('Invalid filename')
			return
		}

		try {
			const fileData =
				await this.filesService.getAvatarByFilename(filename)

			const fileHash = createHash('md5')
				.update(Buffer.from(fileData))
				.digest('hex')
			const etag = `"${fileHash}"`

			const ifNoneMatch = req.headers['if-none-match']
			if (ifNoneMatch === etag) {
				res.status(304).end()
				return
			}

			res.setHeader('Content-Type', 'image/webp')
			res.setHeader('Content-Length', fileData.length)
			res.setHeader('ETag', etag)
			res.setHeader(
				'Cache-Control',
				'public, max-age=31536000, immutable',
			)
			res.setHeader('Last-Modified', new Date().toUTCString())

			res.send(Buffer.from(fileData))
		} catch (error) {
			res.status(404).send('Avatar not found')
		}
	}
}
