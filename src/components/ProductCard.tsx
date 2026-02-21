'use client';

import { useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import type { Product } from '@/lib/products';
import type { BottleSize } from '@/lib/constants';
import { BOTTLE_SIZES, getPrice } from '@/lib/products';
import { useCartStore } from '@/store/cart';

const PARTICLE_COUNT = 24;
const MIN_DISTANCE = 60;
const MAX_DISTANCE = 200;
const MIN_DURATION = 500;
const MAX_DURATION = 1000;

interface BurstParticle {
  id: number;
  src: string;
  x: number;
  y: number;
  tx: number;
  ty: number;
  rot: number;
  dur: number;
  delay: number;
}

interface ProductCardProps {
  product: Product;
  name: string;
}

export function ProductCard({ product, name }: ProductCardProps) {
  const t = useTranslations('common');
  const tProduct = useTranslations('product');
  const [selectedSize, setSelectedSize] = useState<BottleSize | null>(null);
  const [burst, setBurst] = useState<BurstParticle[] | null>(null);
  const idRef = useRef(0);
  const addItem = useCartStore((s) => s.addItem);

  const price = selectedSize ? getPrice(product, selectedSize) : null;

  const handleNoteClick = useCallback(
    (e: React.MouseEvent, noteId: string) => {
      e.preventDefault();
      const src = `/images/notes/${noteId}.png`;
      const x = e.clientX;
      const y = e.clientY;
      const particles: BurstParticle[] = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const angle = (Math.PI * 2 * i) / PARTICLE_COUNT + Math.random() * 0.5;
        const distance = MIN_DISTANCE + Math.random() * (MAX_DISTANCE - MIN_DISTANCE);
        particles.push({
          id: idRef.current++,
          src,
          x,
          y,
          tx: Math.cos(angle) * distance,
          ty: Math.sin(angle) * distance,
          rot: (Math.random() - 0.5) * 720,
          dur: MIN_DURATION + Math.random() * (MAX_DURATION - MIN_DURATION),
          delay: Math.random() * 80,
        });
      }
      setBurst(particles);
      const maxTime = Math.max(...particles.map((p) => p.delay + p.dur)) + 50;
      setTimeout(() => setBurst(null), maxTime);
    },
    []
  );

  function handleAdd() {
    if (!selectedSize) return;
    addItem(product.slug, selectedSize, 1);
  }

  return (
    <article className="card-hover flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-amber-900/40 dark:bg-stone-900/50 dark:shadow-none">
      <div className="relative aspect-[3/4] bg-stone-100 flex items-center justify-center p-4 dark:bg-stone-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={name}
          className="max-h-full w-auto max-w-full object-contain"
        />
      </div>
      {product.notes && product.notes.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1.5 px-3 py-2 bg-stone-50 dark:bg-stone-900/80 border-b border-stone-200 dark:border-amber-900/30">
          {product.notes.map((noteId) => (
            <button
              key={noteId}
              type="button"
              onClick={(e) => handleNoteClick(e, noteId)}
              className="h-8 w-8 rounded-full overflow-hidden border border-stone-200 dark:border-stone-600 cursor-pointer hover:scale-110 hover:ring-2 hover:ring-amber-500/50 transition-transform focus:outline-none focus:ring-2 focus:ring-amber-500"
              title={tProduct(`notes.${noteId}`)}
              aria-label={tProduct(`notes.${noteId}`)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/images/notes/${noteId}.png`}
                alt={tProduct(`notes.${noteId}`)}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-100">{name}</h3>
        <p className="mt-0.5 text-sm text-amber-700 dark:text-amber-600/90">{tProduct('extrait')}</p>

        <div className="mt-4">
          <p className="mb-2 text-sm font-medium text-stone-500 dark:text-stone-400">{t('selectSize')}</p>
          <div className="flex flex-wrap gap-2">
            {BOTTLE_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                  selectedSize === size
                    ? 'border-amber-500 bg-amber-100 text-amber-800 dark:border-amber-500 dark:bg-amber-500/20 dark:text-amber-300'
                    : 'border-stone-400 text-stone-600 hover:border-amber-600 hover:text-amber-700 dark:border-stone-600 dark:text-stone-400 dark:hover:border-amber-700 dark:hover:text-amber-400'
                }`}
              >
                {size} ml
              </button>
            ))}
          </div>
        </div>

        {price != null && (
          <p className="mt-3 text-lg font-semibold text-amber-700 dark:text-amber-400">
            {price.toLocaleString('en-EG')} {t('egp')}
          </p>
        )}

        <button
          type="button"
          onClick={handleAdd}
          disabled={!selectedSize}
          className="btn-gold mt-4 w-full rounded-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('addToCart')}
        </button>
      </div>

      {typeof document !== 'undefined' &&
        burst &&
        createPortal(
          <div className="fixed inset-0 pointer-events-none" aria-hidden>
            {burst.map((p) => (
              <div
                key={p.id}
                className="note-burst-particle"
                style={{
                  left: p.x,
                  top: p.y,
                  backgroundImage: `url(${p.src})`,
                  ['--tx' as string]: `${p.tx}px`,
                  ['--ty' as string]: `${p.ty}px`,
                  ['--rot' as string]: `${p.rot}deg`,
                  ['--dur' as string]: `${p.dur}ms`,
                  ['--delay' as string]: `${p.delay}ms`,
                }}
              />
            ))}
          </div>,
          document.body
        )}
    </article>
  );
}
