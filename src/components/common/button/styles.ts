import { styled } from 'stitches.config'

export const Button = styled('button', {
  // Base
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  borderRadius: '999px',
  border: 'none',
  fontWeight: 600,
  cursor: 'pointer',
  outline: 'none',
  transition:
    'transform 0.12s ease, box-shadow 0.12s ease, background-color 0.12s ease, opacity 0.12s ease, border-color 0.12s ease',
  whiteSpace: 'nowrap',
  position: 'relative',

  '& svg': {
    flexShrink: 0,
  },

  '&:active': {
    transform: 'scale(0.97)',
  },

  '&:disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
    boxShadow: 'none',
  },

  variants: {
    // visual style
    variant: {
      primary: {
        backgroundColor: '$primary',
        color: '$white',
        boxShadow: '0 8px 20px rgba(0,0,0,0.18)',

        '&:hover:enabled': {
          backgroundColor: '$primaryDark',
        },
      },
      letters: {
        backgroundColor: 'transparent',
        color: '$primary',
        border: 'none',
        boxShadow: 'none',
        textTransform: 'uppercase',
        letterSpacing: '0.18em',

        '&:hover:enabled': {
          backgroundColor: 'rgba(148,163,184,0.04)',
        },
      },
      letter: {
        backgroundColor: 'transparent',
        color: '$primary',
        border: 'none',
        boxShadow: 'none',
        textTransform: 'uppercase',
        letterSpacing: '0.18em',

        '&:hover:enabled': {
          backgroundColor: 'rgba(148,163,184,0.04)',
        },
      },
      secondary: {
        backgroundColor: '$white',
        color: '$primary',
        border: '1px solid $primary',
        boxShadow: '0 6px 16px rgba(0,0,0,0.08)',

        '&:hover:enabled': {
          backgroundColor: '$gray50',
        },
      },
      ghost: {
        backgroundColor: 'transparent',
        color: 'var(--tg-theme-text-color, #0f172a)',
        border: '1px solid rgba(148,163,184,0.5)', // slate-400-ish – works on dark/light
        boxShadow: 'none',

        '&:hover:enabled': {
          backgroundColor: 'rgba(148,163,184,0.08)', // subtle tint
        },
      },
      danger: {
        backgroundColor: '$error',
        color: '$white',
        boxShadow: '0 8px 20px rgba(239,68,68,0.35)',

        '&:hover:enabled': {
          backgroundColor: '$errorDark',
        },
      },
    },

    // sizing
    size: {
      sm: {
        padding: '0.45rem 0.85rem',
        fontSize: '0.75rem',
        minHeight: '32px',
      },
      md: {
        padding: '0.7rem 1.2rem',
        fontSize: '0.9rem',
        minHeight: '40px',
      },
      lg: {
        padding: '0.9rem 1.4rem',
        fontSize: '1rem',
        minHeight: '48px',
      },
    },

    // layout
    fullWidth: {
      true: {
        width: '100%',
        justifyContent: 'center',
      },
    },
  },

  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})
