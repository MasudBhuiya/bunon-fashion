/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, Star, ShoppingCart, Check, ShieldCheck, BadgeCheck, RotateCcw, Flame } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export default function ProductDetail({
  product,
  onBack,
  onAddToCart
}: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('L');
  const [isAdded, setIsAdded] = useState(false);

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="font-sans bg-white rounded-3xl border border-zinc-150 p-4 sm:p-8 shadow-sm">
      
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 px-4.5 py-2.5 hover:bg-zinc-50 border border-zinc-200 rounded-full text-xs font-bold text-zinc-600 transition-all mb-8 group cursor-pointer"
        id="product-detail-back-btn"
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
        কালেকশনসে ফিরে যান
      </button>

      {/* Grid wrapper */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-11 items-start">
        
        {/* Left column: Visual clothing framing */}
        <div className="space-y-4">
          <div className="relative aspect-4/3 rounded-2xl overflow-hidden border border-zinc-150 bg-zinc-50 shadow-inner">
            <img
              src={product.imageUrl}
              alt={product.banglaName}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {product.stock <= 5 && (
              <span className="absolute bottom-4 left-4 bg-rose-600 text-white text-xs font-black px-3.5 py-1.5 rounded-xl border border-rose-500 shadow-lg flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 animate-bounce" />
                লাস্ট কলার স্টক (মাত্র {product.stock} টি বাঁকি!)
              </span>
            )}
          </div>
          
          {/* Support credentials columns */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-zinc-50 border border-zinc-150 rounded-xl text-center flex flex-col items-center justify-center">
              <BadgeCheck className="w-5 h-5 text-amber-500 mb-1" />
              <span className="text-[10px] font-black text-zinc-800 block">১০০% অর্গানিক সুতা</span>
            </div>
            <div className="p-3 bg-zinc-50 border border-zinc-150 rounded-xl text-center flex flex-col items-center justify-center">
              <RotateCcw className="w-5 h-5 text-rose-500 mb-1" />
              <span className="text-[10px] font-black text-zinc-800 block">৭ দিনে ইজি এক্সচেঞ্জ</span>
            </div>
            <div className="p-3 bg-zinc-50 border border-zinc-150 rounded-xl text-center flex flex-col items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-600 mb-1" />
              <span className="text-[10px] font-black text-zinc-800 block">ক্যাশ অন ডেলিভারি</span>
            </div>
          </div>
        </div>

        {/* Right column: Info, Sizes and Purchase actions */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-[9.5px] font-black tracking-widest uppercase text-amber-700 bg-amber-500/10 border border-amber-500/15 px-3 py-1.5 rounded-md leading-none">
              {product.categoryBangla}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 leading-snug">
              {product.banglaName}
            </h1>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-mono">
              {product.name}
            </p>
          </div>

          {/* Pricing section with stars */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 py-4.5 border-y border-zinc-150">
            <div>
              <span className="text-[10px] text-zinc-400 font-extrabold block uppercase tracking-wider mb-0.5">ডিজাইন প্রাইস (BDT)</span>
              <span className="text-2xl sm:text-3xl font-black text-zinc-950">
                ৳{product.price}
              </span>
            </div>

            <div className="h-10 w-px bg-zinc-200 hidden sm:block" />

            <div>
              <span className="text-[10px] text-zinc-400 font-extrabold block uppercase tracking-wider mb-0.5">ভেরিফাইড স্টার রেটিং</span>
              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating) ? 'fill-current' : 'text-zinc-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-black font-mono text-zinc-850">
                  {product.rating}
                </span>
                <span className="text-[11px] text-zinc-400 font-bold">
                  (১৩৫+ বাস্তব রিভিউ)
                </span>
              </div>
            </div>
          </div>

          {/* Brand Intro Description */}
          <div className="space-y-2">
            <span className="text-xs font-black text-zinc-800 uppercase block tracking-wider">পোশাক বিবরণ ও সুতা টেক্সচার:</span>
            <p className="text-xs sm:text-sm text-zinc-650 leading-relaxed font-medium">
              {product.description}
            </p>
          </div>

          {/* Apparel Sizes selection grid (Essential for a T-shirt website) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-zinc-800 uppercase block tracking-wider">আপনার সাইজ পছন্দ করুন (Size Chart):</span>
              <span className="text-[10px] text-amber-600 font-black hover:underline cursor-pointer">সাইজ গাইড</span>
            </div>
            <div className="grid grid-cols-5 gap-2 max-w-sm">
              {['S', 'M', 'L', 'XL', 'XXL'].map((size) => {
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 rounded-xl border text-xs font-black tracking-wider transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-950 border-zinc-950 text-white shadow-md'
                        : 'bg-white border-zinc-200 text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Specs features checklist */}
          <div className="space-y-3">
            <span className="text-xs font-black text-zinc-800 uppercase block tracking-wider">বুনন কোয়ালিটি বৈশিষ্ট্য:</span>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {product.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-zinc-600 font-semibold">
                  <span className="inline-flex rounded-full bg-emerald-50 text-emerald-600 p-0.5 mt-0.5">
                    <Check className="w-3 h-3 text-emerald-700 stroke-[3]" />
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Order inputs panel (Quantity counter + add to bag) */}
          <div className="bg-zinc-50 border border-zinc-150 p-5 rounded-2xl md:mt-8 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-zinc-700 uppercase tracking-wider">পোশাক পরিমাণ:</span>
              
              {/* Counter controller */}
              <div className="flex items-center border border-zinc-250 rounded-xl bg-white shadow-xs p-1">
                <button
                  type="button"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="w-8 h-8 rounded-lg text-zinc-500 hover:bg-zinc-100 active:bg-zinc-200 disabled:opacity-40 transition-colors flex items-center justify-center font-bold text-base"
                >
                  -
                </button>
                <span className="w-10 text-center font-black font-sans text-zinc-900 text-xs">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stock}
                  className="w-8 h-8 rounded-lg text-zinc-500 hover:bg-zinc-100 active:bg-zinc-200 disabled:opacity-40 transition-colors flex items-center justify-center font-bold text-base"
                >
                  +
                </button>
              </div>
            </div>

            {/* Subtotal calculation row */}
            <div className="flex items-center justify-between border-t border-zinc-200/60 pt-3">
              <span className="text-[10px] text-zinc-400 font-extrabold uppercase uppercase">সাবটোটাল মূল্য:</span>
              <span className="text-lg font-black font-sans text-zinc-950">
                ৳{product.price * quantity}
              </span>
            </div>

            {/* Shopping bag action button */}
            <button
              onClick={handleAddToCart}
              className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                isAdded
                  ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                  : 'bg-zinc-950 text-white hover:bg-amber-500 hover:text-zinc-950 shadow-zinc-950/20'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  সফলভাবে কার্টে যোগ হয়েছে!
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  কার্টে যোগ করুন (Add to Cart)
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
