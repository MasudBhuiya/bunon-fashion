/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, X, ClipboardList, Store, MessageSquareText, Bell, UserCog, Sparkles } from 'lucide-react';
// @ts-ignore - Vite handles static png imports natively, bypass TS module check
import brandLogo from '../assets/images/brand_logo_1780987950455.png';
import { UserProfile } from '../types';

interface HeaderProps {
  currentView: string;
  setView: (view: string) => void;
  cartCount: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isAdminLoggedIn?: boolean;
  userProfile?: UserProfile | null;
}

export default function Header({
  currentView,
  setView,
  cartCount,
  searchQuery,
  setSearchQuery,
  isAdminLoggedIn,
  userProfile
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Force set view to products to see filtered outputs instantly
    if (currentView !== 'products') {
      setView('products');
    }
  };

  const navItems = [
    { id: 'home', label: 'হোমপেজ', icon: Store },
    { id: 'products', label: 'কালেকশনস', icon: ShoppingBag },
    { id: 'reviews', label: 'রিভিউ হাব', icon: MessageSquareText },
    { id: 'updates', label: 'ব্র্যান্ড ঘোষণা', icon: Bell },
    { id: 'orders', label: 'আমার অর্ডারস', icon: ClipboardList },
    ...(isAdminLoggedIn ? [{ id: 'admin', label: 'অ্যাডমিন ড্যাশবোর্ড', icon: UserCog }] : [])
  ];

  const handleNavClick = (viewId: string) => {
    setView(viewId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800 text-zinc-100 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand Logo - Unified elegant lockup */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-1.5 cursor-pointer shrink-0 group select-none hover:opacity-95"
            id="logo-container"
          >
            <div className="w-11 h-11 rounded-xl overflow-hidden bg-zinc-900 border border-amber-500/30 flex items-center justify-center shadow-lg group-hover:scale-105 transition-all">
              <img 
                src={brandLogo} 
                alt="বুনন লোগো"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/bunon/100/100';
                }}
              />
            </div>
            <div className="flex flex-col pl-1 border-l border-zinc-800/80 gap-0.5">
              <div className="flex items-baseline gap-1">
                <span className="font-extrabold text-lg sm:text-xl text-white tracking-tight leading-none bg-linear-to-r from-white to-zinc-300 bg-clip-text text-transparent">
                  বুনন
                </span>
                <span className="text-amber-500 font-extrabold text-[10px] sm:text-xs tracking-wider leading-none">
                  BUNON
                </span>
              </div>
              <span className="text-[8px] font-black text-zinc-400 tracking-wider leading-none uppercase">
                THREADS & TRENDS
              </span>
            </div>
          </div>

          {/* Fully Interactive Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-sm lg:max-w-md relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <Search className="h-4 w-4 text-zinc-400" />
            </div>
            <input
              type="text"
              placeholder="পছন্দের টি-শার্ট বা পোলো খুঁজুন..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="block w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-850 rounded-full text-zinc-100 text-sm placeholder-zinc-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-zinc-900/80 transition-all shadow-inner"
            />
          </div>

          {/* Navigation - Desktop (Subtle, sleek hover highlights) */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              const isOrders = item.id === 'orders';
              const showAvatar = isOrders && userProfile?.avatarUrl;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-amber-500 text-zinc-950 font-black shadow-lg shadow-amber-500/15'
                      : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                  }`}
                  id={`nav-${item.id}`}
                >
                  {showAvatar ? (
                    <img 
                      src={userProfile.avatarUrl} 
                      alt="avatar" 
                      className="w-4 h-4 rounded-full border border-zinc-800 object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                  )}
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Cart Icon & Mobile Menu Triggers */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Search option in mobile header to ensure it works */}
            <div className="md:hidden relative flex items-center">
              <input
                type="text"
                placeholder="খুঁজুন..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-24 sm:w-36 pl-8 pr-2.5 py-1.5 bg-zinc-900 text-zinc-200 border border-zinc-800 rounded-full text-[11px] placeholder-zinc-500 focus:outline-hidden focus:ring-1 focus:ring-amber-500/40 focus:bg-zinc-800 transition-all"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none">
                <Search className="h-3 w-3 text-zinc-500" />
              </div>
            </div>

            {/* Shopping Bag and Count */}
            <button
              onClick={() => handleNavClick('cart')}
              className={`relative p-2.5 rounded-full border transition-all hover:scale-105 active:scale-95 flex items-center justify-center ${
                currentView === 'cart' 
                  ? 'border-amber-500 bg-amber-500 text-zinc-950 font-bold' 
                  : 'border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-805'
              }`}
              id="header-cart-btn"
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-rose-600 rounded-full animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Nav Drawer trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 transition-all"
              id="mobile-menu-trigger"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Advanced Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-zinc-800 bg-zinc-950 animate-fadeIn shadow-2xl relative z-50">
          <div className="px-4 pt-2.5 pb-6 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              const isOrders = item.id === 'orders';
              const showAvatar = isOrders && userProfile?.avatarUrl;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                  }`}
                  id={`nav-mobile-${item.id}`}
                >
                  {showAvatar ? (
                    <img 
                      src={userProfile.avatarUrl} 
                      alt="avatar" 
                      className="w-5 h-5 rounded-full border border-zinc-800 object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <Icon className="w-4.5 h-4.5 text-zinc-400 shrink-0" />
                  )}
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
