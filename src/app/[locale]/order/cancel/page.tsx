import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export default async function OrderCancelPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const base = locale === 'ar' ? '/ar' : '';
  const t = await getTranslations('order');
  const tCommon = await getTranslations('common');
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <div className="rounded-2xl border border-stone-200 bg-stone-50 p-10 dark:border-amber-900/40 dark:bg-stone-900/30">
        <h1 className="text-2xl font-bold text-stone-800 dark:text-stone-300">{t('cancelTitle')}</h1>
        <p className="mt-4 text-stone-600 dark:text-stone-400">{t('cancelMessage')}</p>
        <Link
          href={`${base}/cart`}
          className="btn-gold mt-8 inline-block rounded-lg px-8 py-3"
        >
          {tCommon('cart')}
        </Link>
      </div>
    </div>
  );
}
