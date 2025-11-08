import { Injectable } from '@nestjs/common'
import { BankInvitation, InvitationStatus, Prisma } from '@prisma/client'
import { DefaultArgs } from '@prisma/client/runtime/library'

import { BaseRepository } from '../../../common'

@Injectable()
export class InvitationsRepository extends BaseRepository<
	BankInvitation,
	Prisma.BankInvitationCreateInput,
	Prisma.BankInvitationUpdateInput,
	Prisma.BankInvitationWhereInput,
	Prisma.BankInvitationWhereUniqueInput
> {
	protected get model(): Prisma.BankInvitationDelegate<DefaultArgs> {
		return this.prismaService.bankInvitation
	}

	public async findByInviteeId(inviteeId: string): Promise<BankInvitation[]> {
		return await this.findMany({
			inviteeId,
			status: InvitationStatus.PENDING,
		})
	}

	public async findByInviterId(inviterId: string): Promise<BankInvitation[]> {
		return await this.findMany({
			inviterId,
		})
	}

	public async findByBankIdAndInviteeId(
		bankId: string,
		inviteeId: string,
	): Promise<BankInvitation | null> {
		return await this.findFirst({
			bankId,
			inviteeId,
		})
	}

	public async findByIdAndInviteeId(
		id: string,
		inviteeId: string,
	): Promise<BankInvitation | null> {
		return await this.findFirst({
			id,
			inviteeId,
			status: InvitationStatus.PENDING,
		})
	}
}
