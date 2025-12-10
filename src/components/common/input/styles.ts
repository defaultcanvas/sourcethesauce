import { styled } from 'stitches.config'

export const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  width: '100%',

  variants: {
    fullWidth: {
      false: {
        width: 'auto',
      },
      true: {
        width: '100%',
      },
    },
  },

  defaultVariants: {
    fullWidth: true,
  },
})

export const IconView = styled('div', {
  position: 'relative',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
})

export const Input = styled('input', {
  width: '100%',
  height: '3rem',
  borderRadius: '10px',
  border: '1px solid $border',
  outline: 'none',
  padding: '0 1rem',
  color: '$text',
  fontWeight: 400,
  fontSize: '0.95rem',
  backgroundColor: 'transparent',
  transition: 'border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease, color 0.18s ease',

  '&::placeholder': {
    color: '$text',
    fontSize: '0.8rem',
    fontWeight: 400,
    opacity: 0.7,
  },

  '&:focus': {
    borderColor: '$primary',
    boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.25)', // soft focus ring
    backgroundColor: 'rgba(0,0,0,0.01)',
  },

  '&:disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
  },

  variants: {
    hasLeftIcon: {
      true: {
        paddingLeft: '3.25rem',
      },
    },
    hasRightIcon: {
      true: {
        paddingRight: '3.25rem',
      },
    },
    hasError: {
      true: {
        borderColor: '$error',
        color: '$error',
        boxShadow: '0 0 0 1px rgba(239, 68, 68, 0.35)',
      },
    },
  },
})

export const Label = styled('label', {
  cursor: 'pointer',
  fontSize: '$xsm',
  color: '$heading',
  fontWeight: 500,
})

export const ErrorMessage = styled('span', {
  color: '$error',
  fontSize: '$xsm',
})

export const LeftIconView = styled('div', {
  position: 'absolute',
  left: '0.9rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

export const RightIconView = styled('div', {
  position: 'absolute',
  right: '0.9rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})
