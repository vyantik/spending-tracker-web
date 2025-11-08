'use client'

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
	Input,
	Label,
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
								<div className='space-y-2'>
									<Label htmlFor='inviteeUsername'>
										Имя пользователя
									</Label>
									<Input
										id='inviteeUsername'
										{...field}
										disabled={isLoadingCreate}
										placeholder='Введите имя пользователя'
									/>
									{form.formState.errors.inviteeUsername && (
										<p className='text-sm text-destructive'>
											{
												form.formState.errors
													.inviteeUsername.message
											}
										</p>
									)}
								</div>
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
