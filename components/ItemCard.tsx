'use client';

import Image from 'next/image';
import { Item } from '@/lib/db';

interface Props {
  item: Item;
  waNumber?: string;
}

const placeholderColors = [
  { from: '#F5EDE0', to: '#EAD5BD' },
  { from: '#FDE8D8', to: '#F5CCB0' },
  { from: '#E8F0DC', to: '#D4E0C4' },
  { from: '#E0E8F5', to: '#C4D0E0' },
];

export default function ItemCard({ item, waNumber = '' }: Props) {
  const p = placeholderColors[item.id % placeholderColors.length];
  const available = item.is_available === 1;

  const waLink = waNumber && available
    ? `https://wa.me/${waNumber.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi BakeHug! I'd like to order: *${item.name}*. Could you help me with that?`)}`
    : undefined;

  const Wrapper = waLink
    ? ({ children, className }: { children: React.ReactNode; className: string }) => (
        <a href={waLink} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>
      )
    : ({ children, className }: { children: React.ReactNode; className: string }) => (
        <div className={className}>{children}</div>
      );

  return (
    <Wrapper className={`group bg-white dark:bg-warm-800 rounded-xl border border-warm-200 dark:border-warm-700 overflow-hidden shadow-sm transition-all duration-250 ${
      waLink ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer active:scale-[0.98]' : 'hover:shadow-md'
    }`}>
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        {item.image_path ? (
          <Image src={item.image_path} alt={item.name} fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${p.from}, ${p.to})` }}>
            <span className="text-5xl opacity-60 group-hover:scale-110 transition-transform duration-300">🍞</span>
            <span className="text-xs font-medium text-warm-400 mt-2 opacity-70 tracking-widest uppercase">BakeHug</span>
          </div>
        )}

        {/* Hover overlay — description + order prompt */}
        <div className="absolute inset-0 bg-warm-900/82 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out flex flex-col justify-end p-4">
          {item.description && (
            <p className="text-xs text-warm-200 leading-relaxed mb-3 line-clamp-4">{item.description}</p>
          )}
          <div className="flex items-center justify-between">
            {item.price !== null
              ? <span className="font-serif text-lg text-warm-500">${item.price.toFixed(2)}</span>
              : <span className="text-xs text-warm-400">Price on request</span>
            }
            {available && waLink ? (
              <span className="text-xs font-semibold text-white bg-[#25D366] px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                </svg>
                Order
              </span>
            ) : !available ? (
              <span className="text-xs font-medium text-warm-500">Unavailable</span>
            ) : null}
          </div>
        </div>

        {!available && (
          <div className="absolute inset-0 bg-warm-900/50 flex items-center justify-center">
            <span className="text-xs font-semibold text-white bg-warm-700/80 px-3 py-1.5 rounded-full">Unavailable</span>
          </div>
        )}
      </div>

      {/* Name + price strip */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif text-[15px] font-medium text-warm-800 dark:text-warm-100 leading-snug">
            {item.name}
          </h3>
          {item.price !== null && (
            <span className="flex-shrink-0 text-sm font-semibold text-warm-500">${item.price.toFixed(2)}</span>
          )}
        </div>
        {item.description && (
          <p className="text-xs text-warm-400 dark:text-warm-400 mt-1.5 line-clamp-1 leading-relaxed">{item.description}</p>
        )}
        {available && waLink && (
          <p className="text-[11px] text-warm-300 dark:text-warm-600 mt-2 group-hover:text-warm-500 transition-colors">
            Tap to order via WhatsApp →
          </p>
        )}
      </div>
    </Wrapper>
  );
}
