import { getTranslations } from 'next-intl/server';

export default async function RefundPolicyPage() {
  const t = await getTranslations('refundPolicy');
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">{t('title')}</h1>
      <p className="mt-2 text-sm text-stone-500">
        {t('lastUpdated')}: February 2025
      </p>
      <p className="mt-6 text-stone-600 dark:text-stone-300">{t('intro')}</p>
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-amber-700 dark:text-amber-400">{t('eligibility')}</h2>
        <p className="mt-2 text-stone-600 dark:text-stone-300">{t('eligibilityText')}</p>
      </section>
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-amber-700 dark:text-amber-400">{t('process')}</h2>
        <p className="mt-2 text-stone-600 dark:text-stone-300">{t('processText')}</p>
      </section>
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-amber-700 dark:text-amber-400">{t('delivery')}</h2>
        <p className="mt-2 text-stone-600 dark:text-stone-300">{t('deliveryText')}</p>
      </section>
    </div>
  );
}
