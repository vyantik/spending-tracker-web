import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger'
import type { UserRole } from '@prisma/client'

import { JwtAuthGuard } from '../guards'

export const ROLES_KEY = 'roles'
export const Protected = (...roles: UserRole[]) => {
	const hasRoles = Array.isArray(roles) && roles.length > 0
	const decorators = [
		UseGuards(JwtAuthGuard),
		ApiUnauthorizedResponse({
			description: 'Unauthorized',
			example: { message: 'Unauthorized', statusCode: 401 },
		}),
		ApiBearerAuth(),
	] as const
	return hasRoles
		? applyDecorators(SetMetadata(ROLES_KEY, roles), ...decorators)
		: applyDecorators(...decorators)
}
