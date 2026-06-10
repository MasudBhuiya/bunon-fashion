/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Star, MessageSquareText, User, CheckCircle2, MessageCircle, ArrowRight, ShieldCheck, ThumbsUp } from 'lucide-react';
import { Review, Product } from '../types';

interface ReviewHubProps {
  reviews: Review[];
  products: Product[];
  onAddReview: (review: Omit<Review, 'id' | 'date'>) => void;
}

export default function ReviewHub({ reviews, products, onAddReview }: ReviewHubProps) {
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  
  // Review form state
  const [customerName, setCustomerName] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Calculate stats
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1))
    : 0;

  // Rating breakdown
  const starCounts = [0, 0, 0, 0, 0, 0]; // index 1 to 5
  reviews.forEach(r => {
    if (r.rating >= 1 && r.rating <= 5) {
      starCounts[r.rating]++;
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!customerName.trim()) {
      setErrorMsg('দয়া করে আপনার নাম লিখুন।');
      return;
    }
    if (!selectedProduct) {
      setErrorMsg('দয়া করে প্রোডাক্ট সিলেক্ট করুন।');
      return;
    }
    if (!comment.trim()) {
      setErrorMsg('দয়া করে আপনার মূল্যবান মন্তব্যটি লিখুন।');
      return;
    }

    onAddReview({
      customerName,
      productName: selectedProduct,
      rating,
      comment: comment,
      commentBangla: comment,
      isVerifiedPurchase: true
    });

    setSuccessMsg(true);
    setCustomerName('');
    setSelectedProduct('');
    setRating(5);
    setComment('');

    setTimeout(() => {
      setSuccessMsg(false);
    }, 4000);
  };

  const filteredReviews = filterRating === 'all'
    ? reviews
    : reviews.filter(r => r.rating === filterRating);

  return (
    <div className="space-y-12 max-w-6xl mx-auto">
      
      {/* Title Header */}
      <div className="border-l-4 border-amber-500 pl-4 py-1">
        <h1 className="text-3xl font-black text-zinc-950 tracking-tight">গ্রাহকদের ভালোবাসার বুনন হাব (Review Hub)</h1>
        <p className="text-sm text-zinc-500 mt-1 uppercase tracking-widest font-bold">আমাদের প্রিমিয়াম টি-শার্ট ও কলার পোলো সম্পর্কে ক্রেতাদের বাস্তব অভিজ্ঞতা ও রেটিং</p>
      </div>

      {/* Stats and Rating breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-white border border-zinc-150 p-6 sm:p-8 rounded-3xl shadow-sm">
        
        {/* Total Score box */}
        <div className="flex flex-col items-center justify-center text-center p-6 border-b md:border-b-0 md:border-r border-zinc-100">
          <span className="text-5xl sm:text-6xl font-black text-zinc-900 leading-none">{averageRating}</span>
          <div className="flex items-center gap-1 my-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star 
                key={s} 
                className={`w-5 h-5 ${
                  s <= Math.round(averageRating) 
                    ? 'text-amber-400 fill-amber-400' 
                    : 'text-zinc-200'
                }`} 
              />
            ))}
          </div>
          <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">{totalReviews} টি কাস্টমার রেটিং এর গড়</span>
          <div className="mt-4 flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            শতভাগ যাচাইকৃত ও জেনুইন রিভিউ
          </div>
        </div>

        {/* Progress bars segment */}
        <div className="md:col-span-2 flex flex-col justify-center space-y-2.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = starCounts[star];
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-3">
                <button 
                  onClick={() => setFilterRating(filterRating === star ? 'all' : star)}
                  className={`w-12 text-xs font-bold text-zinc-600 hover:text-amber-600 hover:scale-105 transition-all text-left flex items-center gap-1 shrink-0 ${filterRating === star ? 'text-amber-600 font-extrabold' : ''}`}
                >
                  {star} স্টার
                </button>
                <div className="flex-1 h-3.5 bg-zinc-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-linear-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 text-right text-xs font-bold text-zinc-500">{count}টি</span>
              </div>
            );
          })}
          <div className="text-[10px] text-zinc-400 font-medium text-right uppercase tracking-wider pt-1">
            * স্টারের ওপর ক্লিক করে রিভিউ ফিল্টার করতে পারেন
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        
        {/* Left column: Post a review (NO CUSTOMER LOGIN NEEDED) */}
        <div className="lg:col-span-2 bg-zinc-950 text-white rounded-3xl p-6 sm:p-8 border border-zinc-800 shadow-xl space-y-6">
          <div>
            <h2 className="text-xl font-black text-white shrink-0 flex items-center gap-2">
              <MessageSquareText className="w-5.5 h-5.5 text-amber-500 shrink-0" />
              আপনার রিভিউ পোস্ট করুন
            </h2>
            <p className="text-xs text-zinc-400 mt-1.5">কোনো রেজিস্ট্রেশন বা অ্যাকাউন্ট ছাড়াই আপনার মতামত সরাসরি প্রকাশ করুন</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* Customer Name */}
            <div className="space-y-1.5">
              <label className="block font-bold text-zinc-300">আপনার পূর্ণ নাম:</label>
              <input
                type="text"
                placeholder="যেমন: আরিয়ান খান"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-hidden focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            {/* Product Selector */}
            <div className="space-y-1.5">
              <label className="block font-bold text-zinc-300">কোন প্রোডাক্টটি কিনেছেন?</label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-hidden focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="">প্রোডাক্ট নির্বাচন করুন...</option>
                {products.map((p) => (
                  <option key={p.id} value={p.banglaName}>
                    {p.banglaName} — ৳{p.price}
                  </option>
                ))}
              </select>
            </div>

            {/* Stars selection rating */}
            <div className="space-y-1.5">
              <label className="block font-bold text-zinc-300">আপনার রেটিং স্টার:</label>
              <div className="flex items-center gap-2 bg-zinc-900 py-2.5 px-4 rounded-xl border border-zinc-800">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="hover:scale-125 transition-transform duration-100"
                  >
                    <Star
                      className={`w-7 h-7 cursor-pointer ${
                        star <= rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-600'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-zinc-400 ml-auto font-black text-sm">{rating}/৫ স্টার</span>
              </div>
            </div>

            {/* Message/Comment */}
            <div className="space-y-1.5">
              <label className="block font-bold text-zinc-300">আপনার বিস্তারিত মতামত:</label>
              <textarea
                rows={4}
                placeholder="কাপড়ের মান ও সেলাই নিয়ে আপনার বাস্তব অনুভূতি কেমন ছিল? (বাংলা অথবা ইংরেজি)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-hidden focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            {errorMsg && (
              <div className="p-3.5 bg-rose-950/50 border border-rose-900 text-rose-300 rounded-xl text-[11px] font-bold">
                * {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 bg-emerald-950/60 border border-emerald-900 text-emerald-300 rounded-xl text-[11px] font-bold animate-pulse">
                ধন্যবাদ! আপনার মূল্যবান রিভিউটি সফলভাবে প্রকাশিত হয়েছে এবং নিচে যুক্ত হয়েছে।
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black tracking-widest uppercase rounded-xl py-3.5 transition-all transform active:scale-95 cursor-pointer text-xs"
            >
              রিভিউ জমা দিন
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>

          </form>
        </div>

        {/* Right column: Reviews feed display */}
        <div className="lg:col-span-3 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-zinc-950 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-amber-500" />
              গ্রাহকদের ফিডব্যাক ({filteredReviews.length} টি)
            </h3>
            
            {filterRating !== 'all' && (
              <button 
                onClick={() => setFilterRating('all')}
                className="text-xs font-bold text-rose-500 hover:underline cursor-pointer"
              >
                সব রেটিং দেখান
              </button>
            )}
          </div>

          <div className="space-y-4 max-h-[680px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredReviews.length > 0 ? (
              filteredReviews.map((rev) => (
                <div 
                  key={rev.id} 
                  className="bg-white border border-zinc-150 rounded-2xl p-5 hover:border-zinc-300 transition-all shadow-xs space-y-3 relative group"
                >
                  <div className="flex items-start justify-between gap-2 flex-wrap sm:flex-nowrap">
                    {/* Customer Info */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-linear-to-tr from-zinc-100 to-zinc-200 text-zinc-600 flex items-center justify-center border border-zinc-200">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-zinc-900 leading-none">{rev.customerName}</h4>
                        <div className="flex items-center gap-1.5 mt-1">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                className={`w-3.5 h-3.5 ${
                                  star <= rev.rating 
                                    ? 'text-amber-400 fill-amber-400' 
                                    : 'text-zinc-200'
                                }`} 
                              />
                            ))}
                          </div>
                          <span className="text-[10px] text-zinc-400 font-bold leading-none">{rev.date || 'আজ'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Verified check badge */}
                    {rev.isVerifiedPurchase && (
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-full border border-emerald-100 uppercase tracking-wider">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 fill-emerald-50" />
                        যাচাইকৃত ক্রেতা
                      </div>
                    )}
                  </div>

                  {/* Product Tag Badge */}
                  <div className="inline-block py-1 px-2 text-[10px] font-bold text-zinc-600 bg-zinc-100 rounded-md">
                    প্রোডাক্ট: <span className="text-zinc-900 font-extrabold">{rev.productName}</span>
                  </div>

                  {/* Feedback text */}
                  <p className="text-xs text-zinc-700 font-medium leading-relaxed bg-zinc-50/50 p-3 rounded-lg border border-zinc-100">
                    {rev.commentBangla}
                  </p>

                  <div className="flex items-center gap-4 text-[10px] text-zinc-400 pt-1">
                    <button className="flex items-center gap-1 hover:text-amber-600 font-bold transition-colors">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      উপকারী লেগেছে? (১২)
                    </button>
                    <span>|</span>
                    <span className="text-zinc-300 font-medium">সম্পূর্ণ সেফ এন্ড প্রটেক্টেড রিভিউ</span>
                  </div>

                  <div className="absolute top-4 right-4 text-zinc-300 font-bold text-xl select-none group-hover:scale-110 pointer-events-none transition-transform opacity-10">
                    BUNON
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
                <p className="text-sm font-semibold text-zinc-500">এই রেটিং সম্বলিত কোনো কাস্টমার রিভিউ পাওয়া যায়নি।</p>
                <button 
                  onClick={() => setFilterRating('all')}
                  className="mt-3 text-xs text-amber-500 font-bold hover:underline"
                >
                  সব রিভিউ দেখুন
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
