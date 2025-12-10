import { PropsWithChildren } from 'react'
import * as Styles from './styles'
import type { TypographyProps } from './types'

export function Typography(props: PropsWithChildren<TypographyProps>) {
  const { children, ...otherProps } = props

  return (
    <Styles.Typography {...otherProps}>
      {children}
    </Styles.Typography>
  )
}

Typography.displayName = 'Typography'

export default Typography
