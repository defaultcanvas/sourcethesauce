import { getTelegramWebApp } from './types'

/**
 * Detect if the user is inside Telegram WebView
 */
export function isTelegramWebView(): boolean {
  if (typeof window === 'undefined') return false
  
  const webApp = getTelegramWebApp()
  return !!webApp && webApp.platform !== 'unknown'
}

/**
 * Open URL in external browser (outside Telegram)
 * Useful for payment methods that work better in full browsers
 */
export function openInExternalBrowser(url: string): void {
  const webApp = getTelegramWebApp()
  
  if (webApp?.openLink) {
    // Telegram's native method to open external browser
    webApp.openLink(url, { try_instant_view: false })
  } else {
    // Fallback for non-Telegram environments
    window.open(url, '_blank')
  }
}

/**
 * Check if payment method should open in external browser
 * Redirect-based methods (Klarna, bank transfers) work better externally
 */
export function shouldUseExternalBrowserForPayment(paymentMethod?: string): boolean {
  if (!paymentMethod) return false
  
  const externalBrowserMethods = [
    'klarna',
    'paypal',
    'revolut_pay',
    'bancontact',
    'eps',
    'ideal',
    'sofort',
  ]
  
  return isTelegramWebView() && externalBrowserMethods.includes(paymentMethod.toLowerCase())
}
