import { cn } from '@shared'
import * as React from 'react'

interface SelectProps extends React.ComponentProps<'select'> {}

function Select({ className, ...props }: SelectProps) {
	return (
		<select
			data-slot='select'
			className={cn(
				'h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[0.1875rem] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
				className,
			)}
			{...props}
		/>
	)
}

export { Select }
