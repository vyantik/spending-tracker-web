import {
	BankInvitationAcceptResponseSchema,
	BankInvitationCreateRequestSchema,
	BankInvitationCreateResponseSchema,
	BankInvitationDeclineResponseSchema,
	BankInvitationGetResponseSchema,
	BankInvitationListResponseSchema,
} from '@hermes/contracts'
import {
	BadRequestException,
	ForbiddenException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { InvitationStatus } from '@prisma/client'

import type { IUsersRepository } from '../../users/interfaces'
import { USERS_REPOSITORY_TOKEN } from '../../users/tokens'
import type { IBankRepository } from '../interfaces'
import { BANK_REPOSITORY_TOKEN } from '../tokens'

import type { IInvitationsRepository, IInvitationsService } from './interfaces'
import { INVITATIONS_REPOSITORY_TOKEN } from './tokens'

@Injectable()
export class InvitationsService implements IInvitationsService {
	public constructor(
		@Inject(INVITATIONS_REPOSITORY_TOKEN)
		private readonly invitationsRepository: IInvitationsRepository,
		@Inject(BANK_REPOSITORY_TOKEN)
		private readonly bankRepository: IBankRepository,
		@Inject(USERS_REPOSITORY_TOKEN)
		private readonly usersRepository: IUsersRepository,
	) {}

	public async createInvitation(
		inviterId: string,
		dto: unknown,
	): Promise<{
		message: string
	}> {
		const validatedDto =
			await BankInvitationCreateRequestSchema.parseAsync(dto)

		const inviter = await this.usersRepository.findById(inviterId)
		if (!inviter) {
			throw new NotFoundException('Пользователь не найден')
		}

		if (!inviter.bankId) {
			throw new BadRequestException('У вас нет банка')
		}

		const invitee = await this.usersRepository.findByUsername(
			validatedDto.inviteeUsername,
		)
		if (!invitee) {
			throw new NotFoundException('Пользователь не найден')
		}

		if (invitee.id === inviterId) {
			throw new BadRequestException('Нельзя пригласить самого себя')
		}

		if (invitee.bankId) {
			throw new BadRequestException('Пользователь уже состоит в банке')
		}

		const existingInvitation =
			await this.invitationsRepository.findByBankIdAndInviteeId(
				inviter.bankId,
				invitee.id,
			)

		if (existingInvitation) {
			if (existingInvitation.status === InvitationStatus.PENDING) {
				throw new BadRequestException('Приглашение уже отправлено')
			}
		}

		const bank = await this.bankRepository.findUnique({
			id: inviter.bankId,
		})
		if (!bank) {
			throw new NotFoundException('Банк не найден')
		}

		await this.invitationsRepository.create({
			bank: { connect: { id: inviter.bankId } },
			inviter: { connect: { id: inviterId } },
			invitee: { connect: { id: invitee.id } },
			status: InvitationStatus.PENDING,
		})

		return await BankInvitationCreateResponseSchema.parseAsync({
			message: 'ok',
		})
	}

	public async getIncomingInvitations(userId: string): Promise<
		Array<{
			id: string
			bankId: string
			bankName: string
			inviterId: string
			inviterUsername: string
			inviteeId: string
			inviteeUsername: string
			status: InvitationStatus
			createdAt: string
			updatedAt: string
		}>
	> {
		const user = await this.usersRepository.findById(userId)
		if (!user) {
			throw new NotFoundException('Пользователь не найден')
		}

		if (user.bankId) {
			throw new BadRequestException(
				'Пользователи с банком не могут получать входящие приглашения',
			)
		}

		const invitations =
			await this.invitationsRepository.findByInviteeId(userId)

		const invitationsWithDetails = await Promise.all(
			invitations.map(async invitation => {
				const bank = await this.bankRepository.findUnique({
					id: invitation.bankId,
				})
				const inviter = await this.usersRepository.findById(
					invitation.inviterId,
				)
				const invitee = await this.usersRepository.findById(
					invitation.inviteeId,
				)

				return {
					id: invitation.id,
					bankId: invitation.bankId,
					bankName: bank?.name || '',
					inviterId: invitation.inviterId,
					inviterUsername: inviter?.username || '',
					inviteeId: invitation.inviteeId,
					inviteeUsername: invitee?.username || '',
					status: invitation.status,
					createdAt: invitation.createdAt.toISOString(),
					updatedAt: invitation.updatedAt.toISOString(),
				}
			}),
		)

		return await BankInvitationListResponseSchema.parseAsync(
			invitationsWithDetails,
		)
	}

	public async getOutgoingInvitations(userId: string): Promise<
		Array<{
			id: string
			bankId: string
			bankName: string
			inviterId: string
			inviterUsername: string
			inviteeId: string
			inviteeUsername: string
			status: InvitationStatus
			createdAt: string
			updatedAt: string
		}>
	> {
		const invitations =
			await this.invitationsRepository.findByInviterId(userId)

		const invitationsWithDetails = await Promise.all(
			invitations.map(async invitation => {
				const bank = await this.bankRepository.findUnique({
					id: invitation.bankId,
				})
				const inviter = await this.usersRepository.findById(
					invitation.inviterId,
				)
				const invitee = await this.usersRepository.findById(
					invitation.inviteeId,
				)

				return {
					id: invitation.id,
					bankId: invitation.bankId,
					bankName: bank?.name || '',
					inviterId: invitation.inviterId,
					inviterUsername: inviter?.username || '',
					inviteeId: invitation.inviteeId,
					inviteeUsername: invitee?.username || '',
					status: invitation.status,
					createdAt: invitation.createdAt.toISOString(),
					updatedAt: invitation.updatedAt.toISOString(),
				}
			}),
		)

		return await BankInvitationListResponseSchema.parseAsync(
			invitationsWithDetails,
		)
	}

	public async acceptInvitation(
		invitationId: string,
		userId: string,
	): Promise<{
		message: string
	}> {
		const user = await this.usersRepository.findById(userId)
		if (!user) {
			throw new NotFoundException('Пользователь не найден')
		}

		if (user.bankId) {
			throw new BadRequestException(
				'Пользователи с банком не могут принимать приглашения',
			)
		}

		const invitation =
			await this.invitationsRepository.findByIdAndInviteeId(
				invitationId,
				userId,
			)

		if (!invitation) {
			throw new NotFoundException('Приглашение не найдено')
		}

		await this.invitationsRepository.update(
			{ id: invitationId },
			{ status: InvitationStatus.ACCEPTED },
		)

		await this.usersRepository.update(
			{ id: userId },
			{
				bank: { connect: { id: invitation.bankId } },
			},
		)

		return await BankInvitationAcceptResponseSchema.parseAsync({
			message: 'ok',
		})
	}

	public async declineInvitation(
		invitationId: string,
		userId: string,
	): Promise<{
		message: string
	}> {
		const invitation =
			await this.invitationsRepository.findByIdAndInviteeId(
				invitationId,
				userId,
			)

		if (!invitation) {
			throw new NotFoundException('Приглашение не найдено')
		}

		await this.invitationsRepository.update(
			{ id: invitationId },
			{ status: InvitationStatus.DECLINED },
		)

		return await BankInvitationDeclineResponseSchema.parseAsync({
			message: 'ok',
		})
	}
}
