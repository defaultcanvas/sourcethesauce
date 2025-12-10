import { theme } from 'stitches.config'
import type { IconName } from './icons'

type ThemeColors = typeof theme['colors']

export interface IconProps {
  name: IconName
  /** theme color token, e.g. "heading", "text", "primary" */
  color?: keyof ThemeColors
  /** override with a raw CSS color (hex/rgb/etc). Takes precedence over `color`. */
  customColor?: string
  /** icon size in px (passed straight to the icon component). Defaults to 20. */
  size?: number
}
