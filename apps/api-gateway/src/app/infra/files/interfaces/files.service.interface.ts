import type { TransactionData } from '@hermes/types/proto/files'

export interface IFilesService {
	uploadAvatar(fileData: Uint8Array, oldFilename?: string): Promise<string>
	getAvatarByFilename(filename: string): Promise<Uint8Array>
	generateTransactionsExcel(
		transactions: TransactionData[],
		bankId: string,
	): Promise<{ file: Uint8Array; filename: string }>
}
