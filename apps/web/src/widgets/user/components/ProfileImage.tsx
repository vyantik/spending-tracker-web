'use client'

import { LucideUpload } from 'lucide-react'
import { type ReactElement, useRef } from 'react'

import { Avatar, AvatarFallback, AvatarImage, useProfile } from '@/shared'

import { useUploadAvatarMutation } from '../hooks'

export function ProfileImage(): ReactElement {
	const { user } = useProfile()
	const { uploadAvatar, isLoadingUpload } = useUploadAvatarMutation()
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (file) {
			uploadAvatar(file)
		}
	}

	const handleClick = () => {
		fileInputRef.current?.click()
	}

	return (
		<div className='flex justify-center mb-8'>
			<div
				className='relative group cursor-pointer'
				onClick={handleClick}
				role='button'
				tabIndex={0}
				onKeyDown={e => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault()
						handleClick()
					}
				}}
			>
				<Avatar className='size-32'>
					<AvatarImage
						src={user?.avatar ?? undefined}
						alt={user?.username || 'Avatar'}
						key={user?.avatar}
						onError={e => {
							console.error(
								'Failed to load avatar:',
								user?.avatar,
								e,
							)
						}}
						onLoad={() => {
							console.log(
								'Avatar loaded successfully:',
								user?.avatar,
							)
						}}
					/>
					<AvatarFallback className='text-4xl'>
						{user?.username.slice(0, 1).toUpperCase()}
					</AvatarFallback>
				</Avatar>
				<div className='absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2'>
					{isLoadingUpload ? (
						<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-white' />
					) : (
						<>
							<LucideUpload className='size-8 text-white' />
							<span className='text-white text-sm font-medium'>
								Загрузить аватар
							</span>
						</>
					)}
				</div>
				<input
					ref={fileInputRef}
					type='file'
					accept='image/jpeg,image/jpg,image/png,image/webp'
					onChange={handleFileChange}
					className='hidden'
					disabled={isLoadingUpload}
				/>
			</div>
		</div>
	)
}
