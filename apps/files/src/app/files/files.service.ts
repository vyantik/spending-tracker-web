import {
	BadRequestException,
	Injectable,
	Logger,
	NotFoundException,
} from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'

import { FilesRepository } from './files.repository'

/**
 * Поддерживаемые форматы изображений
 */
const SUPPORTED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp']

/**
 * Максимальный размер файла (5MB)
 */
const MAX_FILE_SIZE = 5 * 1024 * 1024

@Injectable()
export class FilesService {
	private readonly logger = new Logger(FilesService.name)

	public constructor(private readonly filesRepository: FilesRepository) {}

	/**
	 * Валидация формата изображения по магическим байтам
	 * @param fileData - Данные файла
	 * @returns Расширение файла или null, если формат не поддерживается
	 */
	private validateImageFormat(fileData: Uint8Array): string | null {
		if (fileData.length < 4) {
			return null
		}

		// JPEG: FF D8 FF
		if (
			fileData[0] === 0xff &&
			fileData[1] === 0xd8 &&
			fileData[2] === 0xff
		) {
			return 'jpg'
		}

		// PNG: 89 50 4E 47
		if (
			fileData[0] === 0x89 &&
			fileData[1] === 0x50 &&
			fileData[2] === 0x4e &&
			fileData[3] === 0x47
		) {
			return 'png'
		}

		// WebP: RIFF...WEBP
		if (fileData.length >= 12) {
			const riff = String.fromCharCode(...fileData.slice(0, 4))
			const webp = String.fromCharCode(...fileData.slice(8, 12))
			if (riff === 'RIFF' && webp === 'WEBP') {
				return 'webp'
			}
		}

		return null
	}

	/**
	 * Валидация размера файла
	 * @param fileData - Данные файла
	 * @throws BadRequestException если файл слишком большой
	 */
	private validateFileSize(fileData: Uint8Array): void {
		if (fileData.length > MAX_FILE_SIZE) {
			throw new RpcException(
				new BadRequestException(
					`File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
				),
			)
		}

		if (fileData.length === 0) {
			throw new RpcException(new BadRequestException('File is empty'))
		}
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
		this.logger.log(`Uploading avatar for user ${userId}`)

		this.validateFileSize(fileData)

		const extension = this.validateImageFormat(fileData)
		if (!extension) {
			throw new RpcException(
				new BadRequestException(
					`Unsupported image format. Supported formats: ${SUPPORTED_EXTENSIONS.join(', ')}`,
				),
			)
		}

		const filename = await this.filesRepository.saveAvatar(
			userId,
			fileData,
			extension,
		)

		this.logger.log(
			`Avatar uploaded successfully for user ${userId}: ${filename}`,
		)
		return filename
	}

	/**
	 * Получить аватар пользователя
	 * @param userId - ID пользователя
	 * @returns Данные файла
	 * @throws NotFoundException если файл не найден
	 */
	public async getAvatar(userId: string): Promise<Uint8Array> {
		this.logger.log(`Getting avatar for user ${userId}`)

		const fileData = await this.filesRepository.getAvatar(userId)

		if (!fileData) {
			throw new RpcException(
				new NotFoundException(`Avatar not found for user ${userId}`),
			)
		}

		this.logger.log(`Avatar retrieved successfully for user ${userId}`)
		return fileData
	}

	/**
	 * Удалить аватар пользователя
	 * @param userId - ID пользователя
	 * @returns true, если файл был удален
	 */
	public async deleteAvatar(userId: string): Promise<boolean> {
		this.logger.log(`Deleting avatar for user ${userId}`)

		const deleted = await this.filesRepository.deleteAvatar(userId)

		if (deleted) {
			this.logger.log(`Avatar deleted successfully for user ${userId}`)
		} else {
			this.logger.warn(`Avatar not found for user ${userId}`)
		}

		return deleted
	}
}
