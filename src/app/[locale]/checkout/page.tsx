import { getTranslations } from 'next-intl/server';
import { CheckoutForm } from '@/components/CheckoutForm';

export default async function CheckoutPage() {
  const t = await getTranslations('checkout');
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">{t('title')}</h1>
      <CheckoutForm />
    </div>
  );
}
