import { forwardRef } from 'react'
import Image from 'next/image'

import { Box, ButtonIcon, Icon, TextHelper } from '@/components/common'
import type { IconProps } from '@/components/common/icon/types'

import * as Styles from './styles'
import type { InputProps } from './types'

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    label,
    errorMessage,
    fullWidth,
    leftIcon,
    rightIcon,
    onLeftIconClick,
    onRightIconClick,
    textHelper,
    onMask,
    format: _format = 'string', // reserved for future formatting
    disabled,
    loading,
    ...otherProps
  } = props

  const hasError = Boolean(errorMessage)
  const inputId = otherProps.id ?? ''
  const errorId = hasError && inputId ? `${inputId}-error` : undefined

  const renderLabel = () => {
    if (!label) return null

    return (
      <Box gap={0.5}>
        <Styles.Label htmlFor={inputId}>
          {label}
        </Styles.Label>
        {textHelper && <TextHelper content={textHelper} />}
      </Box>
    )
  }

  const renderErrorMessage = () => {
    if (!hasError) return null

    return (
      <Styles.ErrorMessage id={errorId}>
        {errorMessage}
      </Styles.ErrorMessage>
    )
  }

  const renderIcon = (icon?: IconProps, callback?: () => void) => {
    if (!icon) return null

    if (callback) {
      return (
        <ButtonIcon
          type="button"
          label={icon.name}
          onClick={callback}
          icon={icon}
        />
      )
    }

    return <Icon {...icon} />
  }

  const renderLeftIcon = () => {
    if (!leftIcon) return null

    return (
      <Styles.LeftIconView>
        {renderIcon(leftIcon, onLeftIconClick)}
      </Styles.LeftIconView>
    )
  }

  const renderRightIcon = () => {
    if (!rightIcon && !loading) return null

    return (
      <Styles.RightIconView>
        {loading ? (
          <Image
            src="/elipse-load.svg"
            alt="Loading"
            width={30}
            height={30}
          />
        ) : (
          renderIcon(rightIcon, onRightIconClick)
        )}
      </Styles.RightIconView>
    )
  }

  return (
    <Styles.Container fullWidth={fullWidth}>
      {renderLabel()}

      <Styles.IconView>
        {renderLeftIcon()}

        <Styles.Input
          {...otherProps}
          id={inputId}
          ref={ref}
          disabled={disabled || loading}
          hasError={hasError}
          hasLeftIcon={Boolean(leftIcon)}
          hasRightIcon={Boolean(rightIcon || loading)}
          onKeyUp={onMask}
          aria-invalid={hasError || undefined}
          aria-describedby={errorId}
        />

        {renderRightIcon()}
      </Styles.IconView>

      {renderErrorMessage()}
    </Styles.Container>
  )
})

Input.displayName = 'Input'
