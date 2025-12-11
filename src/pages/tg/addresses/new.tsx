import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { styled, keyframes } from 'stitches.config'
import { TelegramLayout } from '@/components/telegram'
import { useTelegramAuth } from '@/context/telegram-auth'
import { supabase } from '@/lib/supabase'
import { lightImpact, successNotification, errorNotification } from '@/lib/telegram/haptics'

const fadeIn = keyframes({
  '0%': { opacity: 0, transform: 'translateY(8px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
})

const Container = styled('div', {
  minHeight: '100vh',
  backgroundColor: 'var(--tg-theme-secondary-bg-color, #f8f9fa)',
  paddingBottom: 100,
})

const Header = styled('header', {
  padding: '12px 16px',
  backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
  position: 'sticky',
  top: 0,
  zIndex: 100,
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
})

const BackButton = styled('button', {
  width: 40,
  height: 40,
  borderRadius: 12,
  background: 'var(--tg-theme-secondary-bg-color, #f5f5f5)',
  border: 'none',
  cursor: 'pointer',
  color: 'var(--tg-theme-text-color, #000000)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s ease',
  '&:active': { transform: 'scale(0.95)' },
})

const Title = styled('h1', {
  fontSize: 18,
  fontWeight: 700,
  margin: 0,
  color: 'var(--tg-theme-text-color, #000000)',
})

const Section = styled('section', {
  padding: '16px',
  margin: '8px 12px',
  backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
  borderRadius: 16,
  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  animation: `${fadeIn} 0.3s ease`,
})

const FormGroup = styled('div', { marginBottom: 14 })
const Label = styled('label', { display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--tg-theme-hint-color, #666)' })
const Input = styled('input', { width: '100%', padding: '14px 16px', borderRadius: 12, border: '2px solid transparent', backgroundColor: 'var(--tg-theme-secondary-bg-color, #f5f5f5)', color: 'var(--tg-theme-text-color, #000000)', fontSize: 15, fontWeight: 500, transition: 'all 0.2s ease', '&:focus': { outline: 'none', borderColor: '#6366f1', backgroundColor: 'var(--tg-theme-bg-color, #ffffff)' }, '&::placeholder': { color: 'var(--tg-theme-hint-color, #aaa)', fontWeight: 400 } })
const CheckboxRow = styled('div', { display: 'flex', alignItems: 'center', gap: 8 })
const SaveButton = styled('button', { width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', color: '#fff', fontWeight: 700, cursor: 'pointer' })

export default function NewAddressPage() {
  const router = useRouter()
  const { user, telegramUser } = useTelegramAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [form, setForm] = useState({
    label: 'Home',
    full_name: user?.full_name || telegramUser?.first_name || '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'UK',
    is_default: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target as any
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const validate = () => {
    if (!form.full_name.trim()) return 'Please enter a name'
    if (!form.address_line1.trim()) return 'Please enter an address'
    if (!form.city.trim()) return 'Please enter a city'
    if (!form.postal_code.trim()) return 'Please enter a postal code'
    return null
  }

  const handleSave = async () => {
    const v = validate()
    if (v) {
      errorNotification()
      return
    }

    setIsSaving(true)
    try {
      const payload: any = {
        label: form.label,
        full_name: form.full_name,
        phone: form.phone || null,
        address_line1: form.address_line1,
        address_line2: form.address_line2 || null,
        city: form.city,
        state: form.state || null,
        postal_code: form.postal_code,
        country: form.country || 'UK',
        is_default: form.is_default || false,
      }

      if (user?.id) payload.user_id = user.id
      else if (telegramUser?.id) payload.telegram_id = String(telegramUser.id)

      const { data, error } = await supabase.from('addresses').insert(payload).select().single()
      if (error) {
        console.error('Address save error', error)
        // Fallback: save to localStorage when addresses table is missing or insert fails
        try {
          const key = 'local_addresses_v1'
          const raw = localStorage.getItem(key)
          const arr = raw ? JSON.parse(raw) : []
          const localAddr = {
            id: `local-${Date.now()}`,
            ...payload,
            created_at: new Date().toISOString(),
          }
          arr.unshift(localAddr)
          localStorage.setItem(key, JSON.stringify(arr))
          console.warn('Saved address to localStorage fallback')
          successNotification()
          lightImpact()
          router.push('/tg/addresses')
          return
        } catch (lsErr) {
          console.error('Local fallback failed', lsErr)
          throw error
        }
      }

      successNotification()
      lightImpact()
      router.push('/tg/addresses')
    } catch (e) {
      console.error(e)
      errorNotification()
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <Head>
        <title>Add Address | Source The Sauce</title>
      </Head>
      <TelegramLayout showNav={false}>
        <Container>
          <Header>
            <BackButton onClick={() => router.back()}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M19 12H5"/>
                <path d="M12 19l-7-7 7-7"/>
              </svg>
            </BackButton>
            <Title>Add Address</Title>
          </Header>

          <Section>
            <FormGroup>
              <Label>Label</Label>
              <Input name="label" value={form.label} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label>Full name</Label>
              <Input name="full_name" value={form.full_name} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label>Phone</Label>
              <Input name="phone" value={form.phone} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label>Address line 1</Label>
              <Input name="address_line1" value={form.address_line1} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label>Address line 2 (optional)</Label>
              <Input name="address_line2" value={form.address_line2} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label>City</Label>
              <Input name="city" value={form.city} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label>State / County (optional)</Label>
              <Input name="state" value={form.state} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label>Postal code</Label>
              <Input name="postal_code" value={form.postal_code} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <CheckboxRow>
                <input id="is_default" name="is_default" type="checkbox" checked={form.is_default} onChange={handleChange} />
                <label htmlFor="is_default">Set as default</label>
              </CheckboxRow>
            </FormGroup>
          </Section>

          <div style={{ margin: '12px' }}>
            <SaveButton onClick={handleSave} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Address'}</SaveButton>
          </div>
        </Container>
      </TelegramLayout>
    </>
  )
}
