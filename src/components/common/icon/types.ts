import { theme } from 'stitches.config'
import type { IconName } from './icons'

type Colors = typeof theme['colors']

export interface IconProps {
  name: IconName
  color?: keyof Colors
  customColor?: string
  /** passed straight to underlying icon `size` prop */
  size?: number
}
