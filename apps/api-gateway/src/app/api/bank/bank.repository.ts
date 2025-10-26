import { Injectable } from '@nestjs/common'
import { Bank, Prisma } from '@prisma/client'
import { DefaultArgs } from '@prisma/client/runtime/library'

import { BaseRepository } from '../../common'

@Injectable()
export class BankRepository extends BaseRepository<
	Bank,
	Prisma.BankCreateInput,
	Prisma.BankUpdateInput,
	Prisma.BankWhereInput,
	Prisma.BankWhereUniqueInput
> {
	protected get model(): Prisma.BankDelegate<DefaultArgs> {
		return this.prismaService.bank
	}
}
