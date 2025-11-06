import {
	FilesServiceController,
	FilesServiceControllerMethods,
	GetAvatarRequest,
	GetAvatarResponse,
	UploadAvatarRequest,
	UploadAvatarResponse,
} from '@hermes/types/proto/files'
import { Controller } from '@nestjs/common'

import { FilesService } from './files.service'

@Controller()
@FilesServiceControllerMethods()
export class FilesController implements FilesServiceController {
	public constructor(private readonly filesService: FilesService) {}

	/**
	 * Загрузить аватар
	 */
	public async uploadAvatar(
		request: UploadAvatarRequest,
	): Promise<UploadAvatarResponse> {
		const oldFilename = request.oldFilename
		const filename = await this.filesService.uploadAvatar(
			request.file,
			oldFilename,
		)

		return {
			filename,
		}
	}

	/**
	 * Получить аватар по имени файла
	 */
	public async getAvatar(
		request: GetAvatarRequest,
	): Promise<GetAvatarResponse> {
		const fileData = await this.filesService.getAvatarByFilename(
			request.filename,
		)

		return {
			file: fileData,
		}
	}
}
