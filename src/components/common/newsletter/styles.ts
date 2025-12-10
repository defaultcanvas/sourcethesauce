import { styled, keyframes } from 'stitches.config'
import * as Dialog from '@radix-ui/react-dialog'

export const Container = styled('div', {})

export const {
  Root,
  Trigger,
  Close,
  Portal,
} = Dialog

const overlayShow = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
})

const contentShow = keyframes({
  '0%': { opacity: 0, transform: 'translate(-50%, -48%) scale(.96)' },
  '100%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
})

export const Overlay = styled(Dialog.Overlay, {
  position: 'fixed',
  inset: 0,
  zIndex: 88,
  backgroundColor: 'rgba(0,0,0,0.35)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
})

export const Content = styled(Dialog.Content, {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 89,

  width: 'min(90vw, 720px)',
  maxHeight: '85vh',

  display: 'flex',
  flexDirection: 'row',
  overflow: 'hidden',

  backgroundColor: '$white',
  borderRadius: '18px',
  boxShadow:
    '0 18px 45px rgba(15, 23, 42, 0.35), 0 10px 25px rgba(15, 23, 42, 0.18)',
  animation: `${contentShow} 180ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
  '&:focus': { outline: 'none' },

  '@media (max-width: 768px)': {
    width: '92vw',
    maxWidth: '92vw',
    maxHeight: '90vh',
    flexDirection: 'column',
    borderRadius: '16px',
  },
})

export const Figure = styled('figure', {
  position: 'relative',
  margin: 0,

  width: '45%',
  minWidth: '260px',
  maxWidth: '320px',

  // Force a nice visual block for the image
  aspectRatio: '1',
  overflow: 'hidden',

  background:
    'radial-gradient(circle at top left, rgba(99,102,241,0.35), transparent 55%), radial-gradient(circle at bottom right, rgba(236,72,153,0.4), transparent 50%)',

  img: {
    objectFit: 'cover',
  },

  '@media (max-width: 768px)': {
    width: '100%',
    maxWidth: '100%',
    aspectRatio: '16 / 9',
  },
})

export const FormView = styled('div', {
  flex: 1,
  padding: '1.5rem 1.5rem 1.25rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: '1rem',
  backgroundColor: '$background',

  '@media (max-width: 768px)': {
    padding: '1.25rem 1.25rem 1rem',
  },
})

export const Form = styled('form', {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',

  '@media (min-width: 480px)': {
    gap: '1rem',
  },
})

export const ButtonIconView = styled('div', {
  position: 'absolute',
  top: '14px',
  right: '14px',
  zIndex: 90,

  '@media (max-width: 768px)': {
    top: '10px',
    right: '10px',
  },
})
