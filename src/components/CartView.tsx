/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Trash2, ShoppingBag, Plus, Minus, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { CartItem } from '../types';

interface CartViewProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
  onGoBack: () => void;
}

export default function CartView({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onGoBack
}: CartViewProps) {
  const itemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const itemsTotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  
  // Free shipping above 2000 BDT or simple flat rate 80 BDT
  const shippingFee = itemsCount > 0 ? (itemsTotal > 2000 ? 0 : 80) : 0; 
  const grandTotal = itemsTotal + shippingFee;

  if (cartItems.length === 0) {
    return (
      <div className="font-sans text-center py-16 bg-white rounded-3xl border border-zinc-150 p-8 shadow-sm max-w-lg mx-auto">
        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-600 mb-6 border border-amber-100">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-zinc-900">আপনার শপিং ব্যাগ সম্পূর্ণ খালি!</h2>
        <p className="text-xs text-zinc-400 mt-2 max-w-sm mx-auto leading-relaxed">
          আপনার কেনাকাটার ব্যাগে বর্তমানে কোনো পোশাক নেই। আমাদের চমৎকার ট্রেন্ডি টি-শার্ট ও কলার পোলো কালেকশন দেখতে এখনই আমাদের স্টোর ঘুরে দেখুন।
        </p>
        
        <button
          onClick={onGoBack}
          className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 bg-zinc-950 text-white font-black text-xs uppercase tracking-widest rounded-full shadow-lg hover:bg-amber-500 hover:text-zinc-950 transition-all active:scale-95 cursor-pointer"
        >
          কালেকশনস ব্রাউজ করুন
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="font-sans max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="border-l-4 border-amber-500 pl-4 py-0.5">
          <h1 className="text-2xl font-black text-zinc-950 tracking-tight">আপনার শপিং ব্যাগ ({itemsCount} টি পোশাক)</h1>
          <p className="text-xs text-zinc-500 mt-1 uppercase font-bold tracking-wider">আপনার পছন্দের ডিজাইনের সঠিক পরিমাণ মিলিয়ে নিন</p>
        </div>
        
        <button
          onClick={onGoBack}
          className="inline-flex items-center gap-2 text-xs font-black text-zinc-700 bg-zinc-100 px-4.5 py-2.5 rounded-xl border border-zinc-200 hover:bg-zinc-200 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          শপিং চালিয়ে যান
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left column - Cart lists */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div 
              key={item.product.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-2xl border border-zinc-150 gap-4 shadow-xs hover:border-zinc-350 transition-colors"
              id={`cart-item-${item.product.id}`}
            >
              <div className="flex items-center gap-4">
                <img 
                  src={item.product.imageUrl} 
                  alt={item.product.banglaName} 
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-2xl border border-zinc-100 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-1 text-left">
                  <span className="text-[9px] bg-amber-500/10 text-amber-700 border border-amber-500/15 font-black px-2.5 py-1 rounded-md uppercase">
                    {item.product.categoryBangla}
                  </span>
                  <h3 className="font-black text-zinc-950 text-sm sm:text-base line-clamp-1 leading-snug">
                    {item.product.banglaName}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-bold font-mono">
                    <span>১টি ৳{item.product.price}</span>
                    <span>•</span>
                    <span className="text-amber-600">ইনভেন্টরি স্টক: {item.product.stock} টি</span>
                  </div>
                </div>
              </div>

              {/* Adjust counter & trash */}
              <div className="flex items-center justify-between sm:justify-start gap-4 sm:gap-6 border-t sm:border-none pt-3 sm:pt-0">
                
                {/* Counter control */}
                <div className="flex items-center border border-zinc-250 rounded-xl bg-zinc-50 p-1 shadow-inner">
                  <button
                    onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="w-7 h-7 rounded-lg text-zinc-500 hover:bg-white disabled:opacity-45 transition-colors flex items-center justify-center font-bold"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center font-black font-sans text-zinc-900 text-xs">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
                    className="w-7 h-7 rounded-lg text-zinc-500 hover:bg-white disabled:opacity-45 transition-colors flex items-center justify-center font-bold"
                  >
                    <Minus className="w-3 h-3 rotate-90" />
                  </button>
                </div>

                {/* Subtotal */}
                <div className="flex items-center gap-4">
                  <div className="text-right flex flex-col">
                    <span className="text-[9px] text-zinc-400 font-black uppercase leading-none mb-0.5">টোটাল</span>
                    <span className="font-black text-zinc-950 text-sm sm:text-base font-sans tracking-tight">
                      ৳{item.product.price * item.quantity}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="p-2 border border-zinc-150 hover:border-zinc-300 rounded-xl hover:bg-rose-50 text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>
          ))}
        </div>

        {/* Right summary column */}
        <div className="bg-white rounded-3xl border border-zinc-150 p-6 space-y-6 shadow-xs sticky top-24">
          <h2 className="font-extrabold text-zinc-950 text-base border-b border-zinc-100 pb-3 uppercase tracking-wider">পোশাক অর্ডার সারসংক্ষেপ</h2>

          <div className="space-y-4 text-xs text-zinc-600">
            <div className="flex items-center justify-between">
              <span className="font-medium">পোশাক সাবটোটাল ({itemsCount} টি):</span>
              <span className="font-black font-sans text-zinc-950">
                ৳{itemsTotal}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium">ডেলিভারি শিপিং চার্জ:</span>
              <span className="font-black font-sans text-zinc-950">
                {shippingFee === 0 ? (
                  <span className="text-emerald-700 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-emerald-50 rounded-md border border-emerald-100">ফ্রি</span>
                ) : (
                  `৳${shippingFee}`
                )}
              </span>
            </div>

            {shippingFee > 0 && (
              <p className="text-[10px] text-zinc-500 bg-amber-500/10 border border-amber-500/15 p-2.5 rounded-xl leading-relaxed">
                * আর মাত্র <b>৳{2000 - itemsTotal}</b> টাকার পোশাক শপ করলে ডেলিভারি চার্জ সম্পূর্ণ <strong>ফ্রি</strong> পাবেন!
              </p>
            )}

            <div className="h-px bg-zinc-100 my-4" />

            <div className="flex items-center justify-between text-sm">
              <span className="font-extrabold text-zinc-900 block leading-none">সর্বমোট প্রদেয় বিল:</span>
              <span className="text-lg font-black text-zinc-950 font-sans tracking-tight">
                ৳{grandTotal}
              </span>
            </div>
          </div>

          <button
            onClick={onCheckout}
            className="w-full py-4 bg-zinc-950 hover:bg-amber-500 hover:text-zinc-950 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer mt-4"
            id="cart-checkout-btn"
          >
            অর্ডার করতে এগিয়ে যান
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>

          {/* Guarantee info */}
          <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-400 pt-3 border-t border-zinc-100 leading-none font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>নিরাপদ ক্যাশ অন ডেলিভারি গেটওয়ে</span>
          </div>

        </div>

      </div>
    </div>
  );
}
