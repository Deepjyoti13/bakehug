'use client';

import { Category } from '@/lib/db';

interface Props {
  categories: Category[];
  activeCategory: number | null;
  onSelectCategory: (id: number | null) => void;
  itemCounts?: Record<number, number>;
}

export default function CategoryGrid({ categories, activeCategory, onSelectCategory, itemCounts = {} }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {categories.map((cat) => {
        const active = activeCategory === cat.id;
        const count = itemCounts[cat.id] ?? 0;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(active ? null : cat.id)}
            title={`View ${cat.name} (${count} item${count !== 1 ? 's' : ''})`}
            className={`group relative flex flex-col items-center gap-4 p-6 rounded-xl border-2 text-center transition-all duration-200 active:scale-[0.97] ${
              active
                ? 'bg-warm-500 border-warm-500 shadow-lg shadow-warm-500/20'
                : 'bg-white dark:bg-warm-800 border-warm-200 dark:border-warm-700 hover:border-warm-500 dark:hover:border-warm-500 hover:shadow-md hover:-translate-y-0.5'
            }`}
          >
            <span className="text-4xl transition-transform duration-200 group-hover:scale-110">
              {cat.icon}
            </span>

            <div className="w-full">
              <p className={`font-semibold text-base ${active ? 'text-white' : 'text-warm-800 dark:text-warm-100'}`}>
                {cat.name}
              </p>
              {cat.description && (
                <p className={`text-xs mt-1 leading-relaxed line-clamp-2 ${active ? 'text-white/80' : 'text-warm-400 dark:text-warm-400'}`}>
                  {cat.description}
                </p>
              )}
            </div>

            {/* Item count badge */}
            {count > 0 && (
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                active ? 'bg-white/20 text-white' : 'bg-warm-100 dark:bg-warm-700 text-warm-500 dark:text-warm-400'
              }`}>
                {count} item{count !== 1 ? 's' : ''}
              </span>
            )}

            {/* Arrow hint (appears on hover for inactive) */}
            {!active && (
              <span className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-warm-300 dark:text-warm-600">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
