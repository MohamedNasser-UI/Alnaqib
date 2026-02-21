'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCartStore } from '@/store/cart';
import { getProductBySlug, getPrice } from '@/lib/products';
import { DELIVERY_FLAT_RATE_EGP } from '@/lib/constants';

export function CartContent() {
  const t = useTranslations('common');
  const tCart = useTranslations('cart');
  const pathname = usePathname();
  const locale = pathname.startsWith('/ar') ? 'ar' : 'en';
  const base = locale === 'ar' ? '/ar' : '';
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const totalEgp = useCartStore((s) => s.totalEgp());

  if (items.length === 0) {
    return (
      <div className="mt-8 rounded-2xl border border-stone-200 bg-stone-100 p-12 text-center dark:border-amber-900/40 dark:bg-stone-900/30">
        <p className="text-lg text-stone-600 dark:text-stone-400">{tCart('empty')}</p>
        <p className="mt-1 text-sm text-stone-500">{tCart('emptyHint')}</p>
        <Link
          href={base || '/'}
          className="btn-gold mt-6 inline-block rounded-lg px-6 py-3"
        >
          {t('continueShopping')}
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-6">
      <ul className="space-y-4">
        {items.map((item) => {
          const product = getProductBySlug(item.slug);
          if (!product) return null;
          const name = locale === 'ar' ? product.nameAr : product.nameEn;
          const price = getPrice(product, item.size);
          const lineTotal = price * item.quantity;
          return (
            <li
              key={`${item.slug}-${item.size}`}
              className="flex flex-col gap-4 rounded-xl border border-stone-200 bg-stone-50 p-4 sm:flex-row sm:items-center dark:border-amber-900/40 dark:bg-stone-900/30"
            >
              <div className="relative h-32 w-28 flex-shrink-0 overflow-hidden rounded-lg bg-stone-200 flex items-center justify-center dark:bg-stone-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt={name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-stone-900 dark:text-stone-100">{name}</h3>
                <p className="text-sm text-amber-700 dark:text-amber-500/90">
                  {item.size} ml · {price.toLocaleString('en-EG')} {t('egp')} each
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <select
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.slug, item.size, Number(e.target.value))
                    }
                    className="rounded border border-stone-400 bg-stone-100 px-2 py-1 text-stone-800 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-200"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removeItem(item.slug, item.size)}
                    className="text-sm text-red-400 hover:text-red-300"
                  >
                    {t('remove')}
                  </button>
                </div>
              </div>
              <div className="text-lg font-semibold text-amber-700 sm:text-end dark:text-amber-400">
                {lineTotal.toLocaleString('en-EG')} {t('egp')}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="flex flex-col items-end gap-2 border-t border-amber-900/40 pt-6">
        <p className="flex justify-between gap-8 text-stone-600 dark:text-stone-300">
          <span>{t('subtotal')}</span>
          <span>{totalEgp.toLocaleString('en-EG')} {t('egp')}</span>
        </p>
        <p className="flex justify-between gap-8 text-stone-600 dark:text-stone-300">
          <span>{t('delivery')}</span>
          <span>{DELIVERY_FLAT_RATE_EGP.toLocaleString('en-EG')} {t('egp')}</span>
        </p>
        <p className="text-xl font-bold text-stone-900 dark:text-stone-100">
          {t('total')}: {(totalEgp + DELIVERY_FLAT_RATE_EGP).toLocaleString('en-EG')} {t('egp')}
        </p>
        <Link
          href={`${base}/checkout`}
          className="btn-gold rounded-lg px-8 py-3"
        >
          {t('checkout')}
        </Link>
      </div>
    </div>
  );
}
