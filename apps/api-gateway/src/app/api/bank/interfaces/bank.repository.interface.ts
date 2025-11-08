import type { Bank, Prisma } from '@prisma/client'

export interface IBankRepository {
	findByUserId(userId: string): Promise<Bank | null>
	findUnique(where: Prisma.BankWhereUniqueInput): Promise<Bank | null>
	create(data: Prisma.BankCreateInput): Promise<Bank>
	update(
		where: Prisma.BankWhereUniqueInput,
		data: Prisma.BankUpdateInput,
	): Promise<Bank>
	delete(where: Prisma.BankWhereUniqueInput): Promise<Bank>
}
