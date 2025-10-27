import { MainProvider, ToggleTheme } from '@/shared'
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
				<MainProvider>
					<ToggleTheme />
					{children}
				</MainProvider>
			</body>
		</html>
	)
}
