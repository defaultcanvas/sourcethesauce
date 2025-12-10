import { styled, keyframes } from 'stitches.config'
import * as Tooltip from '@radix-ui/react-tooltip'

// ─────────────────────────────────────
// Icon Button
// ─────────────────────────────────────

export const Button = styled('button', {
  all: 'unset',
  width: '2.1875rem',   // ~35px, overridden by inline style from ButtonIcon
  height: '2.1875rem',
  borderRadius: '999px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  cursor: 'pointer',

  // Visual
  backgroundColor: 'transparent',
  color: '$heading',
  border: '1px solid transparent',
  transition:
    'background-color 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease, border-color 0.15s ease',

  '& svg': {
    width: '1.1rem',
    height: '1.1rem',
  },

  '&:hover': {
    backgroundColor: '$tertiary',
    boxShadow: '0 4px 10px rgba(15, 23, 42, 0.08)',
  },

  '&:active': {
    transform: 'scale(0.95)',
  },

  '&:focus-visible': {
    outline: 'none',
    borderColor: '$heading',
    boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.35)',
  },
})

// ─────────────────────────────────────
// Tooltip Animations
// ─────────────────────────────────────

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

// ─────────────────────────────────────
// Tooltip Content + Arrow
// ─────────────────────────────────────

export const Content = styled(Tooltip.Content, {
  borderRadius: 4,
  padding: '10px 15px',
  fontSize: '$xsm',
  lineHeight: 1,
  color: '$text',
  backgroundColor: '$tertiary',
  boxShadow:
    'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
  userSelect: 'none',
  maxWidth: 240,
  zIndex: 9999,

  animationDuration: '400ms',
  animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  willChange: 'transform, opacity',

  '&[data-state="delayed-open"]': {
    '&[data-side="top"]': { animationName: slideDownAndFade },
    '&[data-side="right"]': { animationName: slideLeftAndFade },
    '&[data-side="bottom"]': { animationName: slideUpAndFade },
    '&[data-side="left"]': { animationName: slideRightAndFade },
  },
})

export const Arrow = styled(Tooltip.Arrow, {
  fill: '$tertiary',
})

// ─────────────────────────────────────
// Radix Tooltip primitives re-export
// ─────────────────────────────────────

export const Provider = Tooltip.Provider
export const Root = Tooltip.Root
export const Trigger = Tooltip.Trigger
export const Portal = Tooltip.Portal
