/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Bell, Sparkles, Tag, Newspaper, ArrowRight, Share2, Mail, CheckCircle } from 'lucide-react';
import { BrandUpdate } from '../types';

interface UpdatesPageProps {
  updates: BrandUpdate[];
}

export default function UpdatesPage({ updates }: UpdatesPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeUpdate, setActiveUpdate] = useState<BrandUpdate | null>(null);
  
  // Newsletter subscription
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const filteredUpdates = selectedCategory === 'all'
    ? updates
    : updates.filter((u) => u.category === selectedCategory);

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      
      {/* Page Title */}
      <div className="border-l-4 border-amber-500 pl-4 py-1">
        <h1 className="text-3xl font-black text-zinc-950 tracking-tight">বুনন ব্র্যান্ড আপডেট ও নোটিশ পেজ (Apparel Feed)</h1>
        <p className="text-sm text-zinc-500 mt-1 uppercase tracking-widest font-bold">নতুন কালেকশন লঞ্চ, ধামাকা অফার, ডিসকাউন্ট কুপন ও কোয়ালিটি আপগ্রেডের রিয়েল-টাইম তথ্য</p>
      </div>

      {/* Category selector pills */}
      <div className="flex flex-wrap items-center gap-2.5 pb-2 border-b border-zinc-150">
        {[
          { id: 'all', label: 'সব আপডেট', count: updates.length },
          { id: 'new-arrival', label: 'নতুন কালেকশনস', count: updates.filter(u=>u.category==='new-arrival').length },
          { id: 'discount', label: 'ধামাকা অফার', count: updates.filter(u=>u.category==='discount').length },
          { id: 'notice', label: 'ঘোষণা ও আপগ্রেড', count: updates.filter(u=>u.category==='notice').length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-black tracking-wide border transition-all flex items-center gap-2 cursor-pointer ${
              selectedCategory === tab.id
                ? 'bg-zinc-900 border-zinc-900 text-white shadow-md'
                : 'bg-white border-zinc-150 text-zinc-600 hover:border-zinc-300'
            }`}
          >
            {tab.label}
            <span className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded-md text-[9px] font-bold ${
              selectedCategory === tab.id ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-100 text-zinc-500'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Grid stack representation of blog announcements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredUpdates.map((item) => (
          <div 
            key={item.id}
            className="flex flex-col bg-white border border-zinc-150 rounded-3xl overflow-hidden hover:border-zinc-300 transition-all shadow-sm group"
          >
            {/* Visual banner */}
            {item.imageUrl && (
              <div className="relative h-56 w-full overflow-hidden bg-zinc-900">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
                
                {/* Category Badge absolute */}
                <span className="absolute top-4 left-4 bg-zinc-950/90 text-white uppercase text-[9px] font-black tracking-widest px-3 py-1.5 rounded-full border border-zinc-805 backdrop-blur-xs">
                  {item.categoryBangla}
                </span>

                {/* Promotional special code bubble if discount */}
                {item.badge && (
                  <span className="absolute bottom-4 right-4 bg-amber-500 text-zinc-950 text-[10px] font-black tracking-wider px-3 py-1.5 rounded-full shadow-lg border border-amber-400">
                    {item.badge}
                  </span>
                )}
              </div>
            )}

            {/* Body */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <span className="text-[10px] text-zinc-400 font-extrabold block uppercase tracking-widest">{item.date}</span>
                <h3 className="text-lg font-black text-zinc-900 leading-snug group-hover:text-amber-500 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-600 font-medium leading-relaxed">
                  {item.excerpt}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-zinc-100">
                <button
                  onClick={() => setActiveUpdate(item)}
                  className="inline-flex items-center gap-1 text-xs font-black text-rose-500 hover:text-rose-600 cursor-pointer"
                >
                  বিস্তারিত পড়ুন
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
                <button 
                  onClick={() => alert(`কাস্টমার সাপোর্ট বা শেয়ার লিংক কপিড! অফার কোডটি চেকআউটে ব্যবহার করুন।`)}
                  className="p-1.5 text-zinc-400 hover:text-zinc-600 rounded-lg hover:bg-zinc-50 transition-colors"
                  title="শেয়ার করুন"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Expanding read-more detailed Modal overlay */}
      {activeUpdate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-zinc-200 shadow-2xl relative max-h-[85vh] overflow-y-auto space-y-5">
            <button 
              onClick={() => setActiveUpdate(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-colors flex items-center justify-center font-extrabold text-sm"
              title="বন্ধ করুন"
            >
              ✕
            </button>

            <span className="bg-amber-100 text-amber-800 text-[9px] font-black tracking-widest px-3 py-1 rounded-full border border-amber-200 uppercase">
              {activeUpdate.categoryBangla}
            </span>

            <div className="space-y-1.5">
              <span className="text-[10px] text-zinc-400 font-bold tracking-widest block">{activeUpdate.date}</span>
              <h2 className="text-xl sm:text-2xl font-black text-zinc-900 leading-tight pr-8">{activeUpdate.title}</h2>
            </div>

            {activeUpdate.imageUrl && (
              <div className="h-60 rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-100">
                <img 
                  src={activeUpdate.imageUrl} 
                  alt={activeUpdate.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            <div className="text-zinc-700 text-xs sm:text-sm leading-relaxed space-y-4 whitespace-pre-line font-medium bg-zinc-50/50 p-5 rounded-2xl border border-zinc-100">
              {activeUpdate.content}
            </div>

            {activeUpdate.badge && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] text-amber-700 font-black block leading-none">অফার কোড</span>
                  <span className="text-base font-black text-zinc-900 tracking-wider">BUNONEED20</span>
                </div>
                <button 
                  onClick={() => alert('কুপন কোড BUNONEED20 কপিড! কার্ট চেকআউট করার সময়ে ব্যবহার করুন।')}
                  className="px-4 py-2 bg-zinc-950 text-white text-[10.5px] font-black uppercase tracking-wider rounded-xl hover:bg-zinc-850"
                >
                  কোড কপি করুন
                </button>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveUpdate(null)}
                className="px-6 py-2.5 bg-zinc-150 hover:bg-zinc-200 text-zinc-800 rounded-xl font-bold text-xs transition-colors"
              >
                বন্ধ করুন
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Subscription box at bottom (simple er moddhe gorgeous visual design) */}
      <div className="relative overflow-hidden rounded-3xl bg-zinc-950 text-white border border-zinc-850 p-6 sm:p-10 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
          <div className="inline-flex p-3 bg-zinc-900 border border-zinc-805 rounded-2xl text-amber-400">
            <Mail className="w-6 h-6 animate-pulse" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-black text-white">নতুন ডিজাইন ড্রপ নোটিফিকেশন সাবস্ক্রাইব করুন</h2>
            <p className="text-xs text-zinc-400 max-w-lg mx-auto">বুনন-এর নতুন প্রোডাক্ট লঞ্চ, প্রমো-কোড বা অফার আসার সাথে সাথে সবার আগে বিনামূল্যে নোটিফিকেশন পান ইমেইলে।</p>
          </div>

          {!subscribed ? (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="আপনার সঠিক ইমেইলটি লিখুন..."
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 placeholder-zinc-500 text-xs focus:ring-1 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all hover:shadow-lg active:scale-95 cursor-pointer"
              >
                সাবস্ক্রাইব
              </button>
            </form>
          ) : (
            <div className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-950/60 border border-emerald-900 text-emerald-300 font-extrabold text-xs rounded-2xl animate-fadeIn">
              <CheckCircle className="w-4 h-4" />
              অভিনন্দন! আপনার সাবস্ক্রিপশন সফলভাবে সম্পন্ন হয়েছে।
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
