'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { useCartStore } from '@/store/cart';
import { useTheme } from '@/contexts/ThemeContext';
import { useNavRouter, useNavPathname } from '@/navigation';

const LOGO_SRC = '/images/logo.png';

function SunIcon() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
      <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export function Header() {
  const t = useTranslations('nav');
  const locale = useLocale() as 'en' | 'ar';
  const pathname = useNavPathname();
  const router = useNavRouter();
  const count = useCartStore((s) => s.itemCount());
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useEffect(() => setMounted(true), []);
  const otherLocale = locale === 'ar' ? 'en' : 'ar';

  function switchLocale() {
    router.push(pathname ?? '/', { locale: otherLocale });
    setMobileMenuOpen(false);
  }

  const navLinks = [
    { href: locale === 'ar' ? '/ar' : '/', label: t('home') },
    { href: locale === 'ar' ? '/ar/about' : '/about', label: t('about') },
    { href: locale === 'ar' ? '/ar/contact' : '/contact', label: t('contact') },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/95 backdrop-blur dark:border-amber-900/30 dark:bg-brand-black/95">
      <div className="mx-auto flex h-16 max-w-7xl flex-nowrap items-center justify-between gap-2 px-4 sm:px-6">
        <Link
          href={locale === 'ar' ? '/ar' : '/'}
          className="flex shrink-0 items-center gap-2 transition opacity-90 hover:opacity-100"
        >
          <div className="relative flex h-14 w-36 items-center sm:w-44 md:w-56">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LOGO_SRC}
              alt="Alnaqib fragrances"
              className="h-full w-auto max-w-full object-contain object-left"
            />
          </div>
        </Link>

        {/* Desktop nav: single row, no wrap */}
        <nav className="hidden flex-nowrap items-center gap-3 md:flex sm:gap-4">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="shrink-0 text-sm font-medium text-stone-600 hover:text-amber-600 transition dark:text-stone-300 dark:hover:text-amber-400"
            >
              {label}
            </Link>
          ))}
          <Link
            href={locale === 'ar' ? '/ar/cart' : '/cart'}
            className="relative flex shrink-0 items-center justify-center rounded-lg border border-amber-600/50 bg-amber-100 p-2.5 text-amber-800 transition dark:border-amber-700/50 dark:bg-amber-950/30 dark:text-amber-200 hover:dark:bg-amber-900/40"
            aria-label={t('cart')}
          >
            <CartIcon />
            {mounted && count > 0 ? (
              <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1.5 text-xs font-bold text-black">
                {count}
              </span>
            ) : null}
          </Link>
          {mounted && (
            <button
              type="button"
              onClick={toggleTheme}
              className="shrink-0 rounded-lg border border-stone-300 p-2 text-stone-600 hover:bg-stone-100 dark:border-stone-600 dark:text-stone-400 dark:hover:bg-stone-800"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
          )}
          <button
            type="button"
            onClick={switchLocale}
            className="shrink-0 rounded-lg border border-stone-400 px-3 py-2 text-sm font-medium text-stone-600 transition hover:border-amber-600 hover:text-amber-600 dark:border-stone-600 dark:text-stone-300 dark:hover:border-amber-700 dark:hover:text-amber-400"
          >
            {otherLocale === 'ar' ? 'العربية' : 'EN'}
          </button>
        </nav>

        {/* Mobile: icons + hamburger only so everything stays on one line */}
        <div className="flex flex-nowrap items-center gap-2 md:hidden">
          <Link
            href={locale === 'ar' ? '/ar/cart' : '/cart'}
            className="relative flex shrink-0 items-center justify-center rounded-lg border border-amber-600/50 bg-amber-100 p-2 text-amber-800 dark:border-amber-700/50 dark:bg-amber-950/30 dark:text-amber-200"
            aria-label={t('cart')}
          >
            <CartIcon />
            {mounted && count > 0 ? (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-black">
                {count}
              </span>
            ) : null}
          </Link>
          {mounted && (
            <button
              type="button"
              onClick={toggleTheme}
              className="shrink-0 rounded-lg border border-stone-300 p-2 text-stone-600 dark:border-stone-600 dark:text-stone-400"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="shrink-0 rounded-lg border border-stone-400 p-2 text-stone-600 dark:border-stone-600 dark:text-stone-300"
            aria-label="Open menu"
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      {/* Mobile menu: portal to body so overlay covers entire viewport on top of everything */}
      {mobileMenuOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-[10000] bg-black/50 md:hidden"
              aria-hidden
              onClick={() => setMobileMenuOpen(false)}
            />
            <div
              className="fixed top-0 end-0 z-[10001] flex h-full w-64 flex-col border-s border-stone-200 bg-white shadow-xl dark:border-amber-900/30 dark:bg-stone-900 md:hidden"
              role="dialog"
              aria-label="Menu"
            >
              <div className="flex h-16 items-center justify-between border-b border-stone-200 px-4 dark:border-amber-900/30">
                <span className="text-sm font-medium text-stone-500 dark:text-stone-400">{t('menu')}</span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg p-2 text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800"
                  aria-label="Close menu"
                >
                  <CloseIcon />
                </button>
              </div>
              <nav className="flex flex-col gap-1 p-4">
                {navLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg px-4 py-3 text-sm font-medium text-stone-700 hover:bg-amber-50 hover:text-amber-700 dark:text-stone-200 dark:hover:bg-amber-950/30 dark:hover:text-amber-300"
                  >
                    {label}
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={switchLocale}
                  className="rounded-lg px-4 py-3 text-left text-sm font-medium text-stone-700 hover:bg-amber-50 hover:text-amber-700 dark:text-stone-200 dark:hover:bg-amber-950/30 dark:hover:text-amber-300"
                >
                  {otherLocale === 'ar' ? 'العربية' : 'EN'}
                </button>
              </nav>
            </div>
          </>,
          document.body
        )}
    </header>
  );
}
