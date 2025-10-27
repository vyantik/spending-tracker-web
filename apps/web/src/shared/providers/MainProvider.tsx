import type { PropsWithChildren } from 'react'

import { TanstackQueryProvider } from './TanstackQueryProvider'
import { ThemeProvider } from './ThemeProvider'

export function MainProvider({ children }: PropsWithChildren<unknown>) {
	return (
		<TanstackQueryProvider>
			<ThemeProvider attribute='class' defaultTheme='dark' enableSystem>
				{children}
			</ThemeProvider>
		</TanstackQueryProvider>
	)
}
