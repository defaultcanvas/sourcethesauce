# Stripe Multiple Payment Methods Setup Guide

## Overview
Your checkout now supports multiple payment methods including:
- 💳 **Credit/Debit Cards** (Visa, Mastercard, Amex, etc.)
- 🛍️ **Klarna** (Buy now, pay later)
- 💰 **PayPal**
- 🏦 **Revolut Pay**
- 🔗 **Link** (Stripe's 1-click checkout)
- 📦 **Amazon Pay** (if enabled)

**Important:** You must enable each payment method in your Stripe Dashboard Settings → Payment methods. The code will automatically show all enabled methods!

## Current Implementation
The code is already configured to accept multiple payment methods using Stripe's Payment Element. However, you need to **enable each payment method** in your Stripe Dashboard.

---

## Step-by-Step Setup

### 1. Access Stripe Dashboard
1. Log in to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Make sure you're in **Test mode** first (toggle in top right)
3. Navigate to **Settings** → **Payment methods**

### 2. Enable Payment Methods

#### 💳 Card Payments (Already Enabled by Default)
- No action needed - cards are enabled automatically

#### 🛍️ Klarna (Buy Now, Pay Later)
1. Go to **Settings** → **Payment methods**
2. Find **Klarna** in the list
3. Click **Enable**
4. **Important**: 
   - Available in: UK, EU, US, Canada, Australia
   - Requires business verification for live mode
   - Customer must be in supported country
   - Minimum order: ~£35 (varies by region)

#### 💰 PayPal
1. Go to **Settings** → **Payment methods**
2. Find **PayPal** in the list
3. Click **Enable**
4. **Important**:
   - Available globally
   - May require additional business verification
   - PayPal will charge additional fees (~2.9% + fee)
   - Customers redirected to PayPal to complete payment

#### 🏦 Revolut Pay
1. Go to **Settings** → **Payment methods**
2. Find **Revolut Pay** in the list
3. Click **Enable**
4. **Important**:
   - Available in UK and EU
   - Requires Revolut app on customer's phone
   - Fast checkout for Revolut users
   - No additional verification needed

#### 🔗 Link by Stripe
1. Go to **Settings** → **Payment methods**
2. Find **Link** in the list
3. Click **Enable**
4. **Benefits**:
   - No verification needed
   - Saves customer payment details securely
   - 1-click checkout for returning customers
   - Automatically enabled with cards

---

## Regional Availability

### UK Market (Your Primary Market)
✅ **Available:**
- Card payments (all major cards)
- Klarna (UK customers)
- PayPal (global)
- Revolut Pay (UK customers)
- Link (automatic with cards)

### Additional Methods for UK (Optional)
You can also enable:
- **Bacs Direct Debit** (UK bank transfers)
  - Go to Settings → Payment methods → Enable Bacs
  - Requires business bank verification
  - Takes 3-5 business days to process
  
- **Apple Pay / Google Pay**
  - Automatically available with card payments
  - No additional setup needed
  - Works on mobile devices automatically

---

## Testing Payment Methods

### Test Mode Setup
1. Switch to **Test mode** in Stripe Dashboard
2. Enable all payment methods in test mode first
3. Use test credentials to verify each method works

### Test Cards
```
Card Number: 4242 4242 4242 4242
Expiry: Any future date (e.g., 12/34)
CVC: Any 3 digits (e.g., 123)
ZIP: Any 5 digits (e.g., 12345)
```

### Test Klarna
- In test mode, Klarna will show a simplified flow
- Use test phone number: `+46 70 123 4567`
- No real credit check performed in test mode

### Test PayPal
- In test mode, use Stripe's test PayPal credentials
- Create a test PayPal account or use Stripe's sandbox

### Test Revolut Pay
- In test mode, Revolut will simulate successful payment
- Real testing requires live mode with small amounts

---

## Going Live

### Pre-Launch Checklist
- [ ] Enable payment methods in **Test mode**
- [ ] Test each payment method with test cards/accounts
- [ ] Complete Stripe business verification (if required)
- [ ] Switch to **Live mode** in Stripe Dashboard
- [ ] Enable same payment methods in **Live mode**
- [ ] Update environment variables in Vercel:
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (live key)
  - `STRIPE_SECRET_KEY` (live key)
  - `STRIPE_WEBHOOK_SECRET` (live webhook secret)

### Business Verification Requirements
Some payment methods require verification:

**Klarna:**
- Business registration documents
- Bank account verification
- Processing ~3-5 business days

**PayPal:**
- May require business verification
- Link your business PayPal account
- Processing ~1-3 business days

**Revolut Pay:**
- No additional verification needed
- Enabled immediately

---

## Payment Method Fees

Stripe charges different fees for each payment method:

| Payment Method | Stripe Fee (UK) |
|---------------|-----------------|
| Cards | 1.5% + 20p |
| Klarna | 2.9% + 20p |
| PayPal | 2.9% + 20p |
| Revolut Pay | 1.5% + 20p |
| Link | 1.5% + 20p |

💡 **Note**: Fees may vary based on your Stripe plan and transaction volume.

---

## Troubleshooting

### Payment Method Not Showing on Checkout
1. Verify it's enabled in Stripe Dashboard (Settings → Payment methods)
2. Check customer's country matches payment method availability
3. Ensure currency is supported (GBP is supported for all)
4. For live mode, verify business verification is complete

### Klarna Not Available
- Customer must be in UK, EU, US, Canada, or Australia
- Order total must meet minimum (usually £35+)
- Currency must be supported (GBP ✅)
- Business verification may be pending

### PayPal Not Working
- Ensure PayPal is enabled in both test and live mode
- Check that redirect URLs are whitelisted
- Verify webhook is receiving PayPal events

### Customer Sees "Payment Method Not Available"
- Payment method may not be available in their country
- Their bank may not support the method
- Browser blocking cookies (for PayPal/Link)

---

## Important Notes

1. **Automatic Display**: The Payment Element will automatically show only payment methods that are:
   - Enabled in your Stripe Dashboard
   - Available in the customer's country
   - Supported for the transaction currency

2. **No Code Changes Needed**: The code is already set up to handle all these payment methods automatically using Stripe's `PaymentElement` component.

3. **Sequential Rollout**: You can enable payment methods one at a time:
   - Start with cards (already enabled)
   - Add Klarna for UK/EU customers
   - Add PayPal for global reach
   - Add Revolut Pay for Revolut users

4. **Customer Experience**: With multiple payment methods enabled, customers will see tabs/options at checkout to choose their preferred method.

---

## Support

If you encounter issues:
1. Check [Stripe Dashboard](https://dashboard.stripe.com/) for payment status
2. Review [Stripe Logs](https://dashboard.stripe.com/logs) for errors
3. Contact Stripe Support: https://support.stripe.com/
4. Check webhook events for failed payments

---

## Summary

✅ **Code is ready** - No code changes needed
✅ **Just enable methods** - Go to Stripe Dashboard → Settings → Payment methods
✅ **Test first** - Enable in test mode before going live
✅ **Verify business** - Some methods require business verification for live mode

Your customers will automatically see all enabled payment methods at checkout! 🎉
