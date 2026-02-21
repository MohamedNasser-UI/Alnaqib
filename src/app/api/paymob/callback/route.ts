import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { verifyPaymobCallback } from '@/lib/paymob';

/**
 * Paymob server-to-server callback (transaction feedback).
 * Paymob sends POST with JSON body. Verify HMAC then update order.
 * Expects body.obj to contain: success, order.merchant_order_id (our UUID), id (transaction id).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const obj = body.obj ?? body;
    const merchantOrderId = (obj.order as { merchant_order_id?: string } | undefined)?.merchant_order_id;
    if (!merchantOrderId) {
      return NextResponse.json({ message: 'No merchant_order_id' }, { status: 400 });
    }

    const verified = verifyPaymobCallback(obj);
    const newStatus = verified.success ? 'paid' : 'failed';

    const { error } = await supabaseAdmin
      .from('orders')
      .update({
        payment_status: newStatus,
        paymob_transaction_id: verified.transactionId ?? null,
      })
      .eq('id', merchantOrderId);

    if (error) {
      console.error('Callback update order error:', error);
      return NextResponse.json({ message: 'Update failed' }, { status: 500 });
    }
    return NextResponse.json({ message: 'OK', status: newStatus });
  } catch (err) {
    console.error('Paymob callback error:', err);
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}
