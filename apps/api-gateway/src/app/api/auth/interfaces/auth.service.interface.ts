import type { Request, Response } from 'express'

import type {
	LoginResponse,
	RegisterResponse,
	VerifyOtpRequest,
	VerifyOtpResponse,
} from '../dto'

export interface IAuthService {
	register(dto: {
		username: string
		email: string
		password: string
	}): Promise<RegisterResponse>
	login(
		dto: { email: string; password: string },
		res: Response,
	): Promise<LoginResponse>
	logout(res: Response): void
	refresh(req: Request, res: Response): Promise<LoginResponse>
	verifyOtp(dto: VerifyOtpRequest): Promise<VerifyOtpResponse>
}
