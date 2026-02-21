import { BOTTLE_SIZES, type BottleSize } from './constants';

export type ProductSlug = 'mystic-orchid' | 'sultan-afghani' | 'needs';

/** Fragrance note id for display below product image. Image path: /images/notes/{id}.png */
export type FragranceNoteId = 'vanilla' | 'tobacco' | 'lemon' | 'orchid' | 'oud' | 'amber' | 'rose' | 'saffron' | 'cedar' | 'musk';

/** Category id for filtering. Add more (e.g. floral, woody) when you have more products. */
export type ProductCategoryId = 'all' | 'best-sellers' | 'new-arrivals';

export interface ProductPriceBySize {
  35: number;
  55: number;
  110: number;
}

export interface Product {
  slug: ProductSlug;
  nameEn: string;
  nameAr: string;
  image: string;
  /** Price in EGP per size */
  prices: ProductPriceBySize;
  /** Fragrance notes shown as small images below the main product image */
  notes?: FragranceNoteId[];
  isBestSeller?: boolean;
  isNewLaunch?: boolean;
  /** Optional: for future category filtering (e.g. 'floral', 'woody') */
  category?: string;
}

/**
 * Placeholder prices in EGP. Update with real prices.
 * Keys: 35, 55, 110 (ml).
 */
const PRICES: Record<ProductSlug, ProductPriceBySize> = {
  'mystic-orchid': { 35: 299, 55: 449, 110: 749 },
  'sultan-afghani': { 35: 299, 55: 449, 110: 749 },
  needs: { 35: 299, 55: 449, 110: 749 },
};

const PRODUCTS: Product[] = [
  {
    slug: 'mystic-orchid',
    nameEn: 'Mystic Orchid',
    nameAr: 'مستيك أوركيد',
    image: '/images/mystic-orchid.png',
    prices: PRICES['mystic-orchid'],
    notes: ['orchid', 'vanilla', 'amber'],
    isBestSeller: true,
    isNewLaunch: true,
  },
  {
    slug: 'sultan-afghani',
    nameEn: 'Sultan Afghani',
    nameAr: 'سلطان أفغاني',
    image: '/images/sultan-afghani.png',
    prices: PRICES['sultan-afghani'],
    notes: ['vanilla', 'tobacco', 'lemon'],
    isBestSeller: true,
    isNewLaunch: false,
  },
  {
    slug: 'needs',
    nameEn: 'Needs',
    nameAr: 'نيدز',
    image: '/images/needs.png',
    prices: PRICES.needs,
    notes: ['oud', 'saffron', 'cedar'],
    isBestSeller: false,
    isNewLaunch: true,
  },
];

export function getProducts(): Product[] {
  return PRODUCTS;
}

export function getBestSellers(): Product[] {
  return PRODUCTS.filter((p) => p.isBestSeller);
}

export function getNewLaunches(): Product[] {
  return PRODUCTS.filter((p) => p.isNewLaunch);
}

export function getProductsByCategory(categoryId: ProductCategoryId): Product[] {
  if (categoryId === 'best-sellers') return getBestSellers();
  if (categoryId === 'new-arrivals') return getNewLaunches();
  return PRODUCTS;
}

/** Categories for the home page "Shop by category" section. labelKey is used with useTranslations('home'). */
export const CATEGORIES: { id: ProductCategoryId; labelKey: string }[] = [
  { id: 'all', labelKey: 'categoryAll' },
  { id: 'best-sellers', labelKey: 'categoryBestSellers' },
  { id: 'new-arrivals', labelKey: 'categoryNewArrivals' },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getPrice(product: Product, size: BottleSize): number {
  return product.prices[size];
}

export { BOTTLE_SIZES };
