import type { Prisma, User } from '@prisma/client'

export interface IUsersRepository {
	findById(userId: string): Promise<User | null>
	findByEmail(email: string): Promise<User | null>
	findByUsername(username: string): Promise<User | null>
	createUser(data: Prisma.UserCreateInput): Promise<User>
	updateUser(userId: string, data: Prisma.UserUpdateInput): Promise<User>
	deleteUser(userId: string): Promise<User>
	exists(where: Prisma.UserWhereInput): Promise<boolean>
	update(
		where: Prisma.UserWhereUniqueInput,
		data: Prisma.UserUpdateInput,
	): Promise<User>
}
