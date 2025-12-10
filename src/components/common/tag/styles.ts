import { styled } from 'stitches.config'

export const Container = styled('div', {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.2rem 0.6rem',
  borderRadius: '9999px',
  fontSize: '0.7rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  lineHeight: 1,
  width: 'max-content',
  whiteSpace: 'nowrap',
  userSelect: 'none',
  // default fallback
  color: '$ancesst8',
  backgroundColor: 'rgba(15, 23, 42, 0.04)',
  boxShadow: '0 1px 3px rgba(15, 23, 42, 0.12)',
  transition: 'transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease',

  variants: {
    variant: {
      new: {
        background:
          'linear-gradient(135deg, #6ee7b7 0%, #22c55e 40%, #16a34a 100%)',
        color: '#022c22',
      },
      soldOut: {
        background:
          'linear-gradient(135deg, #e5e7eb 0%, #9ca3af 40%, #4b5563 100%)',
        color: '#020617',
      },
      discount: {
        background:
          'linear-gradient(135deg, #a855f7 0%, #6366f1 40%, #4f46e5 100%)',
        color: '#eef2ff',
      },
    },
    tone: {
      subtle: {
        boxShadow: 'none',
        opacity: 0.9,
      },
      strong: {
        boxShadow: '0 4px 10px rgba(15, 23, 42, 0.2)',
      },
    },
  },

  defaultVariants: {
    tone: 'subtle',
  },

  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 2px 6px rgba(15, 23, 42, 0.18)',
  },
})
