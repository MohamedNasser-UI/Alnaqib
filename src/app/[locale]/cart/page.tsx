import { getTranslations } from 'next-intl/server';
import { CartContent } from '@/components/CartContent';

export default async function CartPage() {
  const t = await getTranslations('common');
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">{t('yourCart')}</h1>
      <CartContent />
    </div>
  );
}
