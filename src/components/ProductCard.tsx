/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Star, ShoppingCart, Check, Heart, Scale } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: string;
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (productId: string) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
  onViewDetails
}: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);
  const [isWhished, setIsWhished] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering open detail card
    onAddToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWhished(!isWhished);
  };

  return (
    <div 
      onClick={() => onViewDetails(product.id)}
      className="group flex flex-col bg-white rounded-2xl border border-zinc-150 hover:border-amber-500/50 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer h-full relative"
      id={`product-card-${product.id}`}
    >
      {/* Wishlist Heart Icon */}
      <button
        onClick={handleWishlist}
        className={`absolute top-3.5 right-3.5 z-10 p-2 rounded-full border shadow-xs transition-all bg-white hover:scale-110 active:scale-95 ${
          isWhished 
            ? 'text-rose-500 border-rose-100' 
            : 'text-zinc-300 border-zinc-100 hover:text-rose-500 hover:border-zinc-200'
        }`}
      >
        <Heart className="w-4 h-4 fill-current" />
      </button>

      {/* Stock warning label */}
      {product.stock <= 10 && (
        <span className="absolute top-3.5 left-3.5 z-10 bg-rose-600 text-white text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wide border border-rose-500 shadow-sm animate-pulse">
          মাত্র {product.stock} টি বাঁকি!
        </span>
      )}

      {/* Image zoom wrapper */}
      <div className="relative aspect-4/3 overflow-hidden bg-zinc-50 shrink-0 border-b border-zinc-100">
        <img
          src={product.imageUrl}
          alt={product.banglaName}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-zinc-950/2 opacity-0 group-hover:opacity-10 transition-opacity" />
      </div>

      {/* Card Details body */}
      <div className="p-4.5 flex flex-col flex-1 space-y-2.5">
        
        {/* Category Badge pill */}
        <span className="text-[9.5px] font-black tracking-widest uppercase text-amber-700 bg-amber-500/10 border border-amber-500/15 px-3 py-1 rounded-md w-fit leading-none">
          {product.categoryBangla}
        </span>

        {/* Title */}
        <div className="space-y-0.5">
          <h3 className="font-extrabold text-zinc-900 text-[14.5px] group-hover:text-amber-600 transition-colors line-clamp-1 leading-snug">
            {product.banglaName}
          </h3>
          <p className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-wider block truncate">
            {product.name}
          </p>
        </div>

        {/* Ratings */}
        <div className="flex items-center gap-1.5 pt-0.5">
          <div className="flex gap-0.5 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.rating) ? 'fill-current' : 'text-zinc-200'
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] font-black font-mono text-zinc-800 leading-none">
            {product.rating}
          </span>
          <span className="text-[9.5px] text-zinc-400 font-bold leading-none">
            (ভেরিফাইড রিভিউ)
          </span>
        </div>

        {/* Desc */}
        <p className="text-[11.5px] text-zinc-500 line-clamp-2 leading-relaxed flex-1">
          {product.description}
        </p>

        {/* Price & Buy trigger */}
        <div className="flex items-center justify-between gap-2.5 pt-3 border-t border-zinc-100 mt-auto shrink-0">
          <div className="flex flex-col">
            <span className="text-[9px] text-zinc-400 font-black uppercase leading-none">প্রিমিয়াম প্রাইস</span>
            <span className="text-base font-black text-zinc-950 tracking-tight mt-1 leading-none">
              ৳{product.price}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 ${
              isAdded
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20 scale-95'
                : 'bg-zinc-950 text-white hover:bg-amber-500 hover:text-zinc-950 shadow-md shadow-zinc-950/10'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                যোগ হয়েছে
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                কার্টে রাখুন
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
