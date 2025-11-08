import type { BankInvitation, Prisma } from '@prisma/client'

export interface IInvitationsRepository {
	findByInviteeId(inviteeId: string): Promise<BankInvitation[]>
	findByInviterId(inviterId: string): Promise<BankInvitation[]>
	findByBankIdAndInviteeId(
		bankId: string,
		inviteeId: string,
	): Promise<BankInvitation | null>
	findByIdAndInviteeId(
		id: string,
		inviteeId: string,
	): Promise<BankInvitation | null>
	create(data: Prisma.BankInvitationCreateInput): Promise<BankInvitation>
	update(
		where: Prisma.BankInvitationWhereUniqueInput,
		data: Prisma.BankInvitationUpdateInput,
	): Promise<BankInvitation>
}
