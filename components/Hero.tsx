'use client';

import Link from 'next/link';
import Image from 'next/image';

const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+1234567890';

export default function Hero() {
  const waLink = `https://wa.me/${waNumber.replace(/\D/g, '')}`;

  return (
    <section className="min-h-[88vh] flex items-center bg-warm-50 dark:bg-warm-900">
      <div className="w-full max-w-3xl mx-auto px-5 sm:px-8 py-28 text-center">

        {/* Logo */}
        <div className="animate-fade-in flex justify-center mb-8" style={{ animationDelay: '0.05s' }}>
          <Image src="/logo.png" alt="BakeHug" width={200} height={200} className="h-44 w-auto object-contain drop-shadow-md" priority />
        </div>

        {/* Headline */}
        <h1 className="animate-fade-up font-serif text-5xl sm:text-6xl md:text-7xl text-warm-800 dark:text-warm-100 leading-[1.08] mb-6"
          style={{ animationDelay: '0.15s' }}>
          Cookies that feel like<br />
          <span className="text-warm-500 dark:text-warm-500 italic">a warm hug</span>
        </h1>

        {/* Subheading */}
        <p className="animate-fade-up text-lg text-warm-400 dark:text-warm-300 max-w-xl mx-auto leading-relaxed mb-12"
          style={{ animationDelay: '0.3s' }}>
          Artisan cakes, pastries, breads &amp; cookies — crafted from scratch with premium ingredients, delivered with love.
        </p>

        {/* CTAs */}
        <div className="animate-fade-up flex flex-col sm:flex-row items-center justify-center gap-3"
          style={{ animationDelay: '0.42s' }}>
          {/* Primary */}
          <Link href="/#menu"
            className="relative overflow-hidden group inline-flex items-center gap-2 px-8 py-3.5 bg-warm-500 text-white text-sm font-semibold rounded-lg hover:bg-warm-600 active:scale-[0.97] transition-all duration-200 shadow-md shadow-warm-500/25 hover:shadow-lg hover:shadow-warm-500/30">
            Browse Menu
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>

          {/* WhatsApp */}
          <a href={waLink} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-warm-200 dark:border-warm-700 text-warm-700 dark:text-warm-300 text-sm font-semibold rounded-lg hover:border-warm-500 hover:text-warm-500 dark:hover:border-warm-500 dark:hover:text-warm-500 active:scale-[0.97] transition-all duration-200 bg-white dark:bg-transparent">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
            </svg>
            Order on WhatsApp
          </a>
        </div>

        {/* Stats */}
        <div className="animate-fade-in mt-20 pt-10 border-t border-warm-200 dark:border-warm-800 grid grid-cols-3 gap-6"
          style={{ animationDelay: '0.6s' }}>
          {[
            { value: '50+',    label: 'Recipes' },
            { value: '1,000+', label: 'Customers' },
            { value: 'Daily',  label: 'Fresh Baked' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-serif text-2xl sm:text-3xl text-warm-800 dark:text-warm-100">{s.value}</p>
              <p className="text-xs font-medium text-warm-400 dark:text-warm-500 mt-1 uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
