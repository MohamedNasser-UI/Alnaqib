/**
 * Paymob Accept (Egypt) integration.
 * 1. Authenticate -> get auth_token
 * 2. Register order -> get order_id
 * 3. Payment key request -> get payment_key
 * 4. Redirect user to: https://accept.paymob.com/api/acceptance/iframes/{iframe_id}?payment_token={payment_key}
 * Callback: Paymob sends server-to-server with HMAC; we verify and update order.
 */

const PAYMOB_API = 'https://accept.paymob.com/api';

export interface PaymobConfig {
  apiKey: string;
  integrationId: number;
  iframeId: number;
  hmacSecret: string;
}

function getConfig(): PaymobConfig {
  const apiKey = process.env.PAYMOB_API_KEY;
  const integrationId = process.env.PAYMOB_INTEGRATION_ID;
  const iframeId = process.env.PAYMOB_IFRAME_ID;
  const hmacSecret = process.env.PAYMOB_HMAC_SECRET;
  if (!apiKey || !integrationId || !iframeId || !hmacSecret) {
    throw new Error(
      'Missing Paymob env: PAYMOB_API_KEY, PAYMOB_INTEGRATION_ID, PAYMOB_IFRAME_ID, PAYMOB_HMAC_SECRET'
    );
  }
  return {
    apiKey,
    integrationId: Number(integrationId),
    iframeId: Number(iframeId),
    hmacSecret,
  };
}

/** Step 1: Get auth token */
async function getAuthToken(apiKey: string): Promise<string> {
  const res = await fetch(`${PAYMOB_API}/auth/tokens`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key: apiKey }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Paymob auth failed: ${res.status} ${text}`);
  }
  const data = await res.json();
  if (!data.token) throw new Error('Paymob auth: no token');
  return data.token;
}

/** Step 2: Register order at Paymob. Returns Paymob order id. */
async function registerOrder(
  authToken: string,
  merchantOrderId: string,
  amountCents: number,
  currency: string = 'EGP'
): Promise<number> {
  const res = await fetch(`${PAYMOB_API}/ecommerce/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      auth_token: authToken,
      delivery_needed: 'false',
      amount_cents: Math.round(amountCents),
      currency,
      merchant_order_id: merchantOrderId,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Paymob register order failed: ${res.status} ${text}`);
  }
  const data = await res.json();
  if (data.id == null) throw new Error('Paymob register order: no id');
  return data.id;
}

/** Step 3: Get payment key. Returns payment_key for iframe URL. */
async function getPaymentKey(
  authToken: string,
  config: PaymobConfig,
  paymobOrderId: number,
  amountCents: number,
  callbackUrl: string,
  billingData: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    country: string;
    city: string;
    street: string;
  }
): Promise<string> {
  const res = await fetch(`${PAYMOB_API}/acceptance/payment_keys`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      auth_token: authToken,
      amount_cents: Math.round(amountCents),
      expiration: 3600,
      order_id: paymobOrderId,
      billing_data: billingData,
      currency: 'EGP',
      integration_id: config.integrationId,
      lock_order_when_paid: 'false',
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Paymob payment key failed: ${res.status} ${text}`);
  }
  const data = await res.json();
  if (!data.token) throw new Error('Paymob payment key: no token');
  return data.token;
}

/** Build full iframe URL for redirect */
export function buildPaymentUrl(paymentKey: string, iframeId: number): string {
  return `https://accept.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${paymentKey}`;
}

/** Full flow: auth -> register order -> payment key -> return redirect URL */
export async function createPaymentUrl(params: {
  merchantOrderId: string;
  amountEgp: number;
  callbackBaseUrl: string;
  customer: { address: string; governorate: string; mobile: string };
}): Promise<string> {
  const config = getConfig();
  const authToken = await getAuthToken(config.apiKey);
  const amountCents = params.amountEgp * 100;
  const paymobOrderId = await registerOrder(
    authToken,
    params.merchantOrderId,
    amountCents
  );
  const billingData = {
    first_name: 'Customer',
    last_name: params.customer.governorate,
    email: 'customer@alnaqib.eg',
    phone_number: params.customer.mobile.replace(/\D/g, '').slice(-11) || '01000000000',
    country: 'EGY',
    city: params.customer.governorate,
    street: params.customer.address.slice(0, 100),
  };
  const paymentKey = await getPaymentKey(
    authToken,
    config,
    paymobOrderId,
    amountCents,
    params.callbackBaseUrl,
    billingData
  );
  return buildPaymentUrl(paymentKey, config.iframeId);
}

/** Verify Paymob callback HMAC and return payload if valid */
export function verifyPaymobCallback(obj: Record<string, unknown>): {
  success: boolean;
  orderId?: string;
  transactionId?: string;
} {
  const config = getConfig();
  const hmaced = obj.hmac as string | undefined;
  if (!hmaced) return { success: false };

  const concat = [
    obj.amount_cents,
    obj.created_at,
    obj.currency,
    obj.error_occured,
    obj.has_parent_transaction,
    obj.id,
    obj.integration_id,
    obj.is_3d_secure,
    obj.is_auth,
    obj.is_capture,
    obj.is_refunded,
    obj.is_standalone_payment,
    obj.order?.id,
    obj.owner,
    obj.pending,
    obj.source_data?.pan,
    obj.source_data?.sub_type,
    obj.source_data?.type,
    obj.success,
  ]
    .filter((v) => v !== undefined && v !== null)
    .join('');

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const crypto = require('crypto');
  const computed = crypto.createHmac('sha512', config.hmacSecret)
    .update(concat)
    .digest('hex');
  if (computed !== hmaced) return { success: false };

  const success = obj.success === true;
  const orderId = (obj.order as { id?: number })?.id?.toString();
  const transactionId = obj.id?.toString();
  return { success, orderId, transactionId };
}
