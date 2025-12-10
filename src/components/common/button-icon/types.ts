import { ButtonHTMLAttributes } from 'react'
import { IconProps } from '@/components/common/icon/types'

// Allow all normal <button> attributes except `children`
// so we can safely forward things like `style`, `aria-*`, etc.
type RootButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>

export interface ButtonIconProps extends RootButtonProps {
  icon: IconProps
  label: string
  textHelper?: string
}
