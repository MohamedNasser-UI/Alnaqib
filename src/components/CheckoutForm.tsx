'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCartStore } from '@/store/cart';
import { getProductBySlug, getPrice } from '@/lib/products';
import { GOVERNORATES, DELIVERY_FLAT_RATE_EGP } from '@/lib/constants';

export function CheckoutForm() {
  const t = useTranslations('checkout');
  const tCommon = useTranslations('common');
  const pathname = usePathname();
  const router = useRouter();
  const locale = pathname.startsWith('/ar') ? 'ar' : 'en';
  const base = locale === 'ar' ? '/ar' : '';
  const items = useCartStore((s) => s.items);
  const subtotalEgp = useCartStore((s) => s.totalEgp());
  const totalEgp = subtotalEgp + DELIVERY_FLAT_RATE_EGP;
  const clearCart = useCartStore((s) => s.clearCart);

  const [address, setAddress] = useState('');
  const [governorate, setGovernorate] = useState('');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const governorateLabel = (g: (typeof GOVERNORATES)[number]) =>
    locale === 'ar' ? g.labelAr : g.labelEn;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!address.trim() || !governorate || !mobile.trim()) {
      setError(locale === 'ar' ? 'يرجى تعبئة جميع الحقول.' : 'Please fill all fields.');
      return;
    }
    if (items.length === 0) {
      setError(locale === 'ar' ? 'السلة فارغة.' : 'Your cart is empty.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: address.trim(),
          governorate,
          mobile: mobile.trim(),
          locale,
          items: items.map((i) => ({
            slug: i.slug,
            size: i.size,
            quantity: i.quantity,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Checkout failed');
      if (data.paymentUrl) {
        clearCart();
        window.location.href = data.paymentUrl;
        return;
      }
      throw new Error('No payment URL');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0 && !loading) {
    router.push(base || '/');
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
      <div className="rounded-xl border border-stone-200 bg-stone-50 p-6 dark:border-amber-900/40 dark:bg-stone-900/30">
        <h2 className="mb-4 text-lg font-semibold text-stone-800 dark:text-stone-200">
          {t('deliveryDetails')}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-600 dark:text-stone-400">
              {t('address')}
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={t('addressPlaceholder')}
              className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-600 dark:text-stone-400">
              {t('governorate')}
            </label>
            <select
              value={governorate}
              onChange={(e) => setGovernorate(e.target.value)}
              className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
            >
              <option value="">{t('governoratePlaceholder')}</option>
              {GOVERNORATES.map((g) => (
                <option key={g.value} value={g.value}>
                  {governorateLabel(g)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-600 dark:text-stone-400">
              {t('mobile')}
            </label>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder={t('mobilePlaceholder')}
              className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-500"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-stone-200 bg-stone-50 p-6 dark:border-amber-900/40 dark:bg-stone-900/30">
        <h2 className="mb-4 text-lg font-semibold text-stone-800 dark:text-stone-200">
          {t('orderSummary')}
        </h2>
        <ul className="space-y-2">
          {items.map((item) => {
            const product = getProductBySlug(item.slug);
            if (!product) return null;
            const name = locale === 'ar' ? product.nameAr : product.nameEn;
            const price = getPrice(product, item.size);
            return (
              <li
                key={`${item.slug}-${item.size}`}
                className="flex justify-between text-stone-600 dark:text-stone-300"
              >
                <span>
                  {name} {item.size}ml × {item.quantity}
                </span>
                <span className="text-amber-400">
                  {(price * item.quantity).toLocaleString('en-EG')} {tCommon('egp')}
                </span>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 flex justify-between text-stone-600 dark:text-stone-300">
          <span>{tCommon('subtotal')}</span>
          <span>{subtotalEgp.toLocaleString('en-EG')} {tCommon('egp')}</span>
        </p>
        <p className="flex justify-between text-stone-600 dark:text-stone-300">
          <span>{tCommon('delivery')}</span>
          <span>{DELIVERY_FLAT_RATE_EGP.toLocaleString('en-EG')} {tCommon('egp')}</span>
        </p>
        <p className="mt-2 flex justify-between text-lg font-bold text-stone-900 dark:text-stone-100">
          <span>{tCommon('total')}</span>
          <span className="text-amber-700 dark:text-amber-400">
            {totalEgp.toLocaleString('en-EG')} {tCommon('egp')}
          </span>
        </p>
      </div>

      {error && (
        <p className="rounded-lg bg-red-100 px-4 py-2 text-red-700 dark:bg-red-900/30 dark:text-red-300">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-gold w-full rounded-lg py-4 text-lg disabled:opacity-60"
      >
        {loading ? tCommon('loading') : t('proceedToPay')}
      </button>
    </form>
  );
}
