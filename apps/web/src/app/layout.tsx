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
		<html lang='en' suppressHydrationWarning>
			<body suppressHydrationWarning>
				<MainProvider>{children}</MainProvider>
			</body>
		</html>
	)
}
