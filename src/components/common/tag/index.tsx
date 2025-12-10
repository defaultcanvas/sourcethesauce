import type { PropsWithChildren, ComponentProps } from 'react'

import * as Styles from './styles'
import type { TagProps } from './types'

type TagComponentProps = PropsWithChildren<
  TagProps & ComponentProps<typeof Styles.Container>
>

export function Tag(props: TagComponentProps) {
  const { variant, children, ...rest } = props

  return (
    <Styles.Container variant={variant} {...rest}>
      {children}
    </Styles.Container>
  )
}

export default Tag
