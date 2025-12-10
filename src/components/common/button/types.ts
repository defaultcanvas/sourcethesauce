import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode
  icon?: any
  loading?: boolean
  href?: string
  as?: any
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
}
