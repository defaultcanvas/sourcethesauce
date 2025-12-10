import { icons } from './icons'
import { theme } from 'stitches.config'
import type { IconProps } from './types'

export function Icon(props: IconProps) {
  const {
    name,
    color,
    customColor,
    size = 20,
  } = props

  const Svg = icons[name]
  if (!Svg) return null

  const themeColor = color ? theme.colors[color]?.value : undefined
  const fill = (customColor || themeColor || '#000') as string

  return (
    <Svg
      size={size}
      style={{ fill }}
    />
  )
}
