/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ArrowRight, Shirt, Sparkles, LayoutGrid, Award, ShoppingBag, Trophy, Flame } from 'lucide-react';
import { CATEGORIES } from '../data';
import { Category } from '../types';
// @ts-ignore - Vite handles static png imports natively, bypass TS module check
import scienceBlueprintBg from '../assets/images/science_blueprint_bg_1780988357982.png';

interface HeroProps {
  onCategorySelect: (categoryId: string) => void;
  selectedCategory: string;
  onExploreClick: () => void;
}

// Map the icons from CATEGORIES
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutGrid: LayoutGrid,
  Shirt: Shirt,
  Sparkles: Sparkles,
  Smartphone: Shirt, // Map phone/smartphone to Shirt for elegant polo icon consistency
  Leaf: Trophy,      // Map leaf to Trophy for sports jersey category representation
};

const SLIDES = [
  {
    id: 1,
    title: 'টি-সায়েন্স (T-Science) রিফাইন্ড লাক্সারি',
    subtitle: 'এক্সপেরিমেন্টাল হাই-ডেনসিটি টেক্সটাইল আর্ট',
    desc: 'জ্যামিতিক সুতোর বুনন ও বৈজ্ঞানিক নির্ভুলতায় তৈরি আমাদের বিশেষ এডিশন ওয়াশড হেভি কটন টি-শার্ট। যা দেবে আভিজাত্য ও শতভাগ বিশুদ্ধ কমফোর্টের এক অনন্য অনুভূতি।',
    cta: 'টি-সায়েন্স লিমিটেড এডিশন',
    imgUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200',
    tag: 'রিফাইন্ড নান্দনিকতা',
    bgColor: 'from-zinc-950/95 to-zinc-900/95',
    outlineColor: 'border-amber-500/25 text-amber-400 bg-amber-500/10'
  },
  {
    id: 2,
    title: 'সবচেয়ে স্টাইলিশ স্ট্রিট ফ্যাশন জোয়ার',
    subtitle: '২৬০ GSM হেভিওয়েট ওভারসাইজড কালেকশন',
    desc: 'তরুণদের পছন্দের প্রিমিয়াম ড্রপ-শোল্ডার সুপিমা কটন টি-শার্ট। আরামদায়ক ফিটিং ও ডাবল-সিউয়িং শোল্ডার স্টিচযুক্ত যা রোদেও উজ্জ্বল থাকবে!',
    cta: 'কালেকশন এক্সপ্লোর করুন',
    imgUrl: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=1200',
    tag: 'ট্রেন্ডি ড্রপ শোল্ডার',
    bgColor: 'from-zinc-950/95 to-zinc-900/95',
    outlineColor: 'border-amber-500/25 text-amber-400 bg-amber-500/10'
  },
  {
    id: 3,
    title: 'ক্লাসিক লুক অ্যান্ড রয়াল ফিটিংস',
    subtitle: '১০০% ডাবল পিকে লাকোস্ট কলার পোলো',
    desc: 'কারপোরেট মিটিং অথবা আউটিং সবখানেই রয়াল কটন পোলো শার্টটি আপনাকে দেবে প্রিমিয়াম রাজকীয় ভাইবস। কালার ও কাপড় শত ধুয়াতেও ফেইড হবে না।',
    cta: 'ক্লাসিক পোলো কালেকশন',
    imgUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1200',
    tag: 'লাক্সারি কালেকশনস',
    bgColor: 'from-zinc-950/95 to-zinc-900/95',
    outlineColor: 'border-amber-500/25 text-amber-400 bg-amber-500/10'
  },
  {
    id: 4,
    title: 'হাই-পারফরম্যান্স স্পোর্টিং ইভেন্টস ফিট',
    subtitle: '১২০ GSM elite এয়ার-ফ্লো অ্যাথলেটিক জার্সি',
    desc: 'পেশাদার খেলোয়াড়দের জন্য রাজকীয় আরামের পিউর সাবলিমেশন ফেইডলেস জার্সি ড্রপস। এর উইকিং ফাইবার নিশ্চিত করবে ঘামমুক্ত স্পোর্টিং ভাইবস।',
    cta: 'জার্সি কালেকশন দেখুন',
    imgUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200',
    tag: 'ক্যাজুয়াল স্পোর্টস জার্সি',
    bgColor: 'from-zinc-950/95 to-zinc-900/95',
    outlineColor: 'border-amber-500/25 text-amber-400 bg-amber-500/10'
  }
];

