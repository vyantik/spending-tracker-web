import {
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import type { UserRole } from '@prisma/client'
import type { Request } from 'express'

import { ROLES_KEY } from '../decorators'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	public constructor(private readonly reflector: Reflector) {
		super()
	}

	public override async canActivate(context: ExecutionContext) {
		const baseCan = (await super.canActivate(context)) as boolean
		if (!baseCan) return false
		const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass(),
		])
		if (!roles || roles.length === 0) return true
		const request: Request = context.switchToHttp().getRequest()
		const user = request.user as { role?: UserRole }
		if (user?.role && roles.includes(user.role)) return true
		throw new ForbiddenException('Forbidden')
	}
}
