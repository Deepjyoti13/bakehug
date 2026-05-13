import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _db: SupabaseClient | null = null;

function getDb(): SupabaseClient {
  if (!_db) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error('Supabase environment variables are not set');
    _db = createClient(url, key, { auth: { persistSession: false } });
  }
  return _db;
}

export type Category = {
  id: number;
  name: string;
  description: string | null;
  icon: string;
  created_at: string;
};

export type Item = {
  id: number;
  category_id: number | null;
  name: string;
  description: string | null;
  price: number | null;
  image_path: string | null;
  is_available: number;
  created_at: string;
};

export type Offer = {
  id: number;
  title: string;
  description: string | null;
  discount: string | null;
  item_id: number | null;
  is_active: number;
  valid_until: string | null;
  created_at: string;
};

// Categories
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await getDb().from('categories').select('*').order('created_at', { ascending: true });
  if (error) throw error;
  return data as Category[];
}

export async function createCategory(name: string, description: string, icon: string): Promise<Category> {
  const { data, error } = await getDb().from('categories').insert({ name, description, icon }).select().single();
  if (error) throw error;
  return data as Category;
}

export async function updateCategory(id: number, name: string, description: string, icon: string): Promise<Category> {
  const { data, error } = await getDb().from('categories').update({ name, description, icon }).eq('id', id).select().single();
  if (error) throw error;
  return data as Category;
}

export async function deleteCategory(id: number): Promise<void> {
  const { error } = await getDb().from('categories').delete().eq('id', id);
  if (error) throw error;
}

// Items
export async function getItems(categoryId?: number): Promise<Item[]> {
  const query = getDb().from('items').select('*').order('created_at', { ascending: true });
  const { data, error } = categoryId ? await query.eq('category_id', categoryId) : await query;
  if (error) throw error;
  return data as Item[];
}

export async function createItem(categoryId: number | null, name: string, description: string, price: number | null, imagePath: string | null): Promise<Item> {
  const { data, error } = await getDb().from('items').insert({ category_id: categoryId, name, description, price, image_path: imagePath }).select().single();
  if (error) throw error;
  return data as Item;
}

export async function updateItem(id: number, categoryId: number | null, name: string, description: string, price: number | null, imagePath: string | null, isAvailable: number): Promise<Item> {
  const { data, error } = await getDb().from('items').update({ category_id: categoryId, name, description, price, image_path: imagePath, is_available: isAvailable }).eq('id', id).select().single();
  if (error) throw error;
  return data as Item;
}

export async function deleteItem(id: number): Promise<void> {
  const { error } = await getDb().from('items').delete().eq('id', id);
  if (error) throw error;
}

// Offers
export async function getActiveOffers(): Promise<Offer[]> {
  const { data, error } = await getDb().from('offers').select('*').eq('is_active', 1).order('created_at', { ascending: false });
  if (error) throw error;
  return data as Offer[];
}

export async function getAllOffers(): Promise<Offer[]> {
  const { data, error } = await getDb().from('offers').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data as Offer[];
}

export async function createOffer(title: string, description: string, discount: string, itemId: number | null, validUntil: string | null): Promise<Offer> {
  const { data, error } = await getDb().from('offers').insert({ title, description, discount, item_id: itemId, valid_until: validUntil }).select().single();
  if (error) throw error;
  return data as Offer;
}

export async function updateOffer(id: number, title: string, description: string, discount: string, itemId: number | null, isActive: number, validUntil: string | null): Promise<Offer> {
  const { data, error } = await getDb().from('offers').update({ title, description, discount, item_id: itemId, is_active: isActive, valid_until: validUntil }).eq('id', id).select().single();
  if (error) throw error;
  return data as Offer;
}

export async function deleteOffer(id: number): Promise<void> {
  const { error } = await getDb().from('offers').delete().eq('id', id);
  if (error) throw error;
}
