'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  getBestSellers,
  getNewLaunches,
  getProductsByCategory,
  CATEGORIES,
  type ProductCategoryId,
} from '@/lib/products';
import { ProductGrid } from './ProductGrid';

export function HomeSections() {
  const t = useTranslations('home');
  const [category, setCategory] = useState<ProductCategoryId>('all');
  const bestSellers = getBestSellers();
  const newLaunches = getNewLaunches();
  const categoryProducts = getProductsByCategory(category);

  return (
    <>
      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <h2 className="mb-8 text-center text-2xl font-semibold text-stone-800 dark:text-stone-200">
            {t('bestSellers')}
          </h2>
          <ProductGrid products={bestSellers} />
        </section>
      )}

      {/* New Launch */}
      {newLaunches.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <h2 className="mb-8 text-center text-2xl font-semibold text-stone-800 dark:text-stone-200">
            {t('newLaunch')}
          </h2>
          <ProductGrid products={newLaunches} />
        </section>
      )}

      {/* Categories + Our Fragrances grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h2 className="mb-2 text-center text-2xl font-semibold text-stone-800 dark:text-stone-200">
          {t('categories')}
        </h2>
        <p className="mb-8 text-center text-stone-500 dark:text-stone-400">{t('shopByCategory')}</p>
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                category === cat.id
                  ? 'bg-amber-500 text-black'
                  : 'border border-stone-400 text-stone-600 hover:border-amber-600 hover:text-amber-700 dark:border-stone-600 dark:text-stone-300 dark:hover:border-amber-600 dark:hover:text-amber-400'
              }`}
            >
              {t(cat.labelKey)}
            </button>
          ))}
        </div>
        <h3 className="mb-6 text-center text-lg font-medium text-stone-600 dark:text-stone-300">
          {t('featured')}
        </h3>
        <ProductGrid products={categoryProducts} />
      </section>
    </>
  );
}
