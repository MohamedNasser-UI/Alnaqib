# Alnaqib Fragrances – E‑commerce (Egypt)

Perfume e‑commerce site for **Alnaqib fragrances** (imitation perfumes). Bilingual (Arabic / English), guest checkout, Paymob payment, Supabase for orders. Egypt only, EGP.

## Features

- **Bilingual**: Arabic (RTL) and English via `next-intl`
- **No registration**: Add to cart → Checkout (address, governorate, mobile) → Pay with Paymob
- **Paymob**: Redirect to Paymob iframe; server callback updates order status
- **Supabase**: Orders and order items stored for fulfillment
- **27 Egyptian governorates** in checkout
- **Bottle sizes**: 35ml, 55ml, 110ml per product
- **Flat delivery rate** (EGP) shown in cart, checkout, and footer; configurable in `src/lib/constants.ts`
- **About Us, Contact Us, Refund Policy, Privacy Policy** pages (bilingual)
- **Social links** (Facebook, Instagram, WhatsApp) in footer; edit `src/lib/site.ts`

## Setup

### 1. Install and run

```bash
npm install
cp .env.example .env.local
# Edit .env.local with your keys
npm run dev
```

### 2. Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In SQL Editor, run the migration:

```bash
# From project root, run the SQL in:
supabase/migrations/001_orders.sql
```

3. In Supabase: **Settings → API** copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **service_role** (secret) → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Paymob

From your Paymob merchant dashboard:

- **API Key** → `PAYMOB_API_KEY`
- **Integration ID** (Accept payment) → `PAYMOB_INTEGRATION_ID`
- **Iframe ID** (Accept iframe) → `PAYMOB_IFRAME_ID`
- **HMAC secret** (for callback verification) → `PAYMOB_HMAC_SECRET`

Set your **Transaction Feedback URL** in Paymob to:

`https://your-domain.com/api/paymob/callback`

If the callback HMAC fails, check Paymob’s docs for the exact HMAC field order and adjust `src/lib/paymob.ts` (`verifyPaymobCallback`).

### 4. Images

Place in `public/images/`:

- `logo.png` – brand logo
- `mystic-orchid.png`, `sultan-afghani.png`, `needs.png` – product images

(Or keep the copies created there during setup.)

## Project structure

- `src/app/[locale]/` – localized pages (home, cart, checkout, order/success, order/cancel)
- `src/components/` – Header, Footer, ProductCard, CartContent, CheckoutForm
- `src/lib/` – products, constants (governorates, sizes), Supabase server client, Paymob
- `src/store/cart.ts` – cart state (Zustand, persisted)
- `messages/` – `en.json`, `ar.json`
- `supabase/migrations/` – orders and order_items schema

## Prices

Placeholder EGP prices are in `src/lib/products.ts`. Edit the `PRICES` map and product list to add or change products and sizes.

## Delivery & contact

- **Flat delivery rate**: Set `DELIVERY_FLAT_RATE_EGP` in `src/lib/constants.ts` (default 50 EGP). It is included in cart and checkout totals and shown in the footer.
- **Contact & social**: Edit `src/lib/site.ts` to set `CONTACT` (email, phone, WhatsApp) and `SOCIAL_LINKS` (Facebook, Instagram, WhatsApp, Twitter). Links appear on the Contact page and in the footer.

## Adding products

1. Add slug, names, image path, and prices in `src/lib/products.ts`.
2. Add the image under `public/images/`.

## Build & deploy

```bash
npm run build
npm start
```

Use **Node 18+**. Set all env vars in your hosting (Vercel, etc.) and point Paymob’s callback URL to your deployed `/api/paymob/callback`.
