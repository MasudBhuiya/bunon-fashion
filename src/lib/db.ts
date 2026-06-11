import { supabase, isUsingPlaceholder } from './supabase';
import { Product, Review, BrandUpdate, Order, UserProfile } from '../types';
import { PRODUCTS, INITIAL_REVIEWS, INITIAL_UPDATES } from '../data';

// Helper to check if Supabase is connected/configured
const isConfigured = (): boolean => {
  return typeof window !== 'undefined';
};

/**
 * ------------------------------------------------------------
 * 1. PRODUCTS DB OPERATIONS
 * ------------------------------------------------------------
 */

export async function fetchProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');

    if (error) {
      console.warn('Supabase fetchProducts error (falling back to localStorage/defaults):', error);
      return getLocalProducts();
    }

    if (!data || data.length === 0) {
      console.log('Products table is empty. Seeding initial products...');
      // Try to seed initial products
      const seeded = await seedProducts();
      if (seeded) return seeded;
      return getLocalProducts();
    }

    // Cast and sort
    const mapped = (data as any[]).map(item => ({
      ...item,
      features: Array.isArray(item.features) ? item.features : JSON.parse(item.features || '[]')
    }));

    // Cache locally
    localStorage.setItem('bunon_products_v2', JSON.stringify(mapped));
    return mapped;
  } catch (err) {
    console.error('Fetch products error, reading local state:', err);
    return getLocalProducts();
  }
}

function getLocalProducts(): Product[] {
  if (typeof window === 'undefined') return PRODUCTS;
  const stored = localStorage.getItem('bunon_products_v2');
  return stored ? JSON.parse(stored) : PRODUCTS;
}

async function seedProducts(): Promise<Product[] | null> {
  try {
    const dataToSeed = PRODUCTS.map(p => ({
      id: p.id,
      name: p.name,
      banglaName: p.banglaName,
      description: p.description,
      price: p.price,
      imageUrl: p.imageUrl,
      category: p.category,
      categoryBangla: p.categoryBangla,
      rating: p.rating,
      reviewsCount: p.reviewsCount,
      stock: p.stock,
      isFeatured: p.isFeatured,
      features: p.features // jsonb column handles array directly or as json
    }));

    const { error } = await supabase.from('products').insert(dataToSeed);
    if (error) {
      console.warn('Could not seed products table (perhaps table does not exist yet):', error);
      return null;
    }
    console.log('Successfully seeded products table!');
    return PRODUCTS;
  } catch (err) {
    console.error('Error during products seeding:', err);
    return null;
  }
}

export async function upsertProduct(product: Product): Promise<boolean> {
  try {
    const payload = {
      id: product.id,
      name: product.name,
      banglaName: product.banglaName,
      description: product.description,
      price: Number(product.price),
      imageUrl: product.imageUrl,
      category: product.category,
      categoryBangla: product.categoryBangla,
      rating: Number(product.rating),
      reviewsCount: Number(product.reviewsCount),
      stock: Number(product.stock),
      isFeatured: Boolean(product.isFeatured),
      features: product.features
    };

    const { error } = await supabase.from('products').upsert(payload);
    if (error) {
      console.error('Supabase upsertProduct error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Upsert product exception:', err);
    return false;
  }
}

export async function deleteProduct(productId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) {
      console.error('Supabase deleteProduct error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Delete product exception:', err);
    return false;
  }
}


/**
 * ------------------------------------------------------------
 * 2. REVIEWS DB OPERATIONS
 * ------------------------------------------------------------
 */

export async function fetchReviews(): Promise<Review[]> {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetchReviews error (using local storage):', error);
      return getLocalReviews();
    }

    if (!data || data.length === 0) {
      console.log('Reviews table is empty. Seeding initial reviews...');
      const seeded = await seedReviews();
      if (seeded) return seeded;
      return getLocalReviews();
    }

    // Cache locally
    localStorage.setItem('bunon_reviews_v2', JSON.stringify(data));
    return data as Review[];
  } catch (err) {
    console.error('Fetch reviews error, reading local state:', err);
    return getLocalReviews();
  }
}

function getLocalReviews(): Review[] {
  if (typeof window === 'undefined') return INITIAL_REVIEWS;
  const stored = localStorage.getItem('bunon_reviews_v2');
  return stored ? JSON.parse(stored) : INITIAL_REVIEWS;
}

