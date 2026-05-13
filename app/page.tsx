'use client';

import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CategoryGrid from '@/components/CategoryGrid';
import ItemCard from '@/components/ItemCard';
import OffersSection from '@/components/OffersSection';
import Footer from '@/components/Footer';
import { Category, Item, Offer } from '@/lib/db';

const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [itemCounts, setItemCounts] = useState<Record<number, number>>({});
  const [showBackToTop, setShowBackToTop] = useState(false);
  const menuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/categories').then((r) => r.json()),
      fetch('/api/offers').then((r) => r.json()),
      fetch('/api/items').then((r) => r.json()),
    ]).then(([cats, offs, itms]) => {
      setCategories(cats);
      setOffers(offs);
      setItems(itms);
      const counts: Record<number, number> = {};
      (itms as Item[]).forEach((item) => {
        if (item.category_id) counts[item.category_id] = (counts[item.category_id] || 0) + 1;
      });
      setItemCounts(counts);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleCategory = async (id: number | null) => {
    setActiveCategory(id);
    setItemsLoading(true);
    const data = await fetch(id ? `/api/items?category=${id}` : '/api/items').then((r) => r.json());
    setItems(data);
    setItemsLoading(false);
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Navbar />
      <main>
        <Hero />

        {/* ── Categories ── */}
        <section className="bg-white dark:bg-warm-800 py-20">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <div className="mb-10">
              <p className="text-xs font-semibold text-warm-500 uppercase tracking-widest mb-2">Browse by type</p>
              <h2 className="font-serif text-3xl sm:text-4xl text-warm-800 dark:text-warm-100">Categories</h2>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => <div key={i} className="h-44 rounded-xl shimmer" />)}
              </div>
            ) : (
              <CategoryGrid
                categories={categories}
                activeCategory={activeCategory}
                onSelectCategory={handleCategory}
                itemCounts={itemCounts}
              />
            )}
          </div>
        </section>

        {/* ── Offers (conditional) ── */}
        {!loading && <OffersSection offers={offers} />}

        {/* ── Menu ── */}
        <section id="menu" ref={menuRef} className="bg-warm-50 dark:bg-warm-900 py-20">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
              <div>
                <p className="text-xs font-semibold text-warm-500 uppercase tracking-widest mb-2">
                  {activeCategory ? 'Filtered view' : 'Full selection'}
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl text-warm-800 dark:text-warm-100">
                  {activeCategory ? (categories.find((c) => c.id === activeCategory)?.name ?? 'Items') : 'All Items'}
                </h2>
              </div>
            </div>

            {/* Sticky filter bar */}
            <div className="sticky top-16 z-30 -mx-5 sm:-mx-8 px-5 sm:px-8 py-3 mb-8
              bg-warm-50/95 dark:bg-warm-900/95 backdrop-blur-sm
              border-b border-warm-200 dark:border-warm-800">
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleCategory(null)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 active:scale-95 ${
                      activeCategory === null
                        ? 'bg-warm-500 border-warm-500 text-white'
                        : 'border-warm-200 dark:border-warm-700 text-warm-700 dark:text-warm-300 hover:border-warm-500 hover:text-warm-500 dark:hover:border-warm-500 dark:hover:text-warm-500 bg-white dark:bg-warm-800'
                    }`}>
                    All
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategory(cat.id)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 active:scale-95 ${
                        activeCategory === cat.id
                          ? 'bg-warm-500 border-warm-500 text-white'
                          : 'border-warm-200 dark:border-warm-700 text-warm-700 dark:text-warm-300 hover:border-warm-500 hover:text-warm-500 dark:hover:border-warm-500 dark:hover:text-warm-500 bg-white dark:bg-warm-800'
                      }`}>
                      {cat.icon} {cat.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Grid */}
            {itemsLoading || loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {[...Array(8)].map((_, i) => <div key={i} className="h-72 rounded-xl shimmer" />)}
              </div>
            ) : items.length === 0 ? (
              <div className="py-24 text-center">
                <p className="text-warm-400 dark:text-warm-500">No items in this category yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {items.map((item) => (
                  <ItemCard key={item.id} item={item} waNumber={waNumber} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
        className={`fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-warm-500 text-white shadow-lg
          flex items-center justify-center transition-all duration-300
          hover:bg-warm-600 active:scale-90
          ${showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </>
  );
}
