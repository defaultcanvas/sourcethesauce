import { styled } from 'stitches.config'
import { fontSizes, colors } from '@/constants/theme'
import { parseToVariant } from '@/utils/helpers'

import type { VariantColors, VariantFontSize } from './types'

const fontSizesVariants = parseToVariant<VariantFontSize>(fontSizes, 'fontSize')
const colorsVariants = parseToVariant<VariantColors>(colors, 'color')

export const Typography = styled('span', {
  // Base text style
  display: 'inline-block',

  variants: {
    // Dynamic font sizes driven by your theme
    size: fontSizesVariants,

    // Dynamic colors driven by your theme
    color: colorsVariants,

    textAlign: {
      left: { textAlign: 'left' },
      center: { textAlign: 'center' },
      right: { textAlign: 'right' },
    },

    fontWeight: {
      400: { fontWeight: 400 },
      500: { fontWeight: 500 },
      600: { fontWeight: 600 },
      700: { fontWeight: 700 },
      800: { fontWeight: 800 },
    },

    // Handy for product titles / single-line labels
    truncate: {
      true: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
    },
  },
})
