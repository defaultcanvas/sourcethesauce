import { styled } from 'stitches.config'

export const Button = styled('button', {
  all: 'unset',
  boxSizing: 'border-box',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',

  borderRadius: '9999px',
  cursor: 'pointer',

  // default size (can be overridden via variants)
  width: '2.25rem',
  height: '2.25rem',

  backgroundColor: 'transparent',
  color: '$heading',
  transition:
    'transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease, color 0.15s ease',
  boxShadow: '0 0 0 0 rgba(0,0,0,0.08)',

  '& svg': {
    transition: 'transform 0.15s ease',
  },

  '&:hover': {
    backgroundColor: 'rgba(0,0,0,0.03)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    '& svg': {
      transform: 'scale(1.05)',
    },
  },

  '&:active': {
    transform: 'scale(0.9)',
    boxShadow: '0 0 0 0 rgba(0,0,0,0)',
  },

  '&:focus-visible': {
    outline: '2px solid $primary',
    outlineOffset: 2,
  },

  '&:disabled': {
    opacity: 0.4,
    cursor: 'not-allowed',
    transform: 'none',
    boxShadow: 'none',
    backgroundColor: 'transparent',
  },

  variants: {
    active: {
      true: {
        // visually hint that the state is “saved/favourited”
        backgroundColor: 'rgba(239,68,68,0.08)',
        boxShadow: '0 2px 10px rgba(239,68,68,0.25)',
      },
    },
    size: {
      sm: {
        width: '1.75rem',
        height: '1.75rem',
      },
      md: {
        width: '2.25rem',
        height: '2.25rem',
      },
      lg: {
        width: '2.75rem',
        height: '2.75rem',
      },
    },
  },

  defaultVariants: {
    size: 'md',
  },
})