async function seedReviews(): Promise<Review[] | null> {
  try {
    const { error } = await supabase.from('reviews').insert(INITIAL_REVIEWS);
    if (error) {
      console.warn('Could not seed reviews table (perhaps table does not exist):', error);
      return null;
    }
    return INITIAL_REVIEWS;
  } catch (err) {
    console.error('Error during reviews seeding:', err);
    return null;
  }
}

export async function insertReview(review: Review): Promise<boolean> {
  try {
    const { error } = await supabase.from('reviews').insert(review);
    if (error) {
      console.error('Supabase insertReview error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Insert review exception:', err);
    return false;
  }
}

export async function deleteReview(reviewId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
    if (error) {
      console.error('Supabase deleteReview error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Delete review exception:', err);
    return false;
  }
}


/**
 * ------------------------------------------------------------
 * 3. BRAND UPDATES DB OPERATIONS
 * ------------------------------------------------------------
 */

export async function fetchUpdates(): Promise<BrandUpdate[]> {
  try {
    const { data, error } = await supabase
      .from('updates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetchUpdates error:', error);
      return getLocalUpdates();
    }

    if (!data || data.length === 0) {
      console.log('Updates table is empty. Seeding initial updates...');
      const seeded = await seedUpdates();
      if (seeded) return seeded;
      return getLocalUpdates();
    }

    // Cache locally
    localStorage.setItem('bunon_updates_v2', JSON.stringify(data));
    return data as BrandUpdate[];
  } catch (err) {
    console.error('Fetch updates error, reading local state:', err);
    return getLocalUpdates();
  }
}

function getLocalUpdates(): BrandUpdate[] {
  if (typeof window === 'undefined') return INITIAL_UPDATES;
  const stored = localStorage.getItem('bunon_updates_v2');
  return stored ? JSON.parse(stored) : INITIAL_UPDATES;
}

async function seedUpdates(): Promise<BrandUpdate[] | null> {
  try {
    const { error } = await supabase.from('updates').insert(INITIAL_UPDATES);
    if (error) {
      console.warn('Could not seed updates table:', error);
      return null;
    }
    return INITIAL_UPDATES;
  } catch (err) {
    console.error('Error during updates seeding:', err);
    return null;
  }
}

export async function upsertUpdate(update: BrandUpdate): Promise<boolean> {
  try {
    const payload = {
      id: update.id,
      title: update.title,
      excerpt: update.excerpt,
      content: update.content,
      category: update.category,
      categoryBangla: update.categoryBangla,
      date: update.date,
      imageUrl: update.imageUrl || null,
      badge: update.badge || null
    };

    const { error } = await supabase.from('updates').upsert(payload);
    if (error) {
      console.error('Supabase upsertUpdate error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Upsert update exception:', err);
    return false;
  }
}

export async function deleteUpdate(updateId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('updates').delete().eq('id', updateId);
    if (error) {
      console.error('Supabase deleteUpdate error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Delete update exception:', err);
    return false;
  }
}


/**
 * ------------------------------------------------------------
 * 4. ORDERS DB OPERATIONS
 * ------------------------------------------------------------
 */

export async function fetchOrders(): Promise<Order[]> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetchOrders error:', error);
      return getLocalOrders();
    }

    const mapped = (data as any[]).map(item => ({
      ...item,
      items: typeof item.items === 'string' ? JSON.parse(item.items) : item.items,
      shippingInfo: typeof item.shippingInfo === 'string' ? JSON.parse(item.shippingInfo) : item.shippingInfo,
    }));

    // Cache locally
    localStorage.setItem('bunon_orders_v2', JSON.stringify(mapped));
    return mapped;
  } catch (err) {
    console.error('Fetch orders error, reading local state:', err);
    return getLocalOrders();
  }
}

function getLocalOrders(): Order[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('bunon_orders_v2');
  return stored ? JSON.parse(stored) : [];
}

export async function insertOrder(order: Order): Promise<boolean> {
  try {
    const payload = {
      id: order.id,
      items: order.items, // jsonb handles object/array
      totalPrice: Number(order.totalPrice),
      shippingInfo: order.shippingInfo, // jsonb handles object
      paymentMethod: order.paymentMethod,
      status: order.status,
      date: order.date
    };

    const { error } = await supabase.from('orders').insert(payload);
    if (error) {
      console.error('Supabase insertOrder error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Insert order exception:', err);
    return false;
  }
}

export async function updateOrderStatus(orderId: string, status: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      console.error('Supabase updateOrderStatus error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Update order status exception:', err);
    return false;
  }
}

