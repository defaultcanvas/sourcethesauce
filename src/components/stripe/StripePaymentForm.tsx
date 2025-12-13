import { useState } from 'react'
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { styled, keyframes } from 'stitches.config'

const fadeIn = keyframes({
  '0%': { opacity: 0, transform: 'translateY(8px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
})

const PaymentContainer = styled('div', {
  animation: `${fadeIn} 0.3s ease`,
})

const PaymentElementWrapper = styled('div', {
  backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
  borderRadius: 12,
  padding: '16px',
  marginBottom: 16,
})

const PayButton = styled('button', {
  width: '100%',
  padding: '16px',
  borderRadius: 14,
  border: 'none',
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  color: '#ffffff',
  fontSize: 16,
  fontWeight: 700,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
  transition: 'all 0.2s ease',

  '&:active': {
    transform: 'scale(0.98)',
  },

  '&:disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
})

const ErrorMessage = styled('div', {
  padding: '12px 16px',
  background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
  color: '#dc2626',
  borderRadius: 12,
  fontSize: 13,
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  marginBottom: 16,
})

const SecureNotice = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  padding: '12px',
  color: 'var(--tg-theme-hint-color, #666)',
  fontSize: 12,
  fontWeight: 500,
})

interface StripePaymentFormProps {
  amount: number
  onSuccess: (paymentIntentId: string) => void
  onError: (error: string) => void
  disabled?: boolean
}

export function StripePaymentForm({
  amount,
  onSuccess,
  onError,
  disabled = false,
}: StripePaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setErrorMessage(null)

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      })

      if (error) {
        setErrorMessage(error.message || 'Payment failed')
        onError(error.message || 'Payment failed')
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent.id)
      } else if (paymentIntent && paymentIntent.status === 'requires_action') {
        // Handle 3D Secure or other authentication
        const { error: confirmError } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: window.location.href,
          },
        })

        if (confirmError) {
          setErrorMessage(confirmError.message || 'Authentication failed')
          onError(confirmError.message || 'Authentication failed')
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred')
      onError(err.message || 'An unexpected error occurred')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <PaymentContainer>
      <form onSubmit={handleSubmit}>
        {errorMessage && (
          <ErrorMessage>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            {errorMessage}
          </ErrorMessage>
        )}

        <PaymentElementWrapper>
          <PaymentElement
            options={{
              layout: 'tabs',
            }}
          />
        </PaymentElementWrapper>

        <PayButton
          type="submit"
          disabled={!stripe || isProcessing || disabled}
        >
          {isProcessing ? (
            <>Processing Payment...</>
          ) : (
            <>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              Pay £{amount.toFixed(2)}
            </>
          )}
        </PayButton>

        <SecureNotice>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
          </svg>
          Secured by Stripe
        </SecureNotice>
      </form>
    </PaymentContainer>
  )
}

export default StripePaymentForm
