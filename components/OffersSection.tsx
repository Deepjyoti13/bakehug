'use client';

import { Offer } from '@/lib/db';

interface Props { offers: Offer[]; }

export default function OffersSection({ offers }: Props) {
  if (offers.length === 0) return null;

  return (
    <section className="bg-warm-900 py-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">

        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <span className="text-2xl">🎉</span>
          <div>
            <p className="text-xs font-semibold text-warm-500 uppercase tracking-widest mb-1">Limited time</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-warm-100">Special Offers</h2>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {offers.map((offer) => (
            <div key={offer.id}
              className="group relative bg-warm-800 rounded-xl border border-warm-700 p-6 hover:border-warm-500 hover:bg-warm-700 transition-all duration-200 active:scale-[0.98] cursor-default">

              {offer.discount && (
                <span className="inline-block text-xs font-bold text-warm-500 bg-warm-500/10 border border-warm-500/30 px-3 py-1 rounded-full mb-4 group-hover:bg-warm-500/20 transition-colors">
                  {offer.discount}
                </span>
              )}

              <h3 className="font-serif text-xl text-warm-100 mb-2 leading-snug">{offer.title}</h3>

              {offer.description && (
                <p className="text-sm text-warm-300 leading-relaxed mb-4">{offer.description}</p>
              )}

              {offer.valid_until && (
                <p className="text-xs text-warm-500 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                  </svg>
                  Valid until {offer.valid_until}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
