import { ComponentProps, CSSProperties, ReactNode } from 'react'

import { Container } from './styles'

type ViewStyle = Pick<
  CSSProperties,
  | 'alignSelf'
  | 'alignContent'
  | 'flex'
  | 'marginBottom'
  | 'marginRight'
  | 'marginLeft'
  | 'marginTop'
  | 'backgroundColor'
>

interface BoxProps extends ViewStyle, ComponentProps<typeof Container> {
  children: ReactNode
  fullWidth?: boolean
  maxWidth?: number
  /**
   * Gap in rem units when passed as a number.
   */
  gap?: number
}

export function Box(props: BoxProps) {
  const {
    children,
    fullWidth,
    gap,
    maxWidth,

    // spacing + style props we handle explicitly
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    backgroundColor,
    alignSelf,
    alignContent,
    flex,

    // layout props passed through as props (Container can style on them)
    justifyContent,
    flexDirection,
    alignItems,
    flexWrap,

    // user-supplied style object
    style,

    // everything else (event handlers, className, etc.)
    ...otherProps
  } = props

  const computedStyle: CSSProperties = {
    display: 'flex',
    width: fullWidth ? '100%' : 'auto',
    ...(typeof maxWidth !== 'undefined' ? { maxWidth } : {}),

    // base style from caller comes last so they can override defaults
    ...style,
  }

  // Gap in rem, if given
  if (typeof gap === 'number') {
    computedStyle.gap = `${gap}rem`
  }

  // Margins: number => rem, string => use as-is
  if (typeof marginTop === 'number') {
    computedStyle.marginTop = `${marginTop}rem`
  } else if (typeof marginTop !== 'undefined') {
    computedStyle.marginTop = marginTop
  }

  if (typeof marginBottom === 'number') {
    computedStyle.marginBottom = `${marginBottom}rem`
  } else if (typeof marginBottom !== 'undefined') {
    computedStyle.marginBottom = marginBottom
  }

  if (typeof marginLeft === 'number') {
    computedStyle.marginLeft = `${marginLeft}rem`
  } else if (typeof marginLeft !== 'undefined') {
    computedStyle.marginLeft = marginLeft
  }

  if (typeof marginRight === 'number') {
    computedStyle.marginRight = `${marginRight}rem`
  } else if (typeof marginRight !== 'undefined') {
    computedStyle.marginRight = marginRight
  }

  // Basic style props
  if (backgroundColor) computedStyle.backgroundColor = backgroundColor
  if (alignSelf) computedStyle.alignSelf = alignSelf
  if (alignContent) computedStyle.alignContent = alignContent
  if (typeof flex !== 'undefined') computedStyle.flex = flex

  return (
    <Container
      // layout props that Container can respond to
      flexDirection={flexDirection}
      alignItems={alignItems}
      justifyContent={justifyContent}
      flexWrap={flexWrap}
      // everything else (className, onClick, etc.)
      {...otherProps}
      // final merged style
      style={computedStyle}
    >
      {children}
    </Container>
  )
}
