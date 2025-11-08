import { Inject, Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

import type { IUsersRepository } from './interfaces'
import { USERS_REPOSITORY_TOKEN } from './tokens'

@Injectable()
export class UsersCleanupService {
	private readonly logger = new Logger(UsersCleanupService.name)

	public constructor(
		@Inject(USERS_REPOSITORY_TOKEN)
		private readonly usersRepository: IUsersRepository,
	) {}

	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
		name: 'delete-unverified-users',
		timeZone: 'UTC',
	})
	public async handleCron() {
		this.logger.log('Начало очистки неподтвержденных аккаунтов...')

		const oneDayAgo = new Date()
		oneDayAgo.setDate(oneDayAgo.getDate() - 1)

		try {
			const deletedUsers = await this.usersRepository.findMany({
				isActivate: false,
				createdAt: {
					lt: oneDayAgo,
				},
			})

			if (deletedUsers.length === 0) {
				this.logger.log(
					'Неподтвержденных аккаунтов для удаления не найдено',
				)
				return
			}

			for (const user of deletedUsers) {
				await this.usersRepository.deleteUser(user.id)
				this.logger.log(
					`Удален неподтвержденный аккаунт: ${user.email} (ID: ${user.id})`,
				)
			}

			this.logger.log(
				`Очистка завершена. Удалено аккаунтов: ${deletedUsers.length}`,
			)
		} catch (error) {
			this.logger.error(
				`Ошибка при удалении неподтвержденных аккаунтов: ${error.message}`,
			)
		}
	}
}
