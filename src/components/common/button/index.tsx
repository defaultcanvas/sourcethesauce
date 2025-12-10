import { forwardRef } from 'react'
import Link from 'next/link'

import { Icon } from '@/components'
import * as Styles from './styles'
import type { ButtonProps } from './types'
import LoadingSvg from 'public/loading.svg'

export const Button = forwardRef<any, ButtonProps>(function Button(
  {
    children,
    icon,
    loading = false,
    disabled = false,
    href,
    type = 'button',
    as,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    ...otherProps
  },
  ref
) {
  // Keep old behaviour: only treat as link if as === 'a' and href is provided
  const isLink = as === 'a' && !!href

  const content = (
    <>
      {!loading && (
        <>
          {icon && <Icon {...icon} />}
          {children && <span>{children}</span>}
        </>
      )}
      {loading && <LoadingSvg height={30} width={30} />}
    </>
  )

  // Single place where we render the styled button
  const buttonElement = (
    <Styles.Button
      ref={ref}
      // Only set type when we're using it as a real button
      type={isLink ? undefined : type}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={!isLink && (disabled || loading)}
      aria-busy={loading}
      {...otherProps}
    >
      {content}
    </Styles.Button>
  )

  if (isLink && href) {
    // Wrap the button in Next Link (same pattern you had before)
    return (
      <Link href={href} legacyBehavior>
        {buttonElement}
      </Link>
    )
  }

  return buttonElement
})
