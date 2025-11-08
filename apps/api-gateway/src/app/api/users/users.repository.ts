import { Injectable } from '@nestjs/common'
import type { Prisma, User } from '@prisma/client'

import { BaseRepository } from '../../common'

@Injectable()
export class UsersRepository extends BaseRepository<
	User,
	Prisma.UserCreateInput,
	Prisma.UserUpdateInput,
	Prisma.UserWhereInput,
	Prisma.UserWhereUniqueInput
> {
	protected get model() {
		return this.prismaService.user
	}

	public async findById(userId: string): Promise<User | null> {
		return await this.findUnique({ id: userId })
	}

	public async findByEmail(email: string): Promise<User | null> {
		return await this.findUnique({ email })
	}

	public async findByUsername(username: string): Promise<User | null> {
		return await this.findUnique({ username })
	}

	public async createUser(data: Prisma.UserCreateInput): Promise<User> {
		return await this.create(data)
	}

	public async updateUser(
		userId: string,
		data: Prisma.UserUpdateInput,
	): Promise<User> {
		return await this.update({ id: userId }, data)
	}

	public async deleteUser(userId: string): Promise<User> {
		return await this.delete({ id: userId })
	}

	public async existsByEmail(email: string): Promise<boolean> {
		return await this.exists({ email })
	}

	public async existsByUsername(username: string): Promise<boolean> {
		return await this.exists({ username })
	}
}
