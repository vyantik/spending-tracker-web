'use client'

import { FormInput } from '.'
import type { BankInvitationCreateRequest } from '@hermes/contracts'
import { BankInvitationCreateRequestSchema } from '@hermes/contracts'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ReactElement } from 'react'
import { useForm } from 'react-hook-form'

import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Form,
	FormField,
} from '@/shared'

import { useCreateInvitationMutation } from '../hooks'

export function CreateInvitationForm(): ReactElement {
	const { createInvitation, isLoadingCreate } = useCreateInvitationMutation()

	const form = useForm<BankInvitationCreateRequest>({
		resolver: zodResolver(BankInvitationCreateRequestSchema),
		defaultValues: {
			inviteeUsername: '',
		},
	})

	const onSubmit = (values: BankInvitationCreateRequest) => {
		createInvitation(values, {
			onSuccess: () => {
				form.reset()
			},
		})
	}

	return (
		<Card className='w-full'>
			<CardHeader>
				<CardTitle>Отправить приглашение</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-4'
					>
						<FormField
							control={form.control}
							name='inviteeUsername'
							render={({ field }) => (
								<FormInput
									field={field}
									label='Имя пользователя'
									disabled={isLoadingCreate}
									placeholder='Введите имя пользователя'
									error={
										form.formState.errors.inviteeUsername
											?.message
									}
								/>
							)}
						/>
						<Button
							type='submit'
							disabled={isLoadingCreate}
							className='w-full'
						>
							{isLoadingCreate
								? 'Отправка...'
								: 'Отправить приглашение'}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}
