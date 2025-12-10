import { useRef, useState } from 'react'
import { useDebounceCallback, useEventListener } from '@/hooks'
import { Icon } from '@/components/common'
import * as Styles from './styles'

export function ButtonScrollTop() {
  const ref = useRef<HTMLButtonElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  const callback = useDebounceCallback((event: Event) => {
    const pageYOffset = window.pageYOffset

    if (pageYOffset > 500) {
      setIsVisible(true)
      return
    }

    setIsVisible(false)
  }, 100)

  // just pass the event through, we don't care about its type beyond Event
  useEventListener('scroll', (event) => callback(event as Event))

  const scrollToTop = () => {
    if (typeof window === 'undefined') return
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Styles.Button
      type="button"
      visible={isVisible}
      ref={ref}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <Icon name="arrowUp" color="ancesst8" />
    </Styles.Button>
  )
}
