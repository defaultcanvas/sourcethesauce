import { Icon } from '../icon'
import * as Styles from './styles'
import type { TextHelperProps } from './types'

export function TextHelper({ content }: TextHelperProps) {
  // If there is no helper text, render nothing
  if (!content) return null

  return (
    <Styles.Provider delayDuration={150}>
      <Styles.Root>
        <Styles.Trigger asChild>
          <button
            type="button"
            aria-label="More information"
            style={{
              all: 'unset',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'help',
            }}
          >
            <Icon name="question" size={15} />
          </button>
        </Styles.Trigger>

        <Styles.Portal>
          <Styles.Content sideOffset={5}>
            <p>{content}</p>
            <Styles.Arrow />
          </Styles.Content>
        </Styles.Portal>
      </Styles.Root>
    </Styles.Provider>
  )
}

export default TextHelper
