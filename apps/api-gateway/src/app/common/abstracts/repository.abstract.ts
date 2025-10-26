import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { PrismaService } from '../../infra/prisma/prisma.service'

/**
 * Базовый репозиторий с generic типизацией для работы с Prisma моделями
 * @template T - Тип модели Prisma (например, User, Post)
 * @template CreateInput - Тип для создания записи
 * @template UpdateInput - Тип для обновления записи
 * @template WhereInput - Тип для условий поиска
 */
@Injectable()
export abstract class BaseRepository<
	T,
	CreateInput = Prisma.Args<T, 'create'>['data'],
	UpdateInput = Prisma.Args<T, 'update'>['data'],
	WhereInput = Prisma.Args<T, 'findFirst'>['where'],
	WhereUniqueInput = Prisma.Args<T, 'findUnique'>['where'],
> {
	public constructor(public readonly prismaService: PrismaService) {}

	/**
	 * Абстрактный метод для получения модели Prisma
	 * Должен быть реализован в наследниках
	 */
	protected abstract get model(): any

	/**
	 * Создать новую запись
	 */
	public async create(data: CreateInput): Promise<T> {
		return await this.model.create({ data })
	}

	/**
	 * Найти запись по уникальному условию
	 */
	public async findUnique(where: WhereUniqueInput): Promise<T | null> {
		return await this.model.findUnique({ where })
	}

	/**
	 * Найти первую запись по условию
	 */
	public async findFirst(where: WhereInput): Promise<T | null> {
		return await this.model.findFirst({ where })
	}

	/**
	 * Найти множество записей по условию
	 */
	public async findMany(where?: WhereInput): Promise<T[]> {
		return await this.model.findMany({ where })
	}

	/**
	 * Обновить запись по уникальному условию
	 */
	public async update(
		where: WhereUniqueInput,
		data: UpdateInput,
	): Promise<T> {
		return await this.model.update({ where, data })
	}

	/**
	 * Удалить запись по уникальному условию
	 */
	public async delete(where: WhereUniqueInput): Promise<T> {
		return await this.model.delete({ where })
	}

	/**
	 * Подсчитать количество записей по условию
	 */
	public async count(where?: WhereInput): Promise<number> {
		return await this.model.count({ where })
	}

	/**
	 * Проверить существование записи по условию
	 */
	public async exists(where: WhereInput): Promise<boolean> {
		const count = await this.count(where)
		return count > 0
	}

	/**
	 * Найти запись или создать новую, если не найдена
	 */
	public async findUniqueOrCreate(
		where: WhereUniqueInput,
		create: CreateInput,
	): Promise<T> {
		return await this.model.upsert({
			where,
			create,
			update: {},
		})
	}

	/**
	 * Найти запись или выбросить ошибку, если не найдена
	 */
	public async findUniqueOrThrow(where: WhereUniqueInput): Promise<T> {
		return await this.model.findUniqueOrThrow({ where })
	}

	/**
	 * Найти первую запись или выбросить ошибку, если не найдена
	 */
	public async findFirstOrThrow(where: WhereInput): Promise<T> {
		return await this.model.findFirstOrThrow({ where })
	}
}