export async function deleteOrder(orderId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('orders').delete().eq('id', orderId);
    if (error) {
      console.error('Supabase deleteOrder error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Delete order exception:', err);
    return false;
  }
}

export async function clearAllOrdersInDb(ordersList: Order[]): Promise<boolean> {
  try {
    if (ordersList.length === 0) return true;
    const ids = ordersList.map(o => o.id);
    const { error } = await supabase.from('orders').delete().in('id', ids);
    if (error) {
      console.error('Supabase clearAllOrdersInDb error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Clear orders exception:', err);
    return false;
  }
}

/**
 * ------------------------------------------------------------
 * 5. BACKGROUND STATE DIFFERENTIAL SYNCHRONIZERS
 * ------------------------------------------------------------
 */

export async function syncProducts(newList: Product[], oldList: Product[]) {
  try {
    // 1. Identify deleted products
    const deleted = oldList.filter(o => !newList.some(n => n.id === o.id));
    for (const item of deleted) {
      await deleteProduct(item.id);
    }

    // 2. Identify created or modified products
    const toUpsert = newList.filter(n => {
      const oldItem = oldList.find(o => o.id === n.id);
      if (!oldItem) return true; // newly added
      return JSON.stringify(n) !== JSON.stringify(oldItem); // modified
    });

    for (const item of toUpsert) {
      await upsertProduct(item);
    }
  } catch (err) {
    console.error('syncProducts error:', err);
  }
}

export async function syncReviews(newList: Review[], oldList: Review[]) {
  try {
    const deleted = oldList.filter(o => !newList.some(n => n.id === o.id));
    for (const item of deleted) {
      await deleteReview(item.id);
    }

    const toInsert = newList.filter(n => !oldList.some(o => o.id === n.id));
    for (const item of toInsert) {
      await insertReview(item);
    }
  } catch (err) {
    console.error('syncReviews error:', err);
  }
}

export async function syncUpdates(newList: BrandUpdate[], oldList: BrandUpdate[]) {
  try {
    const deleted = oldList.filter(o => !newList.some(n => n.id === o.id));
    for (const item of deleted) {
      await deleteUpdate(item.id);
    }

    const toUpsert = newList.filter(n => {
      const oldItem = oldList.find(o => o.id === n.id);
      if (!oldItem) return true;
      return JSON.stringify(n) !== JSON.stringify(oldItem);
    });

    for (const item of toUpsert) {
      await upsertUpdate(item);
    }
  } catch (err) {
    console.error('syncUpdates error:', err);
  }
}

export async function syncOrders(newList: Order[], oldList: Order[]) {
  try {
    const deleted = oldList.filter(o => !newList.some(n => n.id === o.id));
    for (const item of deleted) {
      await deleteOrder(item.id);
    }

    const toUpsert = newList.filter(n => {
      const oldItem = oldList.find(o => o.id === n.id);
      if (!oldItem) return true;
      return JSON.stringify(n) !== JSON.stringify(oldItem);
    });

    for (const item of toUpsert) {
      // Create/Update orders inside DB
      const payload = {
        id: item.id,
        items: item.items,
        totalPrice: Number(item.totalPrice),
        shippingInfo: item.shippingInfo,
        paymentMethod: item.paymentMethod,
        status: item.status,
        date: item.date
      };
      await supabase.from('orders').upsert(payload);
    }
  } catch (err) {
    console.error('syncOrders error:', err);
  }
}

/**
 * ------------------------------------------------------------
 * 6. USER PROFILES DB OPERATIONS (Supabase Backed)
 * ------------------------------------------------------------
 */

export function normalizePhoneNumber(phone: string): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  // Bangladesh numbers have 11 digits starting with 01 e.g. 01855223656
  // If it starts with 880 (e.g. 8801855223656 is 13 digits), strip 88 to leave 01855223656
  if (digits.startsWith('880') && digits.length > 11) {
    return digits.substring(2);
  }
  // If user typed 1855223656 (10 digits), prepend a '0'
  if (digits.length === 10 && !digits.startsWith('0')) {
    return '0' + digits;
  }
  return digits;
}

