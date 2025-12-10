import type { VariantProps } from '@stitches/react'
import type { InputHTMLAttributes, KeyboardEvent } from 'react'

import { Container } from './styles'
import type { IconProps } from '@/components/common/icon/types'

type RootInputProps = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  | 'onChange'
  | 'onFocus'
  | 'onBlur'
  | 'name'
  | 'id'
  | 'placeholder'
  | 'defaultValue'
  | 'type'
  | 'autoFocus'
  | 'disabled'
  | 'maxLength'
  | 'inputMode'
  | 'autoComplete'
  | 'readOnly'
  | 'onMouseDown'
  | 'required'
  | 'value'
>

type InputStylesProps = Pick<VariantProps<typeof Container>, 'fullWidth'>

export interface InputProps extends RootInputProps, InputStylesProps {
  label?: string
  errorMessage?: string
  textHelper?: string
  leftIcon?: IconProps
  rightIcon?: IconProps
  onRightIconClick?: () => void
  onLeftIconClick?: () => void
  onMask?: (event: KeyboardEvent<HTMLInputElement>) => void
  format?: 'string' | 'number'
  loading?: boolean
}
