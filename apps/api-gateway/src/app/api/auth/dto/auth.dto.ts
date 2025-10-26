import {
	LoginRequestSchema,
	LoginResponseSchema,
	RegisterRequestSchema,
	RegisterResponseSchema,
} from '@hermes/contracts'
import { createZodDto } from 'nestjs-zod'

export class RegisterRequest extends createZodDto(RegisterRequestSchema) {}
export class RegisterResponse extends createZodDto(RegisterResponseSchema) {}

export class LoginRequest extends createZodDto(LoginRequestSchema) {}
export class LoginResponse extends createZodDto(LoginResponseSchema) {}
