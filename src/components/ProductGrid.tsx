'use client';

import { useLocale } from 'next-intl';
import type { Product } from '@/lib/products';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  /** If not provided, no products are shown. Parent should pass getProducts() or filtered list. */
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const locale = useLocale();
  const isAr = locale === 'ar';

  if (products.length === 0) {
    return (
      <p className="text-center text-stone-500 dark:text-stone-400">
        {locale === 'ar' ? 'لا توجد منتجات في هذه الفئة.' : 'No products in this category.'}
      </p>
    );
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.slug}
          product={product}
          name={isAr ? product.nameAr : product.nameEn}
        />
      ))}
    </div>
  );
}
