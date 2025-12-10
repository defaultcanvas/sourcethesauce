import { forwardRef } from 'react'
import { Icon } from '../icon'
import * as Styles from './styles'
import type { ButtonIconProps } from './types'

export const ButtonIcon = forwardRef<HTMLButtonElement, ButtonIconProps>(
  (props, ref) => {
    const { icon, label, textHelper, ...restProps } = props

    // Extract any incoming style from the rest of props (not typed on ButtonIconProps)
    const { style, ...buttonProps } = restProps as any

    const baseSize = icon?.size ?? 25
    const sizeWithPadding = baseSize + 5

    return (
      <Styles.Provider>
        <Styles.Root>
          <Styles.Trigger asChild>
            <Styles.Button
              ref={ref}
              aria-label={label}
              {...buttonProps}
              style={{
                width: sizeWithPadding,
                height: sizeWithPadding,
                ...(style || {}),
              }}
            >
              <Icon {...icon} />
            </Styles.Button>
          </Styles.Trigger>

          {textHelper && (
            <Styles.Portal>
              <Styles.Content sideOffset={5}>
                {textHelper}
                <Styles.Arrow />
              </Styles.Content>
            </Styles.Portal>
          )}
        </Styles.Root>
      </Styles.Provider>
    )
  }
)

ButtonIcon.displayName = 'ButtonIcon'
