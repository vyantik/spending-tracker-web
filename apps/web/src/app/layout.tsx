import { MainProvider } from '@/shared'
import '@/shared/global.css'

export const metadata = {
	title: 'vylos',
	description: 'vylos home utilities',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html
			lang='en'
			suppressHydrationWarning
			className='h-full overflow-hidden'
		>
			<body suppressHydrationWarning className='h-full overflow-hidden'>
				<MainProvider>{children}</MainProvider>
			</body>
		</html>
	)
}
