import { icons } from './icons'
import { theme } from 'stitches.config'
import { IconProps } from './types'

export function Icon(props: IconProps) {
  const {
    name,
    color,
    customColor,
    size = 20,
    ...rest
  } = props

  const Svg = icons[name]

  if (!Svg) return null

  // Safe theme color resolution with heading as fallback
  const headingColor = (theme.colors as any).heading?.value as string | undefined
  const themeColor =
    color && (theme.colors as any)[color]?.value
      ? ((theme.colors as any)[color].value as string)
      : undefined

  const resolvedColor =
    (customColor as string | undefined) ??
    themeColor ??
    headingColor ??
    '#000000'

  return (
    <Svg
      // many icon libs respect `size`; if not, they’ll ignore it harmlessly
      size={size}
      style={{
        fill: resolvedColor,
        color: resolvedColor,
      }}
      {...rest}
    />
  )
}
