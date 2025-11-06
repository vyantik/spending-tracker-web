import { Injectable, Logger } from '@nestjs/common'
import {
	existsSync,
	mkdirSync,
	readFileSync,
	unlinkSync,
	writeFileSync,
} from 'fs'
import { join } from 'path'

@Injectable()
export class FilesRepository {
	private readonly logger = new Logger(FilesRepository.name)
	private readonly uploadsDir: string

	public constructor() {
		this.uploadsDir = join(process.cwd(), 'uploads', 'avatars')
		this.ensureDirectoryExists()
	}

	/**
	 * Создать директорию для загрузок, если она не существует
	 */
	private ensureDirectoryExists(): void {
		if (!existsSync(this.uploadsDir)) {
			mkdirSync(this.uploadsDir, { recursive: true })
			this.logger.log(`Created uploads directory: ${this.uploadsDir}`)
		}
	}

	/**
	 * Сохранить файл аватара для пользователя
	 * @param userId - ID пользователя
	 * @param fileData - Данные файла (Uint8Array)
	 * @param extension - Расширение файла (например, 'jpg', 'png')
	 * @returns Имя сохраненного файла
	 */
	public async saveAvatar(
		userId: string,
		fileData: Uint8Array,
		extension: string,
	): Promise<string> {
		const filename = `${userId}.${extension}`
		const filePath = join(this.uploadsDir, filename)

		if (existsSync(filePath)) {
			unlinkSync(filePath)
			this.logger.log(`Deleted old avatar for user ${userId}`)
		}

		writeFileSync(filePath, Buffer.from(fileData))
		this.logger.log(`Saved avatar for user ${userId}: ${filename}`)

		return filename
	}

	/**
	 * Получить файл аватара пользователя
	 * @param userId - ID пользователя
	 * @returns Данные файла или null, если файл не найден
	 */
	public async getAvatar(userId: string): Promise<Uint8Array | null> {
		const extensions = ['jpg', 'jpeg', 'png', 'webp']

		for (const ext of extensions) {
			const filename = `${userId}.${ext}`
			const filePath = join(this.uploadsDir, filename)

			if (existsSync(filePath)) {
				const fileData = readFileSync(filePath)
				this.logger.log(`Found avatar for user ${userId}: ${filename}`)
				return new Uint8Array(fileData)
			}
		}

		this.logger.warn(`Avatar not found for user ${userId}`)
		return null
	}

	/**
	 * Удалить файл аватара пользователя
	 * @param userId - ID пользователя
	 * @returns true, если файл был удален, false если не найден
	 */
	public async deleteAvatar(userId: string): Promise<boolean> {
		const extensions = ['jpg', 'jpeg', 'png', 'webp']

		for (const ext of extensions) {
			const filename = `${userId}.${ext}`
			const filePath = join(this.uploadsDir, filename)

			if (existsSync(filePath)) {
				unlinkSync(filePath)
				this.logger.log(
					`Deleted avatar for user ${userId}: ${filename}`,
				)
				return true
			}
		}

		return false
	}

	/**
	 * Проверить существование файла аватара
	 * @param userId - ID пользователя
	 * @returns true, если файл существует
	 */
	public async avatarExists(userId: string): Promise<boolean> {
		const extensions = ['jpg', 'jpeg', 'png', 'webp']

		for (const ext of extensions) {
			const filename = `${userId}.${ext}`
			const filePath = join(this.uploadsDir, filename)

			if (existsSync(filePath)) {
				return true
			}
		}

		return false
	}
}
