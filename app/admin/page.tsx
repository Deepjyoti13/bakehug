'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Category, Item, Offer } from '@/lib/db';

type Tab = 'categories' | 'items' | 'offers';

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('categories');
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Category form state
  const [catForm, setCatForm] = useState({ name: '', description: '', icon: '🎂' });
  const [editingCat, setEditingCat] = useState<Category | null>(null);

  // Item form state
  const [itemForm, setItemForm] = useState({
    name: '', category_id: '', description: '', price: '', image_path: '', is_available: true,
  });
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [uploading, setUploading] = useState(false);

  // Offer form state
  const [offerForm, setOfferForm] = useState({
    title: '', description: '', discount: '', item_id: '', is_active: true, valid_until: '',
  });
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

  async function loadData() {
    setLoading(true);
    const [cats, itms, offs] = await Promise.all([
      fetch('/api/categories').then((r) => r.json()),
      fetch('/api/items').then((r) => r.json()),
      fetch('/api/offers').then((r) => r.json()).catch(() => []),
    ]);
    setCategories(cats);
    setItems(itms);
    setOffers(offs);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function loadAllOffers() {
    const res = await fetch('/api/offers/all');
    if (res.ok) {
      setOffers(await res.json());
    }
  }

  useEffect(() => {
    if (tab === 'offers') {
      // Reload offers (all, not just active) for admin
      fetch('/api/offers/all')
        .then((r) => r.ok ? r.json() : [])
        .then((data) => setOffers(Array.isArray(data) ? data : offers));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  function showMessage(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  // ---- CATEGORIES ----
  async function handleCatSubmit(e: FormEvent) {
    e.preventDefault();
    const method = editingCat ? 'PUT' : 'POST';
    const url = editingCat ? `/api/categories/${editingCat.id}` : '/api/categories';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(catForm),
    });
    setCatForm({ name: '', description: '', icon: '🎂' });
    setEditingCat(null);
    await loadData();
    showMessage(editingCat ? 'Category updated!' : 'Category added!');
  }

  function startEditCat(cat: Category) {
    setEditingCat(cat);
    setCatForm({ name: cat.name, description: cat.description || '', icon: cat.icon });
  }

  async function deleteCat(id: number) {
    if (!confirm('Delete this category?')) return;
    await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    await loadData();
    showMessage('Category deleted.');
  }

  // ---- ITEMS ----
  async function handleImageUpload(file: File): Promise<string> {
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    setUploading(false);
    return data.path || '';
  }

  async function handleItemSubmit(e: FormEvent) {
    e.preventDefault();
    const method = editingItem ? 'PUT' : 'POST';
    const url = editingItem ? `/api/items/${editingItem.id}` : '/api/items';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...itemForm,
        price: itemForm.price ? parseFloat(itemForm.price) : null,
        is_available: itemForm.is_available ? 1 : 0,
      }),
    });
    setItemForm({ name: '', category_id: '', description: '', price: '', image_path: '', is_available: true });
    setEditingItem(null);
    await loadData();
    showMessage(editingItem ? 'Item updated!' : 'Item added!');
  }

  function startEditItem(item: Item) {
    setEditingItem(item);
    setItemForm({
      name: item.name,
      category_id: item.category_id ? String(item.category_id) : '',
      description: item.description || '',
      price: item.price !== null ? String(item.price) : '',
      image_path: item.image_path || '',
      is_available: item.is_available === 1,
    });
  }

  async function deleteItem(id: number) {
    if (!confirm('Delete this item?')) return;
    await fetch(`/api/items/${id}`, { method: 'DELETE' });
    await loadData();
    showMessage('Item deleted.');
  }

  // ---- OFFERS ----
  async function handleOfferSubmit(e: FormEvent) {
    e.preventDefault();
    const method = editingOffer ? 'PUT' : 'POST';
    const url = editingOffer ? `/api/offers/${editingOffer.id}` : '/api/offers';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...offerForm,
        is_active: offerForm.is_active ? 1 : 0,
      }),
    });
    setOfferForm({ title: '', description: '', discount: '', item_id: '', is_active: true, valid_until: '' });
    setEditingOffer(null);
    const allOffers = await fetch('/api/offers/all').then((r) => r.ok ? r.json() : []);
    setOffers(Array.isArray(allOffers) ? allOffers : []);
    showMessage(editingOffer ? 'Offer updated!' : 'Offer added!');
  }

  function startEditOffer(offer: Offer) {
    setEditingOffer(offer);
    setOfferForm({
      title: offer.title,
      description: offer.description || '',
      discount: offer.discount || '',
      item_id: offer.item_id ? String(offer.item_id) : '',
      is_active: offer.is_active === 1,
      valid_until: offer.valid_until || '',
    });
  }

  async function deleteOffer(id: number) {
    if (!confirm('Delete this offer?')) return;
    await fetch(`/api/offers/${id}`, { method: 'DELETE' });
    const allOffers = await fetch('/api/offers/all').then((r) => r.ok ? r.json() : []);
    setOffers(Array.isArray(allOffers) ? allOffers : []);
    showMessage('Offer deleted.');
  }

  const inputClass = 'w-full px-3 py-2 rounded-lg border border-warm-200 dark:border-warm-600 bg-warm-50 dark:bg-warm-700 text-warm-800 dark:text-warm-100 text-sm focus:outline-none focus:ring-2 focus:ring-warm-500';

  return (
    <div className="min-h-screen bg-warm-50 dark:bg-warm-900">
      {/* Header */}
      <header className="bg-white dark:bg-warm-800 border-b border-warm-200 dark:border-warm-700 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍞</span>
            <h1 className="text-xl font-bold text-warm-800 dark:text-warm-100">BakeHug Admin</h1>
          </div>
          <div className="flex items-center gap-3">
            {message && (
              <span className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full">
                {message}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="text-sm text-warm-500 hover:text-warm-700 dark:text-warm-400 dark:hover:text-warm-200 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-warm-100 dark:hover:bg-warm-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-warm-100 dark:bg-warm-800 p-1 rounded-xl mb-8 w-fit">
          {(['categories', 'items', 'offers'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                tab === t
                  ? 'bg-white dark:bg-warm-700 text-warm-800 dark:text-warm-100 shadow-sm'
                  : 'text-warm-500 dark:text-warm-400 hover:text-warm-700 dark:hover:text-warm-200'
              }`}
            >
              {t === 'categories' ? '🎂 Categories' : t === 'items' ? '🍰 Items' : '⭐ Offers'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-warm-400 text-lg">Loading...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* ---- CATEGORIES TAB ---- */}
            {tab === 'categories' && (
              <>
                {/* Form */}
                <div className="bg-white dark:bg-warm-800 rounded-2xl p-6 border border-warm-100 dark:border-warm-700">
                  <h2 className="text-lg font-bold text-warm-800 dark:text-warm-100 mb-5">
                    {editingCat ? 'Edit Category' : 'Add Category'}
                  </h2>
                  <form onSubmit={handleCatSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-warm-700 dark:text-warm-300 mb-1">Name *</label>
                      <input className={inputClass} required value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} placeholder="e.g. Cakes" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-warm-700 dark:text-warm-300 mb-1">Description</label>
                      <textarea className={inputClass} rows={2} value={catForm.description} onChange={(e) => setCatForm({ ...catForm, description: e.target.value })} placeholder="Short description..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-warm-700 dark:text-warm-300 mb-1">Icon (emoji)</label>
                      <input className={inputClass} value={catForm.icon} onChange={(e) => setCatForm({ ...catForm, icon: e.target.value })} placeholder="🎂" />
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" className="flex-1 bg-warm-500 hover:bg-warm-600 text-white font-medium py-2 rounded-lg text-sm transition-colors">
                        {editingCat ? 'Update' : 'Add'} Category
                      </button>
                      {editingCat && (
                        <button type="button" onClick={() => { setEditingCat(null); setCatForm({ name: '', description: '', icon: '🎂' }); }} className="px-4 py-2 bg-warm-100 dark:bg-warm-700 text-warm-700 dark:text-warm-300 rounded-lg text-sm hover:bg-warm-200 dark:hover:bg-warm-600 transition-colors">
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* List */}
                <div className="bg-white dark:bg-warm-800 rounded-2xl p-6 border border-warm-100 dark:border-warm-700">
                  <h2 className="text-lg font-bold text-warm-800 dark:text-warm-100 mb-5">All Categories ({categories.length})</h2>
                  {categories.length === 0 ? (
                    <p className="text-warm-400 text-sm">No categories yet.</p>
                  ) : (
                    <ul className="space-y-3">
                      {categories.map((cat) => (
                        <li key={cat.id} className="flex items-center gap-3 p-3 rounded-xl bg-warm-50 dark:bg-warm-700">
                          <span className="text-2xl">{cat.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-warm-800 dark:text-warm-100 text-sm truncate">{cat.name}</p>
                            {cat.description && <p className="text-xs text-warm-500 dark:text-warm-400 truncate">{cat.description}</p>}
                          </div>
                          <div className="flex gap-1">
                            <button onClick={() => startEditCat(cat)} className="p-1.5 text-warm-500 hover:text-warm-700 dark:hover:text-warm-200 hover:bg-warm-200 dark:hover:bg-warm-600 rounded-lg transition-colors">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </button>
                            <button onClick={() => deleteCat(cat.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            )}

            {/* ---- ITEMS TAB ---- */}
            {tab === 'items' && (
              <>
                {/* Form */}
                <div className="bg-white dark:bg-warm-800 rounded-2xl p-6 border border-warm-100 dark:border-warm-700">
                  <h2 className="text-lg font-bold text-warm-800 dark:text-warm-100 mb-5">
                    {editingItem ? 'Edit Item' : 'Add Item'}
                  </h2>
                  <form onSubmit={handleItemSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-warm-700 dark:text-warm-300 mb-1">Name *</label>
                      <input className={inputClass} required value={itemForm.name} onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })} placeholder="e.g. Chocolate Cake" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-warm-700 dark:text-warm-300 mb-1">Category</label>
                      <select className={inputClass} value={itemForm.category_id} onChange={(e) => setItemForm({ ...itemForm, category_id: e.target.value })}>
                        <option value="">— Select category —</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-warm-700 dark:text-warm-300 mb-1">Description</label>
                      <textarea className={inputClass} rows={2} value={itemForm.description} onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })} placeholder="Item description..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-warm-700 dark:text-warm-300 mb-1">Price ($)</label>
                      <input type="number" step="0.01" min="0" className={inputClass} value={itemForm.price} onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })} placeholder="0.00" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-warm-700 dark:text-warm-300 mb-1">Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        className="block w-full text-sm text-warm-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-warm-100 file:text-warm-700 hover:file:bg-warm-200 dark:file:bg-warm-700 dark:file:text-warm-300 cursor-pointer"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const path = await handleImageUpload(file);
                            setItemForm({ ...itemForm, image_path: path });
                          }
                        }}
                      />
                      {uploading && <p className="text-xs text-warm-400 mt-1">Uploading...</p>}
                      {itemForm.image_path && (
                        <div className="mt-2 relative w-20 h-20 rounded-lg overflow-hidden border border-warm-200 dark:border-warm-600">
                          <Image src={itemForm.image_path} alt="Preview" fill className="object-cover" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="is_available"
                        checked={itemForm.is_available}
                        onChange={(e) => setItemForm({ ...itemForm, is_available: e.target.checked })}
                        className="w-4 h-4 accent-warm-500"
                      />
                      <label htmlFor="is_available" className="text-sm font-medium text-warm-700 dark:text-warm-300">Available</label>
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" className="flex-1 bg-warm-500 hover:bg-warm-600 text-white font-medium py-2 rounded-lg text-sm transition-colors">
                        {editingItem ? 'Update' : 'Add'} Item
                      </button>
                      {editingItem && (
                        <button type="button" onClick={() => { setEditingItem(null); setItemForm({ name: '', category_id: '', description: '', price: '', image_path: '', is_available: true }); }} className="px-4 py-2 bg-warm-100 dark:bg-warm-700 text-warm-700 dark:text-warm-300 rounded-lg text-sm hover:bg-warm-200 dark:hover:bg-warm-600 transition-colors">
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* List */}
                <div className="bg-white dark:bg-warm-800 rounded-2xl p-6 border border-warm-100 dark:border-warm-700">
                  <h2 className="text-lg font-bold text-warm-800 dark:text-warm-100 mb-5">All Items ({items.length})</h2>
                  {items.length === 0 ? (
                    <p className="text-warm-400 text-sm">No items yet.</p>
                  ) : (
                    <ul className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                      {items.map((item) => (
                        <li key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-warm-50 dark:bg-warm-700">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-warm-200 dark:bg-warm-600 flex-shrink-0 flex items-center justify-center">
                            {item.image_path ? (
                              <Image src={item.image_path} alt={item.name} width={48} height={48} className="object-cover w-full h-full" />
                            ) : (
                              <span className="text-xl">🍞</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-warm-800 dark:text-warm-100 text-sm truncate">{item.name}</p>
                            <p className="text-xs text-warm-500 dark:text-warm-400">
                              {item.price !== null ? `$${item.price.toFixed(2)}` : 'No price'} •{' '}
                              {item.is_available ? <span className="text-green-500">Available</span> : <span className="text-red-400">Unavailable</span>}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <button onClick={() => startEditItem(item)} className="p-1.5 text-warm-500 hover:text-warm-700 dark:hover:text-warm-200 hover:bg-warm-200 dark:hover:bg-warm-600 rounded-lg transition-colors">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </button>
                            <button onClick={() => deleteItem(item.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            )}

            {/* ---- OFFERS TAB ---- */}
            {tab === 'offers' && (
              <>
                {/* Form */}
                <div className="bg-white dark:bg-warm-800 rounded-2xl p-6 border border-warm-100 dark:border-warm-700">
                  <h2 className="text-lg font-bold text-warm-800 dark:text-warm-100 mb-5">
                    {editingOffer ? 'Edit Offer' : 'Add Offer'}
                  </h2>
                  <form onSubmit={handleOfferSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-warm-700 dark:text-warm-300 mb-1">Title *</label>
                      <input className={inputClass} required value={offerForm.title} onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })} placeholder="e.g. Weekend Special" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-warm-700 dark:text-warm-300 mb-1">Description</label>
                      <textarea className={inputClass} rows={2} value={offerForm.description} onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })} placeholder="Offer details..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-warm-700 dark:text-warm-300 mb-1">Discount Text</label>
                      <input className={inputClass} value={offerForm.discount} onChange={(e) => setOfferForm({ ...offerForm, discount: e.target.value })} placeholder="e.g. 20% OFF" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-warm-700 dark:text-warm-300 mb-1">Linked Item (optional)</label>
                      <select className={inputClass} value={offerForm.item_id} onChange={(e) => setOfferForm({ ...offerForm, item_id: e.target.value })}>
                        <option value="">— No specific item —</option>
                        {items.map((item) => (
                          <option key={item.id} value={item.id}>{item.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-warm-700 dark:text-warm-300 mb-1">Valid Until</label>
                      <input type="date" className={inputClass} value={offerForm.valid_until} onChange={(e) => setOfferForm({ ...offerForm, valid_until: e.target.value })} />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="is_active"
                        checked={offerForm.is_active}
                        onChange={(e) => setOfferForm({ ...offerForm, is_active: e.target.checked })}
                        className="w-4 h-4 accent-warm-500"
                      />
                      <label htmlFor="is_active" className="text-sm font-medium text-warm-700 dark:text-warm-300">Active</label>
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" className="flex-1 bg-warm-500 hover:bg-warm-600 text-white font-medium py-2 rounded-lg text-sm transition-colors">
                        {editingOffer ? 'Update' : 'Add'} Offer
                      </button>
                      {editingOffer && (
                        <button type="button" onClick={() => { setEditingOffer(null); setOfferForm({ title: '', description: '', discount: '', item_id: '', is_active: true, valid_until: '' }); }} className="px-4 py-2 bg-warm-100 dark:bg-warm-700 text-warm-700 dark:text-warm-300 rounded-lg text-sm hover:bg-warm-200 dark:hover:bg-warm-600 transition-colors">
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* List */}
                <div className="bg-white dark:bg-warm-800 rounded-2xl p-6 border border-warm-100 dark:border-warm-700">
                  <h2 className="text-lg font-bold text-warm-800 dark:text-warm-100 mb-5">All Offers ({offers.length})</h2>
                  {offers.length === 0 ? (
                    <p className="text-warm-400 text-sm">No offers yet.</p>
                  ) : (
                    <ul className="space-y-3">
                      {offers.map((offer) => (
                        <li key={offer.id} className="flex items-start gap-3 p-3 rounded-xl bg-warm-50 dark:bg-warm-700">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-warm-800 dark:text-warm-100 text-sm truncate">{offer.title}</p>
                              {offer.discount && (
                                <span className="flex-shrink-0 bg-honey-500 text-white text-xs px-1.5 py-0.5 rounded-full">{offer.discount}</span>
                              )}
                            </div>
                            {offer.description && <p className="text-xs text-warm-500 dark:text-warm-400 truncate">{offer.description}</p>}
                            <p className="text-xs mt-1">
                              <span className={offer.is_active ? 'text-green-500' : 'text-red-400'}>
                                {offer.is_active ? 'Active' : 'Inactive'}
                              </span>
                              {offer.valid_until && <span className="text-warm-400 dark:text-warm-500"> · until {offer.valid_until}</span>}
                            </p>
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            <button onClick={() => startEditOffer(offer)} className="p-1.5 text-warm-500 hover:text-warm-700 dark:hover:text-warm-200 hover:bg-warm-200 dark:hover:bg-warm-600 rounded-lg transition-colors">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </button>
                            <button onClick={() => deleteOffer(offer.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
