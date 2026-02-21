import { getTranslations } from 'next-intl/server';

export default async function PrivacyPolicyPage() {
  const t = await getTranslations('privacyPolicy');
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">{t('title')}</h1>
      <p className="mt-2 text-sm text-stone-500">
        {t('lastUpdated')}: February 2025
      </p>
      <p className="mt-6 text-stone-600 dark:text-stone-300">{t('intro')}</p>
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-amber-700 dark:text-amber-400">{t('collect')}</h2>
        <p className="mt-2 text-stone-600 dark:text-stone-300">{t('collectText')}</p>
      </section>
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-amber-700 dark:text-amber-400">{t('use')}</h2>
        <p className="mt-2 text-stone-600 dark:text-stone-300">{t('useText')}</p>
      </section>
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-amber-700 dark:text-amber-400">{t('contact')}</h2>
        <p className="mt-2 text-stone-600 dark:text-stone-300">{t('contactText')}</p>
      </section>
    </div>
  );
}
