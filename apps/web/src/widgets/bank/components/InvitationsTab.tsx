'use client'

import {
	CreateInvitationForm,
	IncomingInvitationsList,
	OutgoingInvitationsList,
} from '.'
import type { ReactElement } from 'react'

interface InvitationsTabProps {
	hasBank: boolean
}

export function InvitationsTab({ hasBank }: InvitationsTabProps): ReactElement {
	return (
		<div className='flex flex-col gap-6 w-full'>
			{hasBank ? (
				<div className='flex flex-col gap-6'>
					<CreateInvitationForm />
					<OutgoingInvitationsList />
				</div>
			) : (
				<IncomingInvitationsList />
			)}
		</div>
	)
}
