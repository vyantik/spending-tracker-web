import {
	FILES_PACKAGE_NAME,
	FILES_SERVICE_NAME,
	FilesServiceClient,
	GetAvatarRequest,
	GetAvatarResponse,
	UploadAvatarRequest,
	UploadAvatarResponse,
} from '@hermes/types/proto/files'
import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'

@Injectable()
export class FilesService implements OnModuleInit {
	private filesService: FilesServiceClient

	public constructor(
		@Inject(FILES_PACKAGE_NAME) private readonly filesClient: ClientGrpc,
	) {}

	onModuleInit() {
		this.filesService =
			this.filesClient.getService<FilesServiceClient>(FILES_SERVICE_NAME)
	}

	/**
	 * Загрузить аватар пользователя
	 * @param userId - ID пользователя
	 * @param fileData - Данные файла
	 * @returns Имя сохраненного файла
	 */
	public async uploadAvatar(
		userId: string,
		fileData: Uint8Array,
	): Promise<string> {
		const request: UploadAvatarRequest = {
			userId,
			file: fileData,
		}

		const response: UploadAvatarResponse = await firstValueFrom(
			this.filesService.uploadAvatar(request),
		)

		return response.filename
	}

	/**
	 * Получить аватар пользователя
	 * @param userId - ID пользователя
	 * @returns Данные файла
	 */
	public async getAvatar(userId: string): Promise<Uint8Array> {
		const request: GetAvatarRequest = {
			userId,
		}

		const response: GetAvatarResponse = await firstValueFrom(
			this.filesService.getAvatar(request),
		)

		return response.file
	}
}
