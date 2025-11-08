import type { InvitationStatus } from '@prisma/client'

export interface InvitationListItem {
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
}

export interface IInvitationsService {
	createInvitation(
		inviterId: string,
		dto: unknown,
	): Promise<{ message: string }>
	getIncomingInvitations(userId: string): Promise<InvitationListItem[]>
	getOutgoingInvitations(userId: string): Promise<InvitationListItem[]>
	acceptInvitation(
		invitationId: string,
		userId: string,
	): Promise<{ message: string }>
	declineInvitation(
		invitationId: string,
		userId: string,
	): Promise<{ message: string }>
}
