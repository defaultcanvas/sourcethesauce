import { styled } from 'stitches.config'

export const Container = styled('div', {
  // base flex box
  display: 'flex',
  boxSizing: 'border-box',

  variants: {
    flexDirection: {
      column: {
        flexDirection: 'column',
      },
      row: {
        flexDirection: 'row',
      },
      'column-reverse': {
        flexDirection: 'column-reverse',
      },
      'row-reverse': {
        flexDirection: 'row-reverse',
      },
      revert: {
        flexDirection: 'revert',
      },
      unset: {
        flexDirection: 'unset',
      },
    },

    alignItems: {
      flexStart: {
        alignItems: 'flex-start',
      },
      flexEnd: {
        alignItems: 'flex-end',
      },
      center: {
        alignItems: 'center',
      },
      stretch: {
        alignItems: 'stretch',
      },
      baseline: {
        alignItems: 'baseline',
      },
    },

    flexWrap: {
      wrap: {
        flexWrap: 'wrap',
      },
      nowrap: {
        flexWrap: 'nowrap',
      },
    },

    justifyContent: {
      center: {
        justifyContent: 'center',
      },
      'flex-start': {
        justifyContent: 'flex-start',
      },
      'space-between': {
        justifyContent: 'space-between',
      },
      'flex-end': {
        justifyContent: 'flex-end',
      },
      'space-around': {
        justifyContent: 'space-around',
      },
      'space-evenly': {
        justifyContent: 'space-evenly',
      },
    },
  },

  defaultVariants: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'nowrap',
  },
})
