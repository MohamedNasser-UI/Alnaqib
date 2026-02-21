import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { CONTACT } from '@/lib/site';

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const base = locale === 'ar' ? '/ar' : '';
  const t = await getTranslations('contact');
  const tCommon = await getTranslations('common');

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">{t('title')}</h1>
      <p className="mt-4 text-stone-600 dark:text-stone-300">{t('subtitle')}</p>

      <div className="mt-10 space-y-6 rounded-xl border border-stone-200 bg-stone-50 p-6 dark:border-amber-900/40 dark:bg-stone-900/30">
        <div>
          <span className="text-sm font-medium text-amber-700 dark:text-amber-500/90">{t('email')}</span>
          <a
            href={`mailto:${CONTACT.email}`}
            className="mt-1 block text-stone-900 underline hover:text-amber-600 dark:text-stone-100 dark:hover:text-amber-400"
          >
            {CONTACT.email}
          </a>
        </div>
        <div>
          <span className="text-sm font-medium text-amber-700 dark:text-amber-500/90">{t('phone')}</span>
          <a
            href={`tel:${CONTACT.phone}`}
            className="mt-1 block text-stone-900 underline hover:text-amber-600 dark:text-stone-100 dark:hover:text-amber-400"
          >
            {CONTACT.phone}
          </a>
        </div>
        <div>
          <span className="text-sm font-medium text-amber-700 dark:text-amber-500/90">{t('whatsapp')}</span>
          <a
            href={`https://wa.me/${CONTACT.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block text-stone-900 underline hover:text-amber-600 dark:text-stone-100 dark:hover:text-amber-400"
          >
            {CONTACT.phone}
          </a>
        </div>
      </div>

      <p className="mt-8 text-stone-500 dark:text-stone-400">
        {t('sendMessage')} — {CONTACT.email}
      </p>
      <Link
        href={base || '/'}
        className="mt-6 inline-block text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
      >
        ← {tCommon('continueShopping')}
      </Link>
    </div>
  );
}
