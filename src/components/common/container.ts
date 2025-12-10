import { styled } from 'stitches.config'

export const Container = styled('div', {
  width: '100%',
  maxWidth: '800px',
  margin: '0 auto',
  boxSizing: 'border-box',

  // Base horizontal padding for breathing room
  paddingLeft: '1rem',
  paddingRight: '1rem',

  '@laptops-min': {
    paddingLeft: '1.5rem',
    paddingRight: '1.5rem',
  },

  variants: {
    size: {
      sm: {
        '@laptops-min': {
          maxWidth: '720px',
        },
      },
      md: {
        '@laptops-min': {
          maxWidth: '1240px',
        },
      },
      lg: {
        '@laptops-min': {
          maxWidth: '1320px',
        },
      },
    },
    center: {
      true: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      },
    },
    bleed: {
      true: {
        paddingLeft: 0,
        paddingRight: 0,
      },
    },
  },
})
