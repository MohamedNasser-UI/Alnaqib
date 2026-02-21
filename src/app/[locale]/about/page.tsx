import { getTranslations } from 'next-intl/server';

export default async function AboutPage() {
  const t = await getTranslations('about');
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">{t('title')}</h1>
      <p className="mt-6 text-stone-600 dark:text-stone-300">{t('intro')}</p>
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-amber-700 dark:text-amber-400">{t('mission')}</h2>
        <p className="mt-2 text-stone-600 dark:text-stone-300">{t('missionText')}</p>
      </section>
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-amber-700 dark:text-amber-400">{t('story')}</h2>
        <p className="mt-2 text-stone-600 dark:text-stone-300">{t('storyText')}</p>
      </section>
    </div>
  );
}
