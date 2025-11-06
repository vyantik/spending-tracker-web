import {
	BadRequestException,
	Injectable,
	Logger,
	NotFoundException,
} from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import sharp from 'sharp'

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
	 * Обработка изображения: обрезка до 500x500 и конвертация в WebP с качеством 80%
	 * @param fileData - Данные файла
	 * @returns Обработанные данные изображения в формате WebP
	 */
	private async processImage(fileData: Uint8Array): Promise<Uint8Array> {
		try {
			const processedImage = await sharp(fileData)
				.resize(500, 500, {
					fit: 'cover',
					position: 'center',
				})
				.webp({ quality: 80 })
				.toBuffer()

			return new Uint8Array(processedImage)
		} catch (error) {
			this.logger.error('Error processing image', error)
			throw new RpcException(
				new BadRequestException('Failed to process image'),
			)
		}
	}

	/**
	 * Загрузить аватар
	 * @param fileData - Данные файла
	 * @param oldFilename - Старое имя файла для удаления (опционально)
	 * @returns Имя сохраненного файла (UUID.webp)
	 */
	public async uploadAvatar(
		fileData: Uint8Array,
		oldFilename?: string,
	): Promise<string> {
		this.logger.log('Uploading avatar')

		this.validateFileSize(fileData)

		const extension = this.validateImageFormat(fileData)
		if (!extension) {
			throw new RpcException(
				new BadRequestException(
					`Unsupported image format. Supported formats: ${SUPPORTED_EXTENSIONS.join(', ')}`,
				),
			)
		}

		const processedImage = await this.processImage(fileData)

		const filename = await this.filesRepository.saveAvatar(
			processedImage,
			'webp',
			oldFilename,
		)

		this.logger.log(`Avatar uploaded successfully: ${filename}`)
		return filename
	}

	/**
	 * Получить аватар по имени файла
	 * @param filename - Имя файла (UUID.webp)
	 * @returns Данные файла
	 * @throws NotFoundException если файл не найден
	 */
	public async getAvatarByFilename(filename: string): Promise<Uint8Array> {
		this.logger.log(`Getting avatar by filename: ${filename}`)

		const fileData =
			await this.filesRepository.getAvatarByFilename(filename)

		if (!fileData) {
			throw new RpcException(
				new NotFoundException(`Avatar not found: ${filename}`),
			)
		}

		this.logger.log(`Avatar retrieved successfully: ${filename}`)
		return fileData
	}

	/**
	 * Удалить аватар по имени файла
	 * @param filename - Имя файла (UUID.webp)
	 * @returns true, если файл был удален
	 */
	public async deleteAvatarByFilename(filename: string): Promise<boolean> {
		this.logger.log(`Deleting avatar: ${filename}`)

		const deleted =
			await this.filesRepository.deleteAvatarByFilename(filename)

		if (deleted) {
			this.logger.log(`Avatar deleted successfully: ${filename}`)
		} else {
			this.logger.warn(`Avatar not found: ${filename}`)
		}

		return deleted
	}
}
