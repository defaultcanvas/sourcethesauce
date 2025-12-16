import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import TelegramLayout from '@/components/telegram/TelegramLayout'
import { styled, keyframes } from 'stitches.config'
import { useTelegramAuth } from '@/context/telegram-auth'
import { useCart } from '@/context/telegram-cart'
import { environments } from '@/constants/environments'

const stripePromise = loadStripe(environments.stripe.publishableKey)

const spin = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
})

const fadeIn = keyframes({
  '0%': { opacity: 0, transform: 'translateY(20px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
})

const Container = styled('div', {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 24,
  background: 'var(--tg-theme-bg-color, #ffffff)',
})

const Card = styled('div', {
  background: 'var(--tg-theme-secondary-bg-color, #f8f9fa)',
  borderRadius: 20,
  padding: 32,
  maxWidth: 400,
  width: '100%',
  textAlign: 'center',
  animation: `${fadeIn} 0.5s ease`,
})

const IconWrapper = styled('div', {
  marginBottom: 24,
  
  variants: {
    status: {
      loading: {
        '& svg': {
          animation: `${spin} 1s linear infinite`,
        },
      },
      success: {},
      error: {},
    },
  },
})

const Title = styled('h1', {
  fontSize: 24,
  fontWeight: 700,
  marginBottom: 12,
  color: 'var(--tg-theme-text-color, #000000)',
})

const Message = styled('p', {
  fontSize: 16,
  color: 'var(--tg-theme-hint-color, #666666)',
  marginBottom: 24,
  lineHeight: 1.5,
})

const Button = styled('button', {
  width: '100%',
  padding: '16px',
  borderRadius: 14,
  border: 'none',
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  color: '#ffffff',
  fontSize: 16,
  fontWeight: 700,
  cursor: 'pointer',
  boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
  transition: 'all 0.2s ease',

  '&:active': {
    transform: 'scale(0.98)',
  },
})

function PaymentSuccessContent() {
  const router = useRouter()
  const { clearCart } = useCart()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Verifying your payment...')
  const [stripe, setStripe] = useState<any>(null)

  useEffect(() => {
    const initStripe = async () => {
      const stripeInstance = await stripePromise
      setStripe(stripeInstance)
    }
    initStripe()
  }, [])

  useEffect(() => {
    const verifyPayment = async () => {
      if (!stripe) return

      const clientSecret = new URLSearchParams(window.location.search).get(
        'payment_intent_client_secret'
      )

      if (!clientSecret) {
        setStatus('error')
        setMessage('Payment information not found')
        return
      }

      try {
        // Retrieve the PaymentIntent
        const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret)

        if (!paymentIntent) {
          setStatus('error')
          setMessage('Could not retrieve payment information')
          return
        }

        if (paymentIntent.status === 'succeeded') {
          console.log('Payment succeeded, confirming order with payment ID:', paymentIntent.id)
          
          // Update order status in database
          const response = await fetch('/api/orders/confirm-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              paymentIntentId: paymentIntent.id,
            }),
          })

          const data = await response.json()
          console.log('Confirm payment response:', data)

          if (data.error) {
            console.error('Error confirming order:', data.error)
            setStatus('error')
            setMessage(`Order confirmation failed: ${data.error}`)
            return
          }

          // Clear the cart after successful payment
          console.log('Clearing cart...')
          await clearCart()
          console.log('Cart cleared successfully')

          setStatus('success')
          setMessage('Payment successful! Your order has been confirmed.')
          
          // Redirect to orders page after 2 seconds
          setTimeout(() => {
            router.push('/tg/orders')
          }, 2000)
        } else if (paymentIntent.status === 'processing') {
          setStatus('loading')
          setMessage('Your payment is being processed. Please wait...')
          
          // Check again after 3 seconds
          setTimeout(() => {
            window.location.reload()
          }, 3000)
        } else {
          setStatus('error')
          setMessage('Payment was not successful. Please try again.')
        }
      } catch (error: any) {
        console.error('Error verifying payment:', error)
        setStatus('error')
        setMessage('Failed to verify payment. Please contact support.')
      }
    }

    verifyPayment()
  }, [stripe, router, clearCart])

  const handleBackToHome = () => {
    router.push('/tg')
  }

  return (
    <TelegramLayout title="Payment Status">
      <Container>
        <Card>
          <IconWrapper status={status}>
            {status === 'loading' && (
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6366f1"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" opacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
              </svg>
            )}
            {status === 'success' && (
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {status === 'error' && (
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M15 9l-6 6M9 9l6 6" strokeLinecap="round" />
              </svg>
            )}
          </IconWrapper>

          <Title>
            {status === 'loading' && 'Processing...'}
            {status === 'success' && 'Payment Successful!'}
            {status === 'error' && 'Payment Failed'}
          </Title>

          <Message>{message}</Message>

          {status === 'error' && (
            <Button onClick={handleBackToHome}>Back to Home</Button>
          )}
        </Card>
      </Container>
    </TelegramLayout>
  )
}

export default function PaymentSuccessPage() {
  return (
    <PaymentSuccessContent />
  )
}
