import { getTranslations } from 'next-intl/server';
import { HomeSections } from '@/components/HomeSections';

export default async function HomePage() {
  const t = await getTranslations('home');
  return (
    <div>
      <section className="relative min-h-[28rem] overflow-hidden border-b border-stone-200 py-20 sm:py-28 dark:border-amber-900/30">
        {/* Background video - Mixkit free stock (perfume bottle) */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover object-[center_50%]"
          aria-hidden
        >
          <source
            src="https://assets.mixkit.co/videos/20766/20766-720.mp4"
            type="video/mp4"
          />
        </video>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-white/80 dark:bg-brand-black/75" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(217,119,6,0.12),transparent)]" />
        <div className="relative z-10 mx-auto flex min-h-[20rem] max-w-4xl flex-col justify-center px-4 text-center sm:px-6">
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl md:text-5xl dark:text-stone-100">
            {t('heroTitle')}
          </h1>
          <p className="mt-4 text-lg text-stone-600 sm:text-xl dark:text-stone-400">
            {t('heroSubtitle')}
          </p>
          <p className="mt-2 text-sm text-amber-700 dark:text-amber-500/90">{t('sizes')}</p>
        </div>
      </section>

      <HomeSections />
    </div>
  );
}