export async function fetchProfileFromDb(query: string): Promise<UserProfile | null> {
  try {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return null;
    
    // Normalization calculations
    const normalizedQuery = normalizePhoneNumber(cleanQuery);
    
    // Generate phone variations for wide matching
    const phoneCandidates = [cleanQuery];
    if (normalizedQuery) {
      if (!phoneCandidates.includes(normalizedQuery)) {
        phoneCandidates.push(normalizedQuery);
      }
      const rawDigits = normalizedQuery.startsWith('0') ? normalizedQuery.substring(1) : normalizedQuery;
      const variations = [
        normalizedQuery,
        '0' + rawDigits,
        '88' + normalizedQuery,
        '+88' + normalizedQuery,
        '880' + rawDigits,
        '+880' + rawDigits
      ];
      variations.forEach(v => {
        if (!phoneCandidates.includes(v)) {
          phoneCandidates.push(v);
        }
      });
    }

    // Search by phone candidates using native .in() filter
    const { data: phoneData, error: phoneErr } = await supabase
      .from('profiles')
      .select('*')
      .in('phone', phoneCandidates);
      
    if (!phoneErr && phoneData && phoneData.length > 0) {
      const p = phoneData[0];
      return {
        name: p.name,
        phone: p.phone,
        email: p.email || '',
        avatarUrl: p.avatarUrl || undefined
      };
    }
    
    // Search by email as fallback
    const { data: emailData, error: emailErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', cleanQuery);
      
    if (!emailErr && emailData && emailData.length > 0) {
      const p = emailData[0];
      return {
        name: p.name,
        phone: p.phone,
        email: p.email || '',
        avatarUrl: p.avatarUrl || undefined
      };
    }
    
    // Fallback search in browser localStorage with smart phone normalization
    const storedUsers = localStorage.getItem('bunon_registered_users');
    if (storedUsers) {
      const users: UserProfile[] = JSON.parse(storedUsers);
      const matched = users.find(u => {
        const uPhoneNormalized = normalizePhoneNumber(u.phone);
        const qPhoneNormalized = normalizePhoneNumber(cleanQuery);
        if (uPhoneNormalized && qPhoneNormalized && uPhoneNormalized === qPhoneNormalized) {
          return true;
        }
        const uPhone = u.phone.trim().toLowerCase();
        return phoneCandidates.some(pc => uPhone === pc) || 
          (u.email && u.email.trim().toLowerCase() === cleanQuery);
      });
      if (matched) return matched;
    }
    
    return null;
  } catch (err) {
    console.error('Fetch profile exception, falling back:', err);
    // Local storage fallback
    try {
      const storedUsers = localStorage.getItem('bunon_registered_users');
      if (storedUsers) {
        const users: UserProfile[] = JSON.parse(storedUsers);
        const cleanQuery = query.trim().toLowerCase();
        const qPhoneNormalized = normalizePhoneNumber(cleanQuery);
        const matched = users.find(u => {
          const uPhoneNormalized = normalizePhoneNumber(u.phone);
          if (uPhoneNormalized && qPhoneNormalized && uPhoneNormalized === qPhoneNormalized) {
            return true;
          }
          return u.phone.trim().toLowerCase() === cleanQuery || 
                 (u.email && u.email.trim().toLowerCase() === cleanQuery);
        });
        if (matched) return matched;
      }
    } catch (e) {}
    return null;
  }
}

export async function upsertProfileInDb(profile: UserProfile): Promise<boolean> {
  // Update local cache first so it is instant and reliable
  try {
    const storedUsers = localStorage.getItem('bunon_registered_users');
    const users: UserProfile[] = storedUsers ? JSON.parse(storedUsers) : [];
    const filtered = users.filter(u => 
      normalizePhoneNumber(u.phone) !== normalizePhoneNumber(profile.phone)
    );
    localStorage.setItem('bunon_registered_users', JSON.stringify([profile, ...filtered]));
  } catch (je) {
    console.error('Failed to save to local registry cache', je);
  }

  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        phone: profile.phone.trim(),
        name: profile.name,
        email: profile.email ? profile.email.trim() : null,
        avatarUrl: profile.avatarUrl || null
      });
      
    if (error) {
      console.warn('upsertProfileInDb Supabase non-fatal table warning (using local fallback cache):', error);
    }
    return true;
  } catch (err) {
    console.warn('upsertProfileInDb exception caught gracefully (using local fallback cache):', err);
    return true;
  }
}

