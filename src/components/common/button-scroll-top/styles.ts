import { styled } from 'stitches.config'

export const Button = styled('button', {
  position: 'fixed',
  right: '16px',
  bottom: 'max(16px, calc(env(safe-area-inset-bottom, 0px) + 16px))',
  width: 44,
  height: 44,
  borderRadius: 9999,
  border: 'none',
  outline: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  zIndex: 40,
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  color: '#ffffff',
  boxShadow: '0 10px 25px rgba(15,23,42,0.35)',
  transition:
    'opacity 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease, visibility 0.18s ease',

  '&:active': {
    transform: 'scale(0.95) translateY(1px)',
    boxShadow: '0 6px 16px rgba(15,23,42,0.3)',
  },

  '&:focus-visible': {
    outline: 'none',
    boxShadow:
      '0 0 0 2px rgba(255,255,255,0.9), 0 0 0 4px rgba(99,102,241,0.9)',
  },

  variants: {
    visible: {
      true: {
        opacity: 1,
        visibility: 'visible',
        pointerEvents: 'auto',
        transform: 'translateY(0)',
      },
      false: {
        opacity: 0,
        visibility: 'hidden',
        pointerEvents: 'none',
        transform: 'translateY(16px)',
        boxShadow: 'none',
      },
    },
  },

  defaultVariants: {
    visible: false,
  },
})
