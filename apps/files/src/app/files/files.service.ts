import {
	BadRequestException,
	Inject,
	Injectable,
	Logger,
	NotFoundException,
} from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import ExcelJS from 'exceljs'
import sharp from 'sharp'

import type { IFilesRepository, IFilesService } from './interfaces'
import { FILES_REPOSITORY_TOKEN } from './tokens'

/**
 * Поддерживаемые форматы изображений
 */
const SUPPORTED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp']

/**
 * Максимальный размер файла (5MB)
 */
const MAX_FILE_SIZE = 5 * 1024 * 1024

@Injectable()
export class FilesService implements IFilesService {
	private readonly logger = new Logger(FilesService.name)

	public constructor(
		@Inject(FILES_REPOSITORY_TOKEN)
		private readonly filesRepository: IFilesRepository,
	) {}

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

	/**
	 * Генерация Excel файла со статистикой транзакций
	 * @param transactions - Массив транзакций
	 * @param bankId - ID банка
	 * @returns Данные Excel файла и имя файла
	 */
	public async generateTransactionsExcel(
		transactions: Array<{
			id: string
			amount: number
			description: string
			type: string
			category?: string | null
			depositType?: string | null
			createdAt: number
		}>,
		bankId: string,
	): Promise<{ file: Uint8Array; filename: string }> {
		this.logger.log(`Generating Excel file for bank: ${bankId}`)

		try {
			const workbook = new ExcelJS.Workbook()
			const worksheet = workbook.addWorksheet('Статистика транзакций')

			worksheet.columns = [
				{ header: 'Показатель', key: 'indicator', width: 30 },
				{ header: 'Значение', key: 'value', width: 20 },
			]

			const totalDeposit = transactions
				.filter(t => t.type === 'DEPOSIT')
				.reduce((sum, t) => sum + t.amount, 0)
			const totalWithdraw = transactions
				.filter(t => t.type === 'WITHDRAW')
				.reduce((sum, t) => sum + t.amount, 0)
			const balance = totalDeposit - totalWithdraw

			const categoryStats = transactions.reduce(
				(acc, t) => {
					if (t.type === 'WITHDRAW' && t.category) {
						if (!acc[t.category]) {
							acc[t.category] = { amount: 0, count: 0 }
						}
						acc[t.category].amount += t.amount
						acc[t.category].count += 1
					} else if (t.type === 'DEPOSIT' && t.depositType) {
						const key = `DEPOSIT_${t.depositType}`
						if (!acc[key]) {
							acc[key] = { amount: 0, count: 0 }
						}
						acc[key].amount += t.amount
						acc[key].count += 1
					}
					return acc
				},
				{} as Record<string, { amount: number; count: number }>,
			)

			worksheet.addRow({
				indicator: 'Общие пополнения',
				value: totalDeposit,
			})
			worksheet.addRow({
				indicator: 'Общие снятия',
				value: totalWithdraw,
			})
			worksheet.addRow({ indicator: 'Баланс', value: balance })
			worksheet.addRow({})

			worksheet.addRow({
				indicator: 'Распределение по категориям',
				value: '',
			})
			Object.entries(categoryStats)
				.sort((a, b) => b[1].amount - a[1].amount)
				.forEach(([key, { amount, count }]) => {
					const label = key.startsWith('DEPOSIT_')
						? `Пополнение: ${key.replace('DEPOSIT_', '')}`
						: key
					worksheet.addRow({
						indicator: label,
						value: `${amount} (${count} транзакций)`,
					})
				})

			worksheet.getRow(1).font = { bold: true }
			worksheet.getRow(1).fill = {
				type: 'pattern',
				pattern: 'solid',
				fgColor: { argb: 'FFE0E0E0' },
			}

			worksheet.getColumn('value').numFmt = '#,##0.00'

			const detailsSheet = workbook.addWorksheet('Детальные транзакции')
			detailsSheet.columns = [
				{ header: 'ID', key: 'id', width: 36 },
				{ header: 'Тип', key: 'type', width: 12 },
				{ header: 'Сумма', key: 'amount', width: 15 },
				{ header: 'Описание', key: 'description', width: 40 },
				{ header: 'Категория', key: 'category', width: 20 },
				{ header: 'Тип пополнения', key: 'depositType', width: 20 },
				{ header: 'Дата создания', key: 'createdAt', width: 20 },
			]

			transactions
				.sort((a, b) => b.createdAt - a.createdAt)
				.forEach(transaction => {
					const createdAt = new Date(transaction.createdAt * 1000)
					detailsSheet.addRow({
						id: transaction.id,
						type:
							transaction.type === 'DEPOSIT'
								? 'Пополнение'
								: 'Снятие',
						amount: transaction.amount,
						description: transaction.description || '',
						category: transaction.category || '',
						depositType: transaction.depositType || '',
						createdAt: createdAt.toLocaleString('ru-RU'),
					})
				})

			detailsSheet.getRow(1).font = { bold: true }
			detailsSheet.getRow(1).fill = {
				type: 'pattern',
				pattern: 'solid',
				fgColor: { argb: 'FFE0E0E0' },
			}

			detailsSheet.getColumn('amount').numFmt = '#,##0.00'

			const buffer = await workbook.xlsx.writeBuffer()
			const filename = `transactions_${bankId}_${Date.now()}.xlsx`

			this.logger.log(`Excel file generated successfully: ${filename}`)
			return {
				file: new Uint8Array(buffer),
				filename,
			}
		} catch (error) {
			this.logger.error('Error generating Excel file', error)
			throw new RpcException(
				new BadRequestException('Failed to generate Excel file'),
			)
		}
	}
}
