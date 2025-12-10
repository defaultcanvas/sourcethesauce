import { styled, keyframes } from 'stitches.config'
import * as Tooltip from '@radix-ui/react-tooltip'

export const Container = styled('div', {})

const slideUpAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateY(2px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
})

const slideRightAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateX(-2px)' },
  '100%': { opacity: 1, transform: 'translateX(0)' },
})

const slideDownAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateY(-2px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
})

const slideLeftAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateX(2px)' },
  '100%': { opacity: 1, transform: 'translateX(0)' },
})

export const Content = styled(Tooltip.Content, {
  borderRadius: 6,
  padding: '10px 14px',
  fontSize: 15,
  lineHeight: 1.4,
  maxWidth: '260px',
  color: '$heading',
  background: '$tertiary',
  boxShadow:
    'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, ' +
    'hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
  userSelect: 'none',
  animationDuration: '400ms',
  animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  willChange: 'transform, opacity',

  '&[data-state="delayed-open"]': {
    '&[data-side="top"]': { animationName: slideDownAndFade },
    '&[data-side="right"]': { animationName: slideLeftAndFade },
    '&[data-side="bottom"]': { animationName: slideUpAndFade },
    '&[data-side="left"]': { animationName: slideRightAndFade },
  },

  p: {
    fontSize: '0.75rem',
    fontWeight: 500,
    margin: 0,
  },
})

export const Arrow = styled(Tooltip.Arrow, {
  fill: '$tertiary',
})

export const Trigger = styled(Tooltip.Trigger, {
  all: 'unset',
  border: '1px solid $heading',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '9999px',
  width: '1.5rem',
  height: '1.5rem',
  cursor: 'help',
  backgroundColor: 'transparent',
  transition: 'background-color 0.15s ease, transform 0.15s ease',

  '&:hover': {
    backgroundColor: 'rgba(0,0,0,0.04)',
  },

  '&:active': {
    transform: 'scale(0.9)',
  },

  '&:focus-visible': {
    outline: '2px solid $primary',
    outlineOffset: 2,
  },
})

export const { Provider, Root, Portal } = Tooltip