export default function Hero({ onCategorySelect, selectedCategory, onExploreClick }: HeroProps) {
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto-slide every 6 seconds to bring the page to life
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[activeSlide];

  return (
    <div className="font-sans space-y-12">
      {/* Immersive Modern Slider Carousel Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl min-h-[480px] md:min-h-[520px] flex items-center">
        
        {/* Solid deep dark background for slate/black chalkboard look */}
        <div className="absolute inset-0 bg-zinc-950" />

        {/* Scientific Chalkboard Blueprint Background layer (from user's reference) */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-70 mix-blend-screen pointer-events-none" 
          style={{ backgroundImage: `url(${scienceBlueprintBg})` }} 
        />
        
        {/* Dynamic Slide BG Image with high contrast, lower opacity so chalkboard pattern shines through */}
        <div 
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-15 transition-all duration-1000 transform scale-105" 
          style={{ backgroundImage: `url(${slide.imgUrl})` }} 
        />

        {/* Absolute dark gradient shield over left 60% of the banner to guarantee 100% text readability */}
        <div className="absolute inset-y-0 left-0 w-full lg:w-3/5 bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-transparent pointer-events-none z-5" />

        {/* Content Box */}
        <div className="relative max-w-6xl mx-auto px-6 sm:px-12 py-16 md:py-20 w-full z-10 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
            
            <div className="lg:col-span-3 space-y-6 text-left">
              <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest ${slide.outlineColor} shadow-md border`}>
                <Flame className="w-3.5 h-3.5 animate-bounce text-amber-400" />
                {slide.tag}
              </span>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight uppercase font-sans">
                <span className="text-white drop-shadow-md">{slide.title}</span> <br />
                <span className="text-amber-400 text-lg sm:text-xl md:text-2xl mt-3.5 inline-block font-extrabold tracking-wide uppercase bg-zinc-950/90 border border-amber-500/30 px-4 py-2 rounded-xl w-fit backdrop-blur-xs shadow-lg">
                  {slide.subtitle}
                </span>
              </h1>
              
              <p className="text-zinc-200 text-sm sm:text-base max-w-lg font-medium leading-relaxed drop-shadow-xs">
                {slide.desc}
              </p>
              
              <div className="pt-4 flex flex-wrap gap-4">
                <button
                  onClick={onExploreClick}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs uppercase tracking-widest rounded-full transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 shadow-xl hover:shadow-amber-500/20 cursor-pointer"
                >
                  {slide.cta}
                  <ArrowRight className="w-4 h-4 text-zinc-950 stroke-[3]" />
                </button>
              </div>
            </div>

            {/* Float premium SPECIMEN DISPLAY frame card - always flex to show on all screen resolutions */}
            <div className="flex lg:col-span-2 justify-center w-full mt-8 lg:mt-0">
              <div className="relative w-full max-w-[340px] bg-zinc-900 border border-zinc-800 rounded-[32px] p-4.5 shadow-2xl flex flex-col gap-4 select-none">
                
                {/* Specimen Header info bar */}
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <span className="text-[9px] font-black tracking-widest uppercase text-zinc-400 font-mono">SPECIMEN DISPLAY</span>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-0.5 bg-amber-500 rounded-full" />
                    <span className="w-1.5 h-0.5 bg-zinc-700 rounded-full" />
                  </div>
                </div>

                {/* Main Specimen Image Container */}
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-inner group">
                  <img 
                    src={slide.imgUrl} 
                    alt={slide.subtitle} 
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Info Overlay inside image card exactly like the user's design */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent p-4 flex flex-col gap-1 text-left">
                    <span className="text-[8px] font-extrabold uppercase tracking-widest text-amber-500 font-mono">TECHNICAL CORE</span>
                    <h4 className="text-sm font-black text-white leading-tight font-sans">
                      {slide.title.replace('টি-সায়েন্স (T-Science) ', '')}
                    </h4>
                    <span className="text-[9px] font-bold text-zinc-400 tracking-wider flex items-center gap-1 mt-0.5">
                      ACCESS DATA <span className="text-amber-500">❯</span>
                    </span>
                  </div>
                </div>

                {/* Operational controls container below specimen image */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setActiveSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)}
                    className="p-3.5 bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl border border-zinc-800 transition-colors cursor-pointer"
                    title="পূর্ববর্তী"
                  >
                    <span className="text-[10px] font-bold font-mono">❮</span>
                  </button>
                  <button 
                    onClick={onExploreClick}
                    className="flex-1 py-3 bg-zinc-300 hover:bg-amber-400 text-zinc-950 font-black text-[11px] uppercase tracking-widest rounded-xl transition-all shadow-md text-center"
                  >
                    Analyze Specimen
                  </button>
                  <button 
                    onClick={() => setActiveSlide((prev) => (prev + 1) % SLIDES.length)}
                    className="p-3.5 bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl border border-zinc-800 transition-colors cursor-pointer"
                    title="পরবর্তী"
                  >
                    <span className="text-[10px] font-bold font-mono">❯</span>
                  </button>
                </div>

              </div>
            </div>

          </div>

          {/* Manual Carousel Indicators */}
          <div className="absolute bottom-6 left-6 sm:left-11 flex gap-3 z-20">
            {SLIDES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setActiveSlide(idx)}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-300 border border-zinc-700 ${
                  activeSlide === idx ? 'w-10 bg-amber-500 border-transparent shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-zinc-850 hover:bg-zinc-750'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Category List Section */}
      <div className="space-y-6">
        <div className="border-l-4 border-amber-500 pl-4">
          <h2 className="text-2xl font-black text-zinc-900 tracking-tight">ক্যাটাগরি অনুযায়ী খুঁজুন</h2>
          <p className="text-xs text-zinc-500 mt-1 font-semibold uppercase tracking-wider">আমাদের প্রিমিয়াম টি-শার্ট ও কলার পোলোর বৈচিত্র্যময় কালেকশনসমূহ</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = iconMap[cat.icon] || LayoutGrid;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onCategorySelect(cat.id)}
                className={`group flex flex-col items-center justify-center p-6 rounded-2xl text-center border-2 transition-all duration-300 hover:shadow-lg cursor-pointer ${
                  isSelected
                    ? 'border-amber-500 ring-4 ring-amber-500/10 bg-amber-500 text-zinc-950 font-black shadow-lg shadow-amber-500/10'
                    : 'border-zinc-100 bg-white hover:border-zinc-300 text-zinc-700 shadow-xs'
                }`}
                id={`cat-card-${cat.id}`}
              >
                <div className={`p-4 rounded-xl mb-3 shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                  isSelected 
                    ? 'bg-zinc-950 text-amber-400' 
                    : `${cat.bgColor} ${cat.textColor}`
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="font-extrabold text-sm tracking-wide block max-w-full truncate">
                  {cat.banglaName}
                </span>
                <span className={`text-[10px] mt-1 font-black block uppercase tracking-widest ${isSelected ? 'text-zinc-800' : 'text-zinc-400'}`}>
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
