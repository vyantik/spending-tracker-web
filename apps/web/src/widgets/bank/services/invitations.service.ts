import type {
	BankInvitationAcceptResponse,
	BankInvitationCreateRequest,
	BankInvitationCreateResponse,
	BankInvitationDeclineResponse,
	BankInvitationListResponse,
} from '@hermes/contracts'

import { api } from '@/shared/api'

class InvitationsService {
	public async createInvitation(
		data: BankInvitationCreateRequest,
	): Promise<BankInvitationCreateResponse> {
		return await api.post<BankInvitationCreateResponse>(
			'/banks/invitations',
			data,
		)
	}

	public async getIncomingInvitations(): Promise<BankInvitationListResponse> {
		return await api.get<BankInvitationListResponse>(
			'/banks/invitations/incoming',
		)
	}

	public async getOutgoingInvitations(): Promise<BankInvitationListResponse> {
		return await api.get<BankInvitationListResponse>(
			'/banks/invitations/outgoing',
		)
	}

	public async acceptInvitation(
		invitationId: string,
	): Promise<BankInvitationAcceptResponse> {
		return await api.post<BankInvitationAcceptResponse>(
			`/banks/invitations/${invitationId}/accept`,
		)
	}

	public async declineInvitation(
		invitationId: string,
	): Promise<BankInvitationDeclineResponse> {
		return await api.post<BankInvitationDeclineResponse>(
			`/banks/invitations/${invitationId}/decline`,
		)
	}
}

export const invitationsService = new InvitationsService()
