export interface IFilesService {
	uploadAvatar(fileData: Uint8Array, oldFilename?: string): Promise<string>
	getAvatarByFilename(filename: string): Promise<Uint8Array>
	deleteAvatarByFilename(filename: string): Promise<boolean>
	generateTransactionsExcel(
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
	): Promise<{ file: Uint8Array; filename: string }>
}
