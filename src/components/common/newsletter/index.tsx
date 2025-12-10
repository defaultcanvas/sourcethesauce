import { useState } from 'react'
import Image from 'next/image'

import { useEventListener, useLocalStorage } from '@/hooks'
import { Button } from '../button'
import { ButtonIcon } from '../button-icon'
import { Input } from '../input'
import { Typography } from '../typography'
import * as Styles from './styles'
import type { NewsletterProps } from './types'
import { environments } from '@/constants/environments'

export function Newsletter(_props: NewsletterProps) {
  const [isOpen, setIsOpen] = useState(false)

  const [alreadyClosedNewsletter, setAlreadyClosedNewsletter] =
    useLocalStorage<boolean>(`${environments.appName}:newsletter`, false)

  // Exit-intent: open when cursor leaves viewport at the top, only once
  useEventListener('mouseout', (event) => {
    if (alreadyClosedNewsletter || isOpen) return

    const e = event as MouseEvent
    const related = e.relatedTarget || (e as any).toElement

    // Only trigger when leaving the window (no related target) and at top edge
    if (!related && e.clientY <= 0) {
      setIsOpen(true)
    }
  })

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    // Mark as “seen” when it closes, so it won't auto-open again
    if (!open && !alreadyClosedNewsletter) {
      setAlreadyClosedNewsletter(true)
    }
  }

  return (
    <Styles.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Styles.Portal>
        <Styles.Overlay />
        <Styles.Content>
          <Styles.ButtonIconView>
            <Styles.Close asChild>
              <ButtonIcon
                type="button"
                label="Close newsletter"
                icon={{ name: 'close' }}
              />
            </Styles.Close>
          </Styles.ButtonIconView>

          <Styles.Figure>
            <Image
              src="/newsletter.png"
              alt="Newsletter"
              fill
              sizes="(max-width: 768px) 90vw, 420px"
            />
          </Styles.Figure>

          <Styles.FormView>
            <Typography as="strong" size="md" color="heading">
              Subscribe to our newsletter
            </Typography>
            <Typography as="p">
              Get the latest drops and discounts from Source The Sauce.
            </Typography>

            <Styles.Form>
              <Input
                leftIcon={{ name: 'email' }}
                fullWidth
                type="email"
                autoComplete="email"
                placeholder="Your email address"
              />
              <Button type="button" fullWidth>
                Subscribe
              </Button>
            </Styles.Form>
          </Styles.FormView>
        </Styles.Content>
      </Styles.Portal>
    </Styles.Root>
  )
}
