'use client'

import { Menu, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ReactElement, useState } from 'react'

import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	ToggleTheme,
	useProfile,
} from '@/shared'
import { UserButton, UserButtonLoading } from '@/widgets'

import { LoginButton } from './LoginButton'

export const Header = (): ReactElement => {
	const router = useRouter()
	const { user, isLoadingUser } = useProfile()
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

	return (
		<header className='sticky top-0 z-50 w-full min-h-[4rem] p-2 sm:p-4 flex items-center justify-between bg-white dark:bg-[#161616] border-b border-gray-200 dark:border-gray-800'>
			<div className='flex items-center gap-2 sm:gap-4 flex-shrink-0'>
				<button
					onClick={() => router.push('/')}
					className='flex items-center gap-2 hover:opacity-80 transition-opacity'
					aria-label='Главная страница'
				>
					<svg
						width='48'
						height='48'
						viewBox='0 0 32 32'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
						className='text-foreground'
						aria-label='Vylos Logo'
					>
						<path
							d='M16 4L4 12V20L16 28L28 20V12L16 4Z'
							stroke='currentColor'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
						<path
							d='M12 12L16 20L20 12'
							stroke='currentColor'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
					</svg>
				</button>
			</div>

			<div className='hidden md:flex justify-center items-center gap-4 lg:gap-8'>
				<Button
					variant='default'
					onClick={() => router.push('/')}
					className='hidden lg:flex'
				>
					<p className='font-semibold'>Главная</p>
				</Button>
				{isLoadingUser ? (
					<UserButtonLoading />
				) : user ? (
					<>
						<Button onClick={() => router.push('/bank')}>
							<p className='font-semibold'>Банк</p>
						</Button>
						<UserButton router={router} />
					</>
				) : (
					<LoginButton router={router} />
				)}
				<ToggleTheme />
			</div>

			<div className='flex md:hidden items-center gap-2'>
				<ToggleTheme />
				<DropdownMenu
					open={isMobileMenuOpen}
					onOpenChange={setIsMobileMenuOpen}
				>
					<DropdownMenuTrigger asChild>
						<Button variant='outline' size='icon'>
							{isMobileMenuOpen ? (
								<X className='h-5 w-5' />
							) : (
								<Menu className='h-5 w-5' />
							)}
							<span className='sr-only'>Меню</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end' className='w-48'>
						<DropdownMenuItem
							onClick={() => {
								router.push('/')
								setIsMobileMenuOpen(false)
							}}
						>
							Главная
						</DropdownMenuItem>
						{isLoadingUser ? (
							<DropdownMenuItem disabled>
								Загрузка...
							</DropdownMenuItem>
						) : user ? (
							<>
								<DropdownMenuItem
									onClick={() => {
										router.push('/bank')
										setIsMobileMenuOpen(false)
									}}
								>
									Банк
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => {
										router.push('/profile')
										setIsMobileMenuOpen(false)
									}}
								>
									Профиль
								</DropdownMenuItem>
							</>
						) : (
							<DropdownMenuItem
								onClick={() => {
									router.push('/auth/login')
									setIsMobileMenuOpen(false)
								}}
							>
								Войти
							</DropdownMenuItem>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	)
}
