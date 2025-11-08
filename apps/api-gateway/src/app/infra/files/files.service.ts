import {
	FILES_PACKAGE_NAME,
	FILES_SERVICE_NAME,
	FilesServiceClient,
	GenerateTransactionsExcelRequest,
	GenerateTransactionsExcelResponse,
	GetAvatarRequest,
	GetAvatarResponse,
	TransactionData,
	UploadAvatarRequest,
	UploadAvatarResponse,
} from '@hermes/types/proto/files'
import {
	BadRequestException,
	Inject,
	Injectable,
	Logger,
	NotFoundException,
	OnModuleInit,
} from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { ClientGrpc } from '@nestjs/microservices'
import { catchError, firstValueFrom, throwError } from 'rxjs'

import type { IFilesService } from './interfaces'

@Injectable()
export class FilesService implements OnModuleInit, IFilesService {
	private readonly logger = new Logger(FilesService.name)
	private filesService: FilesServiceClient

	public constructor(
		@Inject(FILES_PACKAGE_NAME) private readonly filesClient: ClientGrpc,
	) {}

	onModuleInit() {
		this.filesService =
			this.filesClient.getService<FilesServiceClient>(FILES_SERVICE_NAME)
	}

	/**
	 * Загрузить аватар
	 * @param fileData - Данные файла
	 * @param oldFilename - Старое имя файла для удаления (опционально)
	 * @returns Имя сохраненного файла (UUID.webp)
	 * @throws BadRequestException если файл невалиден
	 */
	public async uploadAvatar(
		fileData: Uint8Array,
		oldFilename?: string,
	): Promise<string> {
		const request: UploadAvatarRequest = {
			file: fileData,
			...(oldFilename && { oldFilename }),
		}

		try {
			const response: UploadAvatarResponse = await firstValueFrom(
				this.filesService.uploadAvatar(request).pipe(
					catchError(error => {
						this.logger.error('Failed to upload avatar:', error)

						if (error?.code === 3) {
							return throwError(
								() =>
									new NotFoundException(
										error.message || 'Avatar not found',
									),
							)
						}

						if (error?.code === 3 || error?.status === 404) {
							return throwError(
								() =>
									new NotFoundException(
										error.message || 'Avatar not found',
									),
							)
						}

						if (error?.code === 3 || error?.status === 400) {
							return throwError(
								() =>
									new BadRequestException(
										error.message || 'Invalid file',
									),
							)
						}

						return throwError(
							() =>
								new BadRequestException(
									error.message || 'Failed to upload avatar',
								),
						)
					}),
				),
			)

			return response.filename
		} catch (error) {
			if (
				error instanceof NotFoundException ||
				error instanceof BadRequestException
			) {
				throw error
			}

			this.logger.error('Unexpected error uploading avatar:', error)
			throw new BadRequestException('Failed to upload avatar')
		}
	}

	/**
	 * Получить аватар по имени файла
	 * @param filename - Имя файла (UUID.webp)
	 * @returns Данные файла
	 * @throws NotFoundException если файл не найден
	 */
	public async getAvatarByFilename(filename: string): Promise<Uint8Array> {
		const request: GetAvatarRequest = {
			filename,
		}

		try {
			const response: GetAvatarResponse = await firstValueFrom(
				this.filesService.getAvatar(request).pipe(
					catchError(error => {
						this.logger.error(
							`Failed to get avatar for filename ${filename}:`,
							error,
						)

						if (error?.code === 5 || error?.status === 404) {
							return throwError(
								() =>
									new NotFoundException(
										error.message || 'Avatar not found',
									),
							)
						}

						return throwError(
							() =>
								new NotFoundException(
									error.message || 'Avatar not found',
								),
						)
					}),
				),
			)

			return response.file
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw error
			}

			this.logger.error(
				`Unexpected error getting avatar for filename ${filename}:`,
				error,
			)
			throw new NotFoundException('Avatar not found')
		}
	}

	/**
	 * Генерация Excel файла со статистикой транзакций
	 * @param transactions - Массив транзакций
	 * @param bankId - ID банка
	 * @returns Данные Excel файла и имя файла
	 * @throws BadRequestException если не удалось сгенерировать файл
	 */
	public async generateTransactionsExcel(
		transactions: TransactionData[],
		bankId: string,
	): Promise<{ file: Uint8Array; filename: string }> {
		const request: GenerateTransactionsExcelRequest = {
			transactions,
			bankId,
		}

		try {
			const response: GenerateTransactionsExcelResponse =
				await firstValueFrom(
					this.filesService.generateTransactionsExcel(request).pipe(
						catchError(error => {
							this.logger.error(
								'Failed to generate transactions Excel:',
								error,
							)

							if (error?.code === 3 || error?.status === 400) {
								return throwError(
									() =>
										new BadRequestException(
											error.message ||
												'Failed to generate Excel file',
										),
								)
							}

							return throwError(
								() =>
									new BadRequestException(
										error.message ||
											'Failed to generate Excel file',
									),
							)
						}),
					),
				)

			return {
				file: response.file,
				filename: response.filename,
			}
		} catch (error) {
			if (error instanceof BadRequestException) {
				throw error
			}

			this.logger.error(
				'Unexpected error generating transactions Excel:',
				error,
			)
			throw new BadRequestException('Failed to generate Excel file')
		}
	}
}
