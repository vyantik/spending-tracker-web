export interface IFilesRepository {
	saveAvatar(
		fileData: Uint8Array,
		extension: string,
		oldFilename?: string,
	): Promise<string>
	getAvatarByFilename(filename: string): Promise<Uint8Array | null>
	deleteAvatarByFilename(filename: string): Promise<boolean>
	avatarExistsByFilename(filename: string): Promise<boolean>
}
