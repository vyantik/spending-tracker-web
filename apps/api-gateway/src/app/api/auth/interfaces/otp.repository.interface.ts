export interface IOtpRepository {
	findByEmailAndCode(email: string, code: string): Promise<string | null>
	findValidByEmail(email: string): Promise<string | null>
	createOtp(email: string, code: string, ttl: number): Promise<void>
	deleteOtp(email: string, code: string): Promise<void>
	deleteByEmail(email: string): Promise<void>
}
