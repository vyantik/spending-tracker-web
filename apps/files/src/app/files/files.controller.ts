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
	 * Загрузить аватар пользователя
	 * user_id должен быть передан в метаданных gRPC запроса
	 */
	public async uploadAvatar(
		request: UploadAvatarRequest,
	): Promise<UploadAvatarResponse> {
		const userId = request.userId

		if (!userId) {
			throw new Error('user_id is required in metadata')
		}

		const filename = await this.filesService.uploadAvatar(
			userId,
			request.file,
		)

		return {
			filename,
		}
	}

	/**
	 * Получить аватар пользователя
	 */
	public async getAvatar(
		request: GetAvatarRequest,
	): Promise<GetAvatarResponse> {
		const fileData = await this.filesService.getAvatar(request.userId)

		return {
			file: fileData,
		}
	}
}
