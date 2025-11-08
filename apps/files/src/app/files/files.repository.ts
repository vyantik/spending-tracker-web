import { Injectable, Logger } from '@nestjs/common'
import { randomUUID } from 'crypto'
import {
	existsSync,
	mkdirSync,
	readFileSync,
	unlinkSync,
	writeFileSync,
} from 'fs'
import { join } from 'path'

import type { IFilesRepository } from './interfaces'

@Injectable()
export class FilesRepository implements IFilesRepository {
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
	 * Сохранить файл аватара
	 * @param fileData - Данные файла (Uint8Array)
	 * @param extension - Расширение файла (например, 'jpg', 'png')
	 * @param oldFilename - Старое имя файла для удаления (опционально)
	 * @returns Имя сохраненного файла (UUID.extension)
	 */
	public async saveAvatar(
		fileData: Uint8Array,
		extension: string,
		oldFilename?: string,
	): Promise<string> {
		const uuid = randomUUID()
		const filename = `${uuid}.${extension}`
		const filePath = join(this.uploadsDir, filename)

		if (oldFilename) {
			const oldFilePath = join(this.uploadsDir, oldFilename)
			if (existsSync(oldFilePath)) {
				unlinkSync(oldFilePath)
				this.logger.log(`Deleted old avatar: ${oldFilename}`)
			}
		}

		writeFileSync(filePath, Buffer.from(fileData))
		this.logger.log(`Saved avatar: ${filename}`)

		return filename
	}

	/**
	 * Получить файл аватара по имени файла
	 * @param filename - Имя файла (UUID.webp)
	 * @returns Данные файла или null, если файл не найден
	 */
	public async getAvatarByFilename(
		filename: string,
	): Promise<Uint8Array | null> {
		const filePath = join(this.uploadsDir, filename)

		this.logger.log(
			`Looking for avatar: filename=${filename}, path=${filePath}`,
		)

		if (existsSync(filePath)) {
			const fileData = readFileSync(filePath)
			this.logger.log(`Found avatar: ${filename}`)
			return new Uint8Array(fileData)
		}

		this.logger.warn(`Avatar not found at path: ${filePath}`)
		return null
	}

	/**
	 * Удалить файл аватара по имени файла
	 * @param filename - Имя файла (UUID.webp)
	 * @returns true, если файл был удален, false если не найден
	 */
	public async deleteAvatarByFilename(filename: string): Promise<boolean> {
		const filePath = join(this.uploadsDir, filename)

		if (existsSync(filePath)) {
			unlinkSync(filePath)
			this.logger.log(`Deleted avatar: ${filename}`)
			return true
		}

		return false
	}

	/**
	 * Проверить существование файла аватара по имени файла
	 * @param filename - Имя файла (UUID.webp)
	 * @returns true, если файл существует
	 */
	public async avatarExistsByFilename(filename: string): Promise<boolean> {
		const filePath = join(this.uploadsDir, filename)

		return existsSync(filePath)
	}
}
