import type { VariantProps } from '@stitches/react'
import type { ReactNode, ElementType } from 'react'

import { Typography } from './styles'
import { fontSizes, colors } from '@/constants/theme'

// Map each font size token to a variant entry: { fontSize: <token value> }
export type VariantFontSize = {
  [K in keyof typeof fontSizes]: { fontSize: (typeof fontSizes)[K] }
}

// Map each color token to a variant entry: { color: <token value> }
export type VariantColors = {
  [K in keyof typeof colors]: { color: (typeof colors)[K] }
}

// All variant props inferred from the styled component:
// - size
// - color
// - textAlign
// - fontWeight
// - truncate
// - etc. (anything added in styles.ts)
type Variant = VariantProps<typeof Typography>

export interface TypographyProps extends Variant {
  children: ReactNode
  as?: ElementType
  id?: string
}
