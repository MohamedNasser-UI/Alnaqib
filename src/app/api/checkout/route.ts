import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { createPaymentUrl } from '@/lib/paymob';
import { getProductBySlug, getPrice } from '@/lib/products';
import { DELIVERY_FLAT_RATE_EGP } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, governorate, mobile, locale, items } = body;
    if (!address || !governorate || !mobile || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing address, governorate, mobile, or items' },
        { status: 400 }
      );
    }

    const subtotalEgp = items.reduce((sum: number, item: { slug: string; size: number; quantity: number }) => {
      const product = getProductBySlug(item.slug);
      if (!product) return sum;
      return sum + getPrice(product, item.size as 35 | 55 | 110) * item.quantity;
    }, 0);
    const totalEgp = subtotalEgp + DELIVERY_FLAT_RATE_EGP;

    const orderItemsInsert = items.map((item: { slug: string; size: number; quantity: number }) => {
      const product = getProductBySlug(item.slug);
      if (!product) return null;
      const price = getPrice(product, item.size as 35 | 55 | 110);
      return {
        product_slug: item.slug,
        product_name_ar: product.nameAr,
        product_name_en: product.nameEn,
        size_ml: item.size,
        quantity: item.quantity,
        price_egp: price,
      };
    }).filter(Boolean);

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        address,
        governorate,
        mobile,
        total_egp: totalEgp,
        payment_status: 'pending',
        locale: locale || 'en',
      })
      .select('id')
      .single();

    if (orderError || !order) {
      console.error('Supabase order insert error:', orderError);
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    const { error: itemsError } = await supabaseAdmin.from('order_items').insert(
      orderItemsInsert.map((row: Record<string, unknown>) => ({ ...row, order_id: order.id }))
    );
    if (itemsError) {
      console.error('Supabase order_items insert error:', itemsError);
      await supabaseAdmin.from('orders').delete().eq('id', order.id);
      return NextResponse.json({ error: 'Failed to create order items' }, { status: 500 });
    }

    const baseUrl = request.nextUrl.origin;
    const callbackPath = '/api/paymob/callback';
    const paymentUrl = await createPaymentUrl({
      merchantOrderId: order.id,
      amountEgp: totalEgp,
      callbackBaseUrl: `${baseUrl}${callbackPath}`,
      customer: { address, governorate, mobile },
    });

    return NextResponse.json({ paymentUrl, orderId: order.id });
  } catch (err) {
    console.error('Checkout error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Checkout failed' },
      { status: 500 }
    );
  }
}
