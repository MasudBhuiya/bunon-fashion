/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Award, Shield, RotateCcw, AlertCircle, Phone, HelpCircle } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import CartView from './components/CartView';
import CheckoutView from './components/CheckoutView';
import OrdersView from './components/OrdersView';
import ReviewHub from './components/ReviewHub';
import UpdatesPage from './components/UpdatesPage';
import AdminPanel from './components/AdminPanel';
import PremiumHomeSections from './components/PremiumHomeSections';

import { PRODUCTS, INITIAL_REVIEWS, INITIAL_UPDATES } from './data';
import { Product, CartItem, Order, Review, BrandUpdate, UserProfile } from './types';
import { 
  fetchProducts, 
  fetchReviews, 
  fetchUpdates, 
  fetchOrders, 
  syncProducts, 
  syncReviews, 
  syncUpdates, 
  syncOrders,
  upsertProfileInDb
} from './lib/db';

export default function App() {
  // Navigation State
  const [currentView, setView] = useState<string>('home'); // home, products, product-detail, cart, checkout, orders, reviews, updates, admin
  
  // Admin Login State initialized safely
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('bunon_admin_is_logged_in') === 'true';
    }
    return false;
  });
  
  // Filtering & Catalog state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Core Dynamic Store States (Decoupled for Easy Firebase Cloud transition later!)
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [updates, setUpdates] = useState<BrandUpdate[]>(INITIAL_UPDATES);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('bunon_user_profile');
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });

  // Synchronize active userProfile changes with localStorage AND update/insert in global customer registry list automatically
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (userProfile) {
      localStorage.setItem('bunon_user_profile', JSON.stringify(userProfile));
      try {
        const storedUsers = localStorage.getItem('bunon_registered_users');
        const users: UserProfile[] = storedUsers ? JSON.parse(storedUsers) : [];
        const filtered = users.filter(u => 
          u.phone.trim().toLowerCase() !== userProfile.phone.trim().toLowerCase() && 
          (!userProfile.email || !u.email || u.email.trim().toLowerCase() !== userProfile.email.trim().toLowerCase())
        );
        localStorage.setItem('bunon_registered_users', JSON.stringify([userProfile, ...filtered]));
      } catch (e) {
        console.error('Error synchronizing active userProfile to customers directory', e);
      }
    } else {
      localStorage.removeItem('bunon_user_profile');
    }
  }, [userProfile]);


  // Load persistence states from local storage on mount (fast fallback) and then sync from Supabase (source of truth)
  useEffect(() => {
    // 1. Immediately load local storage cached values (optimistic fast UI)
    try {
      const storedCart = localStorage.getItem('bunon_cart_v2');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
      const storedOrders = localStorage.getItem('bunon_orders_v2');
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      }
      const storedProducts = localStorage.getItem('bunon_products_v2');
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      }
      const storedReviews = localStorage.getItem('bunon_reviews_v2');
      if (storedReviews) {
        setReviews(JSON.parse(storedReviews));
      }
      const storedUpdates = localStorage.getItem('bunon_updates_v2');
      if (storedUpdates) {
        setUpdates(JSON.parse(storedUpdates));
      }
    } catch (e) {
      console.error('Error loading data from local storage', e);
    }

    // 2. Fetch fresh real-time data from Supabase asynchronously
    async function loadSupabaseData() {
      try {
        const [dbProducts, dbReviews, dbUpdates, dbOrders] = await Promise.all([
          fetchProducts(),
          fetchReviews(),
          fetchUpdates(),
          fetchOrders()
        ]);
        
        // --- Smart Self-Healing Auto-Sync ---

        // A. Orders self-heal
        let localOrders: Order[] = [];
        try {
          const loStr = localStorage.getItem('bunon_orders_v2');
          localOrders = loStr ? JSON.parse(loStr) : [];
        } catch (e) {}
        
        const localOnlyOrders = localOrders.filter(lo => !dbOrders.some(dbo => dbo.id === lo.id));
        if (localOnlyOrders.length > 0) {
          console.log('Self-Healing: Syncing local-only orders to Supabase...', localOnlyOrders);
          for (const ord of localOnlyOrders) {
            await syncOrders([ord], []); // Pushes to Supabase
          }
        }
        const mergedOrders = [...dbOrders];
        localOnlyOrders.forEach(lo => {
          if (!mergedOrders.some(m => m.id === lo.id)) {
            mergedOrders.push(lo);
          }
        });
        setOrders(mergedOrders);
        localStorage.setItem('bunon_orders_v2', JSON.stringify(mergedOrders));

        // B. Products self-heal
        let localProducts: Product[] = [];
        try {
          const lpStr = localStorage.getItem('bunon_products_v2');
          localProducts = lpStr ? JSON.parse(lpStr) : [];
        } catch (e) {}

        const localOnlyProducts = localProducts.filter(lp => lp.id.startsWith('prod_') && !dbProducts.some(dbp => dbp.id === lp.id));
        if (localOnlyProducts.length > 0) {
          console.log('Self-Healing: Syncing local-only products to Supabase...', localOnlyProducts);
          for (const prod of localOnlyProducts) {
            await syncProducts([prod], []); // Pushes to Supabase
          }
        }
        const mergedProducts = [...dbProducts];
        localOnlyProducts.forEach(lp => {
          if (!mergedProducts.some(m => m.id === lp.id)) {
            mergedProducts.push(lp);
          }
        });
        setProducts(mergedProducts);
        localStorage.setItem('bunon_products_v2', JSON.stringify(mergedProducts));

        // C. Reviews self-heal
        let localReviews: Review[] = [];
        try {
          const lrStr = localStorage.getItem('bunon_reviews_v2');
          localReviews = lrStr ? JSON.parse(lrStr) : [];
        } catch (e) {}

        const localOnlyReviews = localReviews.filter(lr => lr.id.startsWith('rev_') && !dbReviews.some(dbr => dbr.id === lr.id));
        if (localOnlyReviews.length > 0) {
          console.log('Self-Healing: Syncing local-only reviews to Supabase...', localOnlyReviews);
          for (const rev of localOnlyReviews) {
            await syncReviews([rev], []); // Pushes to Supabase
          }
        }
        const mergedReviews = [...dbReviews];
        localOnlyReviews.forEach(lr => {
          if (!mergedReviews.some(m => m.id === lr.id)) {
            mergedReviews.push(lr);
          }
        });
        setReviews(mergedReviews);
        localStorage.setItem('bunon_reviews_v2', JSON.stringify(mergedReviews));

        // D. Announcements self-heal
        let localUpdates: BrandUpdate[] = [];
        try {
          const luStr = localStorage.getItem('bunon_updates_v2');
          localUpdates = luStr ? JSON.parse(luStr) : [];
        } catch (e) {}

        const localOnlyUpdates = localUpdates.filter(lu => lu.id.startsWith('update_') && !dbUpdates.some(dbu => dbu.id === lu.id));
        if (localOnlyUpdates.length > 0) {
          console.log('Self-Healing: Syncing local-only announcements to Supabase...', localOnlyUpdates);
          for (const upd of localOnlyUpdates) {
            await syncUpdates([upd], []); // Pushes to Supabase
          }
        }
        const mergedUpdates = [...dbUpdates];
        localOnlyUpdates.forEach(lu => {
          if (!mergedUpdates.some(m => m.id === lu.id)) {
            mergedUpdates.push(lu);
          }
        });
        setUpdates(mergedUpdates);
        localStorage.setItem('bunon_updates_v2', JSON.stringify(mergedUpdates));

        // E. Customer Profile self-heal
        let localProfile: UserProfile | null = null;
        try {
          const lpStr = localStorage.getItem('bunon_user_profile');
          if (lpStr) localProfile = JSON.parse(lpStr);
        } catch (e) {}

        if (localProfile) {
          console.log('Self-Healing: Syncing local customer profile registration to Supabase...', localProfile);
          await upsertProfileInDb(localProfile);
        }

        console.log('Successfully synchronized and self-healed all data with Supabase!');
      } catch (err) {
        console.error('Error fetching data from Supabase, relying on local storage fallback:', err);
      }
    }

    loadSupabaseData();
  }, []);

  // Save changes wrapper functions with Automatic Supabase Sync
  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem('bunon_cart_v2', JSON.stringify(items));
    // Cart is purely client-side/session based
  };

  const saveOrders = (newOrders: Order[]) => {
    const oldOrders = [...orders];
    setOrders(newOrders);
    localStorage.setItem('bunon_orders_v2', JSON.stringify(newOrders));
    syncOrders(newOrders, oldOrders);
  };

  const saveProductsState = (list: Product[]) => {
    const oldProducts = [...products];
    setProducts(list);
    localStorage.setItem('bunon_products_v2', JSON.stringify(list));
    syncProducts(list, oldProducts);
  };

  const saveReviewsState = (list: Review[]) => {
    const oldReviews = [...reviews];
    setReviews(list);
    localStorage.setItem('bunon_reviews_v2', JSON.stringify(list));
    syncReviews(list, oldReviews);
  };

  const saveUpdatesState = (list: BrandUpdate[]) => {
    const oldUpdates = [...updates];
    setUpdates(list);
    localStorage.setItem('bunon_updates_v2', JSON.stringify(list));
    syncUpdates(list, oldUpdates);
  };

  // Cart logic
  const handleAddToCart = (product: Product, qty: number = 1) => {
    const existingIndex = cartItems.findIndex((item) => item.product.id === product.id);
    let updatedCart = [...cartItems];

    if (existingIndex > -1) {
      const newQty = updatedCart[existingIndex].quantity + qty;
      updatedCart[existingIndex].quantity = Math.min(newQty, product.stock);
    } else {
      updatedCart.push({ product, quantity: Math.min(qty, product.stock) });
    }

    saveCart(updatedCart);
  };

  const handleUpdateCartQuantity = (productId: string, newQty: number) => {
    const item = cartItems.find((i) => i.product.id === productId);
    if (!item) return;

    const cleanQty = Math.max(1, Math.min(newQty, item.product.stock));
    const updatedCart = cartItems.map((cartItem) => 
      cartItem.product.id === productId 
        ? { ...cartItem, quantity: cleanQty } 
        : cartItem
    );

    saveCart(updatedCart);
  };

  const handleRemoveCartItem = (productId: string) => {
    const updatedCart = cartItems.filter((item) => item.product.id !== productId);
    saveCart(updatedCart);
  };

  const handleOrderPlaced = (order: Order) => {
    // Save/update user profile automatically from shipping info
    const profile: UserProfile = {
      name: order.shippingInfo.name,
      phone: order.shippingInfo.phone,
      email: order.shippingInfo.email,
      avatarUrl: userProfile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop'
    };
    setUserProfile(profile);
    localStorage.setItem('bunon_user_profile', JSON.stringify(profile));

    // Save and sync this user profile directly to Supabase table
    upsertProfileInDb(profile).catch(err => {
      console.error('Failed to sync customer profile to Supabase on order placement:', err);
    });

    const updatedOrders = [order, ...orders];
    saveOrders(updatedOrders);
    
    // Decrement item stocks
    const updatedProducts = products.map(p => {
      const boughtItem = order.items.find(i => i.product.id === p.id);
      if (boughtItem) {
        return { ...p, stock: Math.max(0, p.stock - boughtItem.quantity) };
      }
      return p;
    });
    saveProductsState(updatedProducts);

    saveCart([]); // Clear shopping cart
    setSelectedProductId(null);
    setView('orders'); // Redirect customer to order history logs instantly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearOrders = () => {
    saveOrders([]);
  };

  const handleCancelOrder = (orderId: string) => {
    const updatedOrders = orders.map(o => {
      if (o.id === orderId) {
        return { ...o, status: 'Cancelled' as const };
      }
      return o;
    });
    saveOrders(updatedOrders);

    // Restore item stocks in the catalog
    const targetOrder = orders.find(o => o.id === orderId);
    if (targetOrder) {
      const restoredProducts = products.map(p => {
        const item = targetOrder.items.find(i => i.product.id === p.id);
        if (item) {
          return { ...p, stock: p.stock + item.quantity };
        }
        return p;
      });
      saveProductsState(restoredProducts);
    }
  };

  const handleViewProductDetails = (productId: string) => {
    setSelectedProductId(productId);
    setView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setView('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add customer feedback dynamically (No registration/login required)
  const handleAddNewReview = (newRev: Omit<Review, 'id' | 'date'>) => {
    // Generate dates inside
    const today = new Date();
    const formatter = new Intl.DateTimeFormat('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' });
    const formattedDate = formatter.format(today);

    const fullReview: Review = {
      ...newRev,
      id: 'rev_' + Date.now(),
      date: formattedDate
    };

    const updated = [fullReview, ...reviews];
    saveReviewsState(updated);

    // Update reviews rating average and count in targeting product
    const targetProductName = newRev.productName;
    const updatedProducts = products.map((p) => {
      if (p.banglaName === targetProductName || p.name === targetProductName) {
        const currentCount = p.reviewsCount || 0;
        const currentRating = p.rating || 5.0;
        const newCount = currentCount + 1;
        // Simple recalculation average
        const newRating = Number(((currentRating * currentCount + newRev.rating) / newCount).toFixed(1));
        return { ...p, reviewsCount: newCount, rating: newRating };
      }
      return p;
    });
    saveProductsState(updatedProducts);
  };

  // Dynamic search options to satisfy: "uporer search option jeno kaj kore"
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.banglaName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredProducts = products.filter(p => p.isFeatured);
  const activeProduct = products.find((p) => p.id === selectedProductId);

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans select-none antialiased text-zinc-900">
      
      {/* Prime Coupon ribbon on top */}
      <div className="w-full bg-linear-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white text-[11px] sm:text-xs py-2 px-4 text-center font-bold flex items-center justify-center gap-2 overflow-hidden border-b border-zinc-800">
        <Sparkles className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
        <span className="truncate">
          সীমিত অফার! ২০% সরাসরি ছাড়ের জন্য কুপন কোড ব্যবহার করুন: <strong className="text-amber-400 font-black tracking-wider bg-zinc-900 py-0.5 px-2 rounded-sm ml-1 border border-zinc-800">BUNONEED20</strong> | কুরিয়ার শিপিং ফাস্ট ডেলিভারি!
        </span>
      </div>

      {/* Responsive unified navigation header */}
      <Header
        currentView={currentView}
        setView={setView}
        cartCount={totalCartCount}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isAdminLoggedIn={isAdminLoggedIn}
        userProfile={userProfile}
      />

      {/* Main view container block with clean animation flow */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <AnimatePresence mode="wait">
          
          {/* 1. HOMEPAGE VIEW */}
          {currentView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-16"
            >
              {/* Dynamic core carousel banner and category selection list */}
              <Hero 
                onCategorySelect={handleCategorySelect} 
                selectedCategory={selectedCategory}
                onExploreClick={() => {
                  setSelectedCategory('all');
                  setView('products');
                }}
              />

              {/* Three gorgeous credentials row boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-white border border-zinc-200/80 p-6 sm:p-8 rounded-3xl shadow-xs">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-zinc-900 text-base">১০০% কম্বড কাঁচা কটন</h3>
                    <p className="text-[11px] text-zinc-500 mt-1 leading-normal">সবচেয়ে আরামদায়ক ২৪০ ও ২৬০ GSM ফ্যাব্রিকস সুতা যাতে গরমেও শরীর থাকবে সম্পূর্ণ ঠান্ডা ও ঘামমুক্ত।</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 border-y sm:border-y-0 sm:border-x border-zinc-150 py-5 sm:py-0 sm:px-6">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-zinc-900 text-base">রিয়েল মডারেশন ও ট্র্যাকিং</h3>
                    <p className="text-[11px] text-zinc-500 mt-1 leading-normal">পেন্ডিং আইটেম শিপড করার সাথে সাথে নোটিফাইড ট্র্যাকিং ও বিকাশ/নগদে ক্যাশব্যাক নিশ্চয়তা।</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
                    <RotateCcw className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-zinc-900 text-base">৭ দিনের এক্সচেঞ্জ পলিসি</h3>
                    <p className="text-[11px] text-zinc-500 mt-1 leading-normal">সাইজ বা ফিটিংস নিয়ে অসন্তুষ্ট হলে এক ক্লিকে যেকোনো প্রান্ত থেকে পরিবর্তন সুবিধা পাবেন।</p>
                  </div>
                </div>
              </div>

              {/* Featured Best Sellers Section */}
              <div className="space-y-6">
                <div className="border-l-4 border-amber-500 pl-4 py-0.5">
                  <h2 className="text-2xl font-black text-zinc-900 tracking-tight">আমাদের সেরা ট্রেন্ডিং কালেকশন (Featured Products)</h2>
                  <p className="text-xs text-zinc-500 mt-1 uppercase font-bold tracking-wider">বুননের সিগনেচার টি-শার্ট ও প্রিমিয়াম লাকোস্ট কলার পোলো কালেকশনস</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {featuredProducts.slice(0, 4).map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={(p) => handleAddToCart(p)}
                      onViewDetails={handleViewProductDetails}
                    />
                  ))}
                </div>

                <div className="text-center pt-4">
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setView('products');
                    }}
                    className="inline-flex items-center gap-2.5 px-8 py-4 bg-zinc-950 text-white font-black text-xs uppercase tracking-widest rounded-full hover:bg-amber-400 hover:text-zinc-900 transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer"
                  >
                    সব কালেকশন ব্রাউজ করুন
                  </button>
                </div>
              </div>

              {/* Dynamic Premium High-Impact Sections */}
              <PremiumHomeSections 
                onExploreCategory={handleCategorySelect}
                products={products}
                onAddToCart={handleAddToCart}
              />

            </motion.div>
          )}

          {/* 2. ALL PRODUCTS CATEGORY CATALOG */}
          {currentView === 'products' && (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
                <div className="border-l-4 border-amber-500 pl-4 py-0.5">
                  <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
                    {selectedCategory === 'all' ? 'বুনন সকল কালেকশন' : products.find(p=>p.category === selectedCategory)?.categoryBangla || 'ক্যাটালগ'}
                  </h2>
                  <p className="text-xs text-zinc-500 font-extrabold mt-1 tracking-wider uppercase">মোট {filteredProducts.length} টি প্রিমিয়াম পোশাক খুঁজে পাওয়া গেছে</p>
                </div>

                {/* Sub category filter tabs list mapping */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'all', title: 'সব পোশাক' },
                    { id: 'classic', title: 'ক্লাসিক টি-শার্ট' },
                    { id: 'oversized', title: 'ওভারসাইজড কুল' },
                    { id: 'polo', title: 'প্রিমিয়াম পোলো' },
                    { id: 'jersey', title: 'স্পোর্টস জার্সি' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-4 py-2 border rounded-xl text-xs font-black tracking-wide transition-all cursor-pointer ${
                        selectedCategory === cat.id
                          ? 'bg-zinc-950 border-zinc-950 text-white'
                          : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:bg-zinc-50'
                      }`}
                    >
                      {cat.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic search query display help if actively typing */}
              {searchQuery && (
                <div className="p-3 bg-amber-50 border border-amber-100 text-amber-800 text-xs rounded-xl font-bold">
                  🔍 সার্চ ফলাফল ফর: "<span className="text-zinc-900">{searchQuery}</span>" (মোট {filteredProducts.length} টি পাওয়া গেছে)
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="ml-3 text-rose-600 underline font-black hover:text-rose-700"
                  >
                    সার্চ বাতিল
                  </button>
                </div>
              )}

              {/* List grid */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={(p) => handleAddToCart(p)}
                      onViewDetails={handleViewProductDetails}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-3xl border border-zinc-150 p-8 shadow-xs max-w-lg mx-auto">
                  <div className="w-16 h-16 bg-zinc-150 rounded-full flex items-center justify-center mx-auto text-zinc-400 mb-6 border border-zinc-200">
                    <AlertCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-black text-zinc-900">দুঃখিত, কোনো প্রোডাক্ট খুঁজে পাওয়া যায়নি!</h3>
                  <p className="text-xs text-zinc-450 mt-2 leading-relaxed">
                    আপনার সার্চ বা সিলেক্টেড ক্যাটাগরির সাথে মিলেছে এমন কোনো ড্রেস আমাদের স্টকে আপাতত নেই। অন্য কোনো ডিজাইন লিখে খুঁজুন অথবা নিচের বাটন চেপে সবগুলো রিফ্রেশ করে নিন।
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="mt-6 px-5 py-2.5 bg-amber-500 text-zinc-950 hover:bg-amber-400 rounded-xl text-xs font-black transition-all cursor-pointer"
                  >
                    সব পোশাক রিফ্রেশ করুন
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* 3. CLOTHING SPECIFIC DETAILS MODAL VIEW */}
          {currentView === 'product-detail' && activeProduct && (
            <motion.div
              key="detail"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <ProductDetail
                product={activeProduct}
                onBack={() => setView('products')}
                onAddToCart={handleAddToCart}
              />
            </motion.div>
          )}

          {/* 4. SHOPPING BAG CART */}
          {currentView === 'cart' && (
            <motion.div
              key="cart"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <CartView
                cartItems={cartItems}
                onUpdateQuantity={handleUpdateCartQuantity}
                onRemoveItem={handleRemoveCartItem}
                onCheckout={() => setView('checkout')}
                onGoBack={() => setView('products')}
              />
            </motion.div>
          )}

          {/* 5. SECURE CHECKOUT PAGE */}
          {currentView === 'checkout' && (
            <motion.div
              key="checkout"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <CheckoutView
                cartItems={cartItems}
                onOrderPlaced={handleOrderPlaced}
                onGoBack={() => setView('cart')}
                userProfile={userProfile}
              />
            </motion.div>
          )}

          {/* 6. ORDERS VIEW TRUCKING PROGRESS */}
          {currentView === 'orders' && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <OrdersView
                orders={orders}
                onClearOrders={handleClearOrders}
                onCancelOrder={handleCancelOrder}
                onGoBack={() => setView('home')}
                userProfile={userProfile}
                onUpdateProfile={setUserProfile}
              />
            </motion.div>
          )}

          {/* 7. CUSTOMER REVIEWS PAGE (No login required) */}
          {currentView === 'reviews' && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <ReviewHub
                reviews={reviews}
                products={products}
                onAddReview={handleAddNewReview}
              />
            </motion.div>
          )}

          {/* 8. BRAND BULLETIN UPDATES TIMELINE */}
          {currentView === 'updates' && (
            <motion.div
              key="updates"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <UpdatesPage
                updates={updates}
              />
            </motion.div>
          )}

          {/* 9. BUSINESS OWNER SECURED ADMIN DASHBOARD */}
          {currentView === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <AdminPanel
                orders={orders}
                setOrders={saveOrders}
                products={products}
                setProducts={saveProductsState}
                updates={updates}
                setUpdates={saveUpdatesState}
                reviews={reviews}
                setReviews={saveReviewsState}
                onLoginChange={setIsAdminLoggedIn}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Persistent Beautiful Footer */}
      <Footer setView={setView} />

      {/* Floating Customer Help line Widget (simple er moddhe gorgeous visual details) */}
      <div className="fixed bottom-6 right-6 z-40 hidden sm:flex items-center gap-2 bg-zinc-950 text-white rounded-full p-2 border border-zinc-800 shadow-xl pl-4 pr-3.5 select-none hover:scale-105 transition-all">
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">সহায়তা: <strong className="text-amber-400">০১৮০০-বুনন</strong></span>
        <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-zinc-950">
          <Phone className="w-4 h-4 fill-current stroke-[2.5]" />
        </div>
      </div>

    </div>
  );
}
