import {
	BankInvitationAcceptRequestSchema,
	BankInvitationDeclineRequestSchema,
} from '@hermes/contracts'
import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
} from '@nestjs/common'
import {
	ApiBadRequestResponse,
	ApiBody,
	ApiCreatedResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from '@nestjs/swagger'
import z from 'zod'

import { Authorized, Protected } from '../../../common'
import { BAD_REQUEST_BANK_NOT_CREATED_EXAMPLE } from '../constants'

import {
	BankInvitationAcceptResponse,
	BankInvitationCreateRequest,
	BankInvitationCreateResponse,
	BankInvitationDeclineResponse,
	BankInvitationListResponse,
} from './dto'
import { InvitationsService } from './invitations.service'

@ApiTags('Bank invitations')
@Controller('banks/invitations')
export class InvitationsController {
	public constructor(
		private readonly invitationsService: InvitationsService,
	) {}

	@ApiOperation({ summary: 'Create bank invitation' })
	@ApiBody({ type: BankInvitationCreateRequest })
	@ApiCreatedResponse({ type: BankInvitationCreateResponse })
	@ApiBadRequestResponse({
		...BAD_REQUEST_BANK_NOT_CREATED_EXAMPLE,
	})
	@HttpCode(HttpStatus.CREATED)
	@Protected()
	@Post()
	public async createInvitation(
		@Authorized('id') userId: string,
		@Body() dto: BankInvitationCreateRequest,
	): Promise<BankInvitationCreateResponse> {
		return await this.invitationsService.createInvitation(userId, dto)
	}

	@ApiOperation({ summary: 'Get incoming invitations' })
	@ApiOkResponse({ type: BankInvitationListResponse })
	@HttpCode(HttpStatus.OK)
	@Protected()
	@Get('/incoming')
	public async getIncomingInvitations(
		@Authorized('id') userId: string,
	): Promise<BankInvitationListResponse> {
		return await this.invitationsService.getIncomingInvitations(userId)
	}

	@ApiOperation({ summary: 'Get outgoing invitations' })
	@ApiOkResponse({ type: BankInvitationListResponse })
	@HttpCode(HttpStatus.OK)
	@Protected()
	@Get('/outgoing')
	public async getOutgoingInvitations(
		@Authorized('id') userId: string,
	): Promise<BankInvitationListResponse> {
		return await this.invitationsService.getOutgoingInvitations(userId)
	}

	@ApiOperation({ summary: 'Accept invitation' })
	@ApiOkResponse({ type: BankInvitationAcceptResponse })
	@HttpCode(HttpStatus.OK)
	@Protected()
	@Post('/:id/accept')
	public async acceptInvitation(
		@Authorized('id') userId: string,
		@Param('id') invitationId: string,
	): Promise<BankInvitationAcceptResponse> {
		await z.parseAsync(BankInvitationAcceptRequestSchema, {
			id: invitationId,
		})
		return await this.invitationsService.acceptInvitation(
			invitationId,
			userId,
		)
	}

	@ApiOperation({ summary: 'Decline invitation' })
	@ApiOkResponse({ type: BankInvitationDeclineResponse })
	@HttpCode(HttpStatus.OK)
	@Protected()
	@Post('/:id/decline')
	public async declineInvitation(
		@Authorized('id') userId: string,
		@Param('id') invitationId: string,
	): Promise<BankInvitationDeclineResponse> {
		await z.parseAsync(BankInvitationDeclineRequestSchema, {
			id: invitationId,
		})
		return await this.invitationsService.declineInvitation(
			invitationId,
			userId,
		)
	}
}
