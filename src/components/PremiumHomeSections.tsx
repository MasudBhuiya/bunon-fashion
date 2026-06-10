import React, { useState } from 'react';
import { 
  Ruler, 
  Sparkles, 
  Check, 
  ThumbsUp, 
  Leaf, 
  Gift, 
  Truck, 
  RotateCcw, 
  HelpCircle, 
  ShoppingBag,
  Star,
  Quote,
  TrendingUp,
  Cpu,
  Bookmark
} from 'lucide-react';
import { Product } from '../types';

interface PremiumHomeSectionsProps {
  onExploreCategory: (categoryId: string) => void;
  products: Product[];
  onAddToCart: (product: Product, qty?: number) => void;
}

export default function PremiumHomeSections({ onExploreCategory, products, onAddToCart }: PremiumHomeSectionsProps) {
  // Size Assistant States
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [heightFeet, setHeightFeet] = useState<number>(5);
  const [heightInches, setHeightInches] = useState<number>(6);
  const [weightKg, setWeightKg] = useState<number>(68);
  const [preferredFit, setPreferredFit] = useState<'regular' | 'oversized'>('regular');

  // Fabric Spec States
  const [activeFabric, setActiveFabric] = useState<'washed' | 'supima' | 'athletic'>('washed');

  // Interactive Size calculations
  const calculateRecommendedSize = () => {
    let size = 'M';
    if (weightKg < 55) {
      size = 'S';
    } else if (weightKg >= 55 && weightKg < 66) {
      size = 'M';
    } else if (weightKg >= 66 && weightKg < 78) {
      size = 'L';
    } else if (weightKg >= 78 && weightKg < 90) {
      size = 'XL';
    } else {
      size = 'XXL';
    }

    // Height Adjustments
    const totalInches = heightFeet * 12 + heightInches;
    if (totalInches > 72 && size !== 'XXL') { // over 6'0"
      const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
      const currentIdx = sizes.indexOf(size);
      size = sizes[Math.min(currentIdx + 1, sizes.length - 1)];
    } else if (totalInches < 63 && size !== 'S') { // under 5'3"
      const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
      const currentIdx = sizes.indexOf(size);
      size = sizes[Math.max(currentIdx - 1, 0)];
    }

    // Adjust for oversized fit preference
    if (preferredFit === 'oversized' && size !== 'XXL') {
      const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
      const currentIdx = sizes.indexOf(size);
      size = sizes[Math.min(currentIdx + 1, sizes.length - 1)];
    }

    return size;
  };

  const getFitDescription = (size: string) => {
    if (preferredFit === 'oversized') {
      return `আপনাকে দুর্দান্ত ক্যাজুয়াল লুক দেওয়ার জন্য রিল্যাক্সড ড্রপ-শোল্ডার মডেলে "${size}" সাইজটি মানানসই হবে। হাতা কনুই পর্যন্ত স্টাইলিশ ঢোলা থাকবে।`;
    }
    return `আপনার বডি স্ট্রাকচার অনুযায়ী স্ট্যান্ডার্ড রিম্যাক্সড ফিটের পোলো অথবা ক্লাসিক টি-শার্টে "${size}" সাইজটি একদম পারফেক্ট ও কমফোর্টেবল থাকবে।`;
  };

  const recommendedSize = calculateRecommendedSize();

  // Find products matching recommended category
  const suggestedCategory = preferredFit === 'oversized' ? 'oversized' : 'classic';
  const suggestedClassTitle = preferredFit === 'oversized' ? 'ওভারসাইজড কুল টিজ' : 'ক্লাসিক টি-শার্টস';
  const matchingProducts = products.filter(p => p.category === suggestedCategory).slice(0, 2);

  return (
    <div className="space-y-16 pt-6">
      
      {/* 1. INTERACTIVE SIZE GENERATOR & TECHNICAL FABRIC SPECIFICATIONS BLOCK */}
      <section className="bg-white border border-zinc-200 rounded-[32px] overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12" id="fabric-size-assistant-hub">
        
        {/* Left Side: Fabric Assistant Forms */}
        <div className="lg:col-span-7 p-6 sm:p-10 space-y-8">
          <div className="space-y-2">
            <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-700 px-3 py-1.5 rounded-full font-black uppercase tracking-widest inline-flex items-center gap-1.5">
              <Ruler className="w-3.5 h-3.5 text-amber-600" />
              রিয়েল-টাইম এআই সাইজ রেকর্ডার
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">আপনার সঠিক সাইজ এবং ফিটিং বের করুন</h2>
            <p className="text-xs text-zinc-500 font-bold leading-normal">উচ্চতা ও ওজন প্রদান করে এক ক্লিকে নিজের শরীরের জন্য নিখুঁত মাপ নিশ্চিত করুন। কোনো ভুল সাইজ আসবে না।</p>
          </div>

          <div className="space-y-5">
            {/* Height & Weight Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Height Dropdowns */}
              <div className="bg-zinc-50 border border-zinc-200/60 rounded-2xl p-4.5 space-y-3">
                <span className="block font-black text-xs text-zinc-700">📏 উচ্চতা নির্বাচন করুন:</span>
                <div className="flex gap-2 items-center">
                  <div className="flex-1 space-y-1">
                    <label className="text-[9px] text-zinc-400 font-bold uppercase block">Feet (ফুট)</label>
                    <select 
                      value={heightFeet} 
                      onChange={e => setHeightFeet(Number(e.target.value))}
                      className="w-full bg-white border border-zinc-200 rounded-xl p-2.5 font-black text-zinc-800 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-hidden"
                    >
                      {[4, 5, 6, 7].map(f => (
                        <option key={f} value={f}>{f} ফুট</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1 space-y-1">
                    <label className="text-[9px] text-zinc-400 font-bold uppercase block">Inches (ইঞ্চি)</label>
                    <select 
                      value={heightInches} 
                      onChange={e => setHeightInches(Number(e.target.value))}
                      className="w-full bg-white border border-zinc-200 rounded-xl p-2.5 font-black text-zinc-800 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-hidden"
                    >
                      {Array.from({ length: 12 }).map((_, i) => (
                        <option key={i} value={i}>{i} ইঞ্চি</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Weight Range Slider */}
              <div className="bg-zinc-50 border border-zinc-200/60 rounded-2xl p-4.5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-black text-xs text-zinc-700">⚖️ বর্তমান ওজন (Weight):</span>
                  <span className="bg-zinc-950 font-mono text-zinc-100 px-2 py-0.5 rounded-md font-bold text-xs">{weightKg} Kg</span>
                </div>
                <div className="space-y-1">
                  <input 
                    type="range" 
                    min="40" 
                    max="120" 
                    value={weightKg} 
                    onChange={e => setWeightKg(Number(e.target.value))}
                    className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <div className="flex justify-between text-[9px] text-zinc-400 font-bold">
                    <span>৪০ কেজি</span>
                    <span>৮০ কেজি</span>
                    <span>১২০ কেজি</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Fit Preference Choices */}
            <div className="space-y-2">
              <span className="block font-black text-xs text-zinc-700">👕 পোশাকের কাটিং পছন্দ:</span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPreferredFit('regular')}
                  className={`p-3.5 border rounded-2xl flex flex-col gap-1.5 text-left transition-all cursor-pointer ${
                    preferredFit === 'regular'
                      ? 'bg-zinc-950 border-zinc-950 text-white shadow-md'
                      : 'bg-zinc-50 border-zinc-200 text-zinc-650 hover:bg-zinc-100'
                  }`}
                >
                  <span className="font-black text-xs">Standard Fit (মার্জিত ফিটিংস)</span>
                  <span className={`text-[10px] ${preferredFit === 'regular' ? 'text-zinc-300' : 'text-zinc-550'} font-bold`}>বডি লাইনের সাথে মার্জিত ও প্রফেশনাল রেগুলার কাট</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreferredFit('oversized')}
                  className={`p-3.5 border rounded-2xl flex flex-col gap-1.5 text-left transition-all cursor-pointer ${
                    preferredFit === 'oversized'
                      ? 'bg-zinc-950 border-zinc-950 text-white shadow-md'
                      : 'bg-zinc-50 border-zinc-200 text-zinc-650 hover:bg-zinc-100'
                  }`}
                >
                  <span className="font-black text-xs">Oversized Fit (একটু ঢিলেঢালা)</span>
                  <span className={`text-[10px] ${preferredFit === 'oversized' ? 'text-zinc-300' : 'text-zinc-550'} font-bold`}>ট্রেন্ডি ড্রপ শোল্ডার কুল স্ট্রিটওয়্যার ভাইবস</span>
                </button>
              </div>
            </div>

            {/* Live Size Calculations Output Card */}
            <div className="bg-amber-500/10 border border-amber-500/35 rounded-3xl p-5 flex flex-col sm:flex-row items-center gap-6 shadow-xs">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-500 rounded-2xl border border-amber-600/30 flex flex-col justify-center items-center text-zinc-950 font-black shrink-0 shadow-md">
                <span className="text-[10px] tracking-widest text-amber-950 uppercase leading-none font-bold">SIZE</span>
                <span className="text-3xl sm:text-4xl mt-1 leading-none font-sans">{recommendedSize}</span>
              </div>
              <div className="text-left space-y-2">
                <h4 className="font-black text-zinc-900 text-sm flex items-center gap-1.5">
                  ✨ বুনন রিকমেন্ডেড সাইজ: <strong className="text-amber-700 bg-amber-500/20 px-2 py-0.5 rounded font-mono">{recommendedSize}</strong>
                </h4>
                <p className="text-xs text-zinc-600 font-medium leading-relaxed">
                  {getFitDescription(recommendedSize)}
                </p>
                
                {/* Embedded quick search selector link */}
                <span className="text-[10px] text-zinc-400 font-extrabold tracking-wide uppercase inline-block">
                  রিকমেন্ডেড কালেকশন: <strong className="text-zinc-900 decoration-amber-500 underline decoration-2">{suggestedClassTitle}</strong>
                </span>
              </div>
            </div>

            {/* Showcase 2 items matching suggestedCategory */}
            <div className="space-y-3 pt-2">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">আপনার সাইজে দারুণ ম্যাচিং ডিজাইন:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matchingProducts.map(p => (
                  <div key={p.id} className="bg-zinc-50 border border-zinc-150 rounded-2xl p-3 flex items-center gap-3">
                    <img 
                      src={p.imageUrl} 
                      alt={p.banglaName} 
                      className="w-12 h-12 rounded-xl object-cover border border-zinc-200 shrink-0 bg-white"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0 text-left">
                      <h5 className="font-extrabold text-zinc-900 text-xs truncate">{p.banglaName}</h5>
                      <span className="text-[11px] font-black text-amber-600 font-mono">৳{p.price}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onAddToCart(p)}
                      className="px-3 py-1.5 bg-zinc-950 hover:bg-amber-500 hover:text-zinc-950 text-white font-black text-[10px] rounded-lg cursor-pointer transition-colors"
                    >
                      কার্টে নিন
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Fabric Specifications and Yarn details */}
        <div className="lg:col-span-5 bg-zinc-950 text-zinc-300 p-6 sm:p-10 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-zinc-800">
          
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[9px] font-black tracking-widest text-amber-400 uppercase font-mono">FABRIC PHYSICS LABORATORY</span>
              <h3 className="text-xl font-extrabold text-white">বুননের প্রিমিয়াম সুতোর কোয়ালিটি বিশ্লেষণ</h3>
              <p className="text-[11px] text-zinc-400 font-medium">আমরা সুতোর শক্তি, হেয়ারিনেস এবং থিকনেস নিখুঁতভাবে চেক করি যাতে কোনো রুক্ষতা না থাকে।</p>
            </div>

            {/* Interactive fabric buttons selection tabs */}
            <div className="flex flex-wrap gap-1.5 border-b border-zinc-800 pb-3">
              {[
                { id: 'washed', label: '২৪০ GSM কম্বড' },
                { id: 'supima', label: '২৬০ GSM কটন' },
                { id: 'athletic', label: '১২০ GSM ড্রাই-ফিট' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFabric(tab.id as any)}
                  className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-colors cursor-pointer border ${
                    activeFabric === tab.id
                      ? 'bg-amber-500 border-amber-500 text-zinc-950'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Specification analysis box content based on state */}
            {activeFabric === 'washed' && (
              <div className="space-y-4 text-xs animate-fade-in text-left">
                <p className="leading-relaxed font-sans text-zinc-300 text-[11px]">
                  আমাদের <strong className="text-white">২৪০ GSM কম্বড কটন</strong> অত্যন্ত স্লিক ও প্রসেসড ফিনিশিং সমৃদ্ধ। সাধারণ বাজারের কাপড়ের অসমান সুতা কেটে ফেলার কারণে এর সারফেস অতিরিক্ত মসৃণ এবং চোখে ছানি কাটে না।
                </p>

                <div className="space-y-2.5 pt-1">
                  <div>
                    <div className="flex justify-between text-[10px] text-zinc-450 font-black mb-1">
                      <span>🧵 কম্বড কটন শতভাগ বিশুদ্ধতা:</span>
                      <span className="text-amber-400">১০০%</span>
                    </div>
                    <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-800">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: '100%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] text-zinc-450 font-black mb-1">
                      <span>🌬️ ব্রিদেবল রেটিং (বায়ু প্রবাহ):</span>
                      <span className="text-amber-400">৯৫% (উত্তম)</span>
                    </div>
                    <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-800">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: '95%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] text-zinc-450 font-black mb-1">
                      <span>🧼 কালার ফাস্টনেস (ধোয়া প্রতিরোধী):</span>
                      <span className="text-emerald-400">৫০+ ওয়াশ গ্যারান্টি</span>
                    </div>
                    <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-800">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '90%' }} />
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-900 p-3.5 rounded-2xl border border-zinc-800 text-[11px] font-medium leading-relaxed text-zinc-400">
                  ⚡ <strong>উপযোগী ব্যবহার:</strong> রোদযুক্ত অত্যন্ত গরম আবহাওয়াতে চমৎকার ঘাম শোষণ ও স্বস্তির জন্য সেরা।
                </div>
              </div>
            )}

            {activeFabric === 'supima' && (
              <div className="space-y-4 text-xs animate-fade-in text-left">
                <p className="leading-relaxed font-sans text-zinc-300 text-[11px]">
                  আমাদের <strong className="text-white">২৬০ GSM প্রিমিয়াম অর্গানিক কটন</strong> একটু হেভিওয়েট যার ফলে এটি গায়ে দিলে বডির চমৎকার ড্রেইপ আসে ও ছড়ানো লুক থাকে। এর থিক সুতা অতিরিক্ত রিঙ্কল বা কোঁচকানো রোধ করতে সাহায্য করে।
                </p>

                <div className="space-y-2.5 pt-1">
                  <div>
                    <div className="flex justify-between text-[10px] text-zinc-450 font-black mb-1">
                      <span>🧵 সুতা কম্প্যাক্টনেস:</span>
                      <span className="text-amber-400">৯৮%</span>
                    </div>
                    <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-800">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: '98%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] text-zinc-450 font-black mb-1">
                      <span>🛡️ স্থায়িত্ব ও থ্রেড ওভারল্যাপ:</span>
                      <span className="text-amber-400">৯৬%</span>
                    </div>
                    <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-800">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: '96%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] text-zinc-450 font-black mb-1">
                      <span>🧴 সংকোচন প্রতিরোধী (Shrinkage Proof):</span>
                      <span className="text-emerald-400">১০০% অর্গানিক প্রাক-ধোয়া</span>
                    </div>
                    <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-800">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '105%' }} />
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-900 p-3.5 rounded-2xl border border-zinc-800 text-[11px] font-medium leading-relaxed text-zinc-400">
                  ⚡ <strong>উপযোগী ব্যবহার:</strong> আউটডোর ইভেন্ট ও ক্যাজুয়াল আউটিং যেখানে ড্রপ শোল্ডার ডিজাইনের রাজকীয় লুক ও ফিটিং প্রয়োজন।
                </div>
              </div>
            )}

            {activeFabric === 'athletic' && (
              <div className="space-y-4 text-xs animate-fade-in text-left">
                <p className="leading-relaxed font-sans text-zinc-300 text-[11px]">
                  আমাদের <strong className="text-white">১২০ GSM এলিট স্পোর্টস ড্রাই-ফিট</strong> সুতি-পলিয়েস্টার ডাবল বুননের মাইক্রোফাইবার দিয়ে তৈরি। এটি চামড়ার উপর রেশম কোয়ালিটির ফিলিং দেয় এবং শরীর থেকে তাপ সরাসরি বাইরে রিলিজ করে দেয়।
                </p>

                <div className="space-y-2.5 pt-1">
                  <div>
                    <div className="flex justify-between text-[10px] text-zinc-450 font-black mb-1">
                      <span>💧 ঘাম কুইক-ড্রাই প্রযুক্তি:</span>
                      <span className="text-amber-400">১০ সেকেন্ডের ড্রাইয়িং টাইম</span>
                    </div>
                    <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-800">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: '100%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] text-zinc-450 font-black mb-1">
                      <span>🎐 এলিট এয়ার ভেন্টিলেশন:</span>
                      <span className="text-amber-400">১২০ CFM মাক্সিমাম</span>
                    </div>
                    <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-800">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: '98%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] text-zinc-450 font-black mb-1">
                      <span>🧬 সেলুলার ফাইবার স্ট্রেচিং:</span>
                      <span className="text-emerald-400">4-Way Hyper Stretch</span>
                    </div>
                    <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-800">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '94%' }} />
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-900 p-3.5 rounded-2xl border border-zinc-800 text-[11px] font-medium leading-relaxed text-zinc-400">
                  ⚡ <strong>উপযোগী ব্যবহার:</strong> ফুটবল, ক্রিকেট, জিম এবং অত্যন্ত তীব্র গতিশীল জগিং স্পোর্টস ইভেন্ট।
                </div>
              </div>
            )}

          </div>

          {/* Sizing Blueprint metadata tag */}
          <div className="pt-6 border-t border-zinc-800 flex items-center justify-between text-[10px] font-mono text-zinc-500 mt-6 lg:mt-0">
            <span>BUNON LABS © 2026</span>
            <span className="text-amber-500">ISO 9001 APPROVED</span>
          </div>

        </div>

      </section>

      {/* 2. HANDPICKED TOP VERIFIED REVIEWS CAROUSEL ROW */}
      <section className="space-y-6">
        <div className="border-l-4 border-amber-500 pl-4 py-0.5">
          <h2 className="text-2xl font-black text-zinc-900 tracking-tight">গ্রাহকদের সত্য মতামত ও কাস্টমার গ্যালারি</h2>
          <p className="text-xs text-zinc-550 mt-1 uppercase font-bold tracking-wider">আমাদের আউটলুক ও কাপড় নিয়ে সরাসরি ক্রেতাদের সন্তুষ্টির প্রমাণ</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              id: 'tr_1',
              name: 'সাদাত বিন আহসান',
              stars: 5,
              title: 'মিনিমালিস্ট কার্বন ব্ল্যাক ক্রু-নেক টি-শার্ট',
              comment: 'সেলাইয়ের মান বাইরের ব্র্যান্ডগুলোর লেভেলে করা। বিশেষ করে কলার রিবটি খুব মোটা যা ধোয়ার পরেও একদম কোঁচকায়নি। কালো রঙটাও বেশ গর্জিয়াস!',
              location: 'উত্তরা, ঢাকা',
              date: '২৮ মে, ২০২৬'
            },
            {
              id: 'tr_2',
              name: 'মাইদুল ইসলাম',
              stars: 5,
              title: 'প্রিমিয়াম আইভরি হোয়াইট কলার পোলো',
              comment: 'অফিসের ক্যাজুয়াল শুক্রবারের জন্য কিনেছিলাম। খুবই আভিজাত্যময় ভাইবস দেয়। কটন ফেব্রিক খুবই নরম এবং কলার গলার ওপর চমৎকারভাবে ফিট থাকে।',
              location: 'হালিশহর, চট্টগ্রাম',
              date: '০৩ জুন, ২০২৬'
            },
            {
              id: 'tr_3',
              name: 'রওনক জাহান রিমা',
              stars: 5,
              title: 'সেজ গ্রিন ওভারসাইজ드 ড্রপ-শোল্ডার টিজ',
              comment: 'ড্রপ শোল্ডার কাপড়ের ওভারসাইজ ডিজাইনের ড্রেপিং জোস! জিসএসএম বেশ মোটা কটন হওয়ায় প্রিমিয়াম মেথডের স্টাইল ক্রিয়েট করে যা আরামদায়কও বটে।',
              location: 'উপা শহর, সিলেট',
              date: '০২ জুন, ২০২৬'
            }
          ].map((item) => (
            <div 
              key={item.id} 
              className="bg-zinc-50 border border-zinc-200 hover:border-zinc-350 hover:bg-white transition-all p-6 rounded-2xl flex flex-col justify-between text-left space-y-4 shadow-xs relative group overflow-hidden"
            >
              {/* Premium Quote icon backdrop */}
              <div className="absolute right-4 top-4 text-zinc-150 group-hover:text-amber-500/10 transition-colors">
                <Quote className="w-12 h-12" />
              </div>

              <div className="space-y-3.5 relative z-10">
                {/* Product Name tag */}
                <div className="inline-block bg-zinc-950 text-white font-black text-[9px] px-2 py-0.5 rounded uppercase tracking-wide">
                  {item.title}
                </div>

                {/* Stars */}
                <div className="flex gap-1">
                  {Array.from({ length: item.stars }).map((_, idx) => (
                    <Star key={idx} className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                  ))}
                </div>

                <p className="text-xs text-zinc-650 leading-relaxed font-sans font-medium h-18 overflow-hidden">
                  "{item.comment}"
                </p>
              </div>

              <div className="flex items-center gap-2.5 pt-3 border-t border-zinc-150 relative z-10">
                <div className="w-8 h-8 rounded-full bg-zinc-200 border border-zinc-300 text-zinc-700 font-black text-xs flex items-center justify-center font-mono">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-extrabold text-zinc-900 text-xs">{item.name}</h4>
                  <p className="text-[9px] text-zinc-450 font-semibold">{item.location} | {item.date}</p>
                </div>
                <span className="ml-auto bg-emerald-50 border border-emerald-150 text-emerald-700 text-[8px] font-black px-1.5 py-0.5 rounded tracking-wide uppercase">
                  ✓ VERIFIED
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SUSTAINABILITY AND MODERN CRAFTSMANSHIP MANIFESTO */}
      <section className="bg-zinc-950 text-zinc-100 rounded-[32px] overflow-hidden border border-zinc-800 shadow-2xl relative">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />

        <div className="relative z-10 p-6 sm:p-12 text-center max-w-4xl mx-auto space-y-8">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest rounded-full shadow-md">
              <Leaf className="w-4 h-4 animate-pulse" />
              ১০০% অর্গানিক এবং জিরো প্লাস্টিক মিশন
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-normal uppercase">আমরা স্রেফ পোশাক বানাই না, একটি সবুজ পরিবেশ নিশ্চিত করি</h2>
            <p className="text-zinc-300 text-xs sm:text-sm max-w-xl mx-auto font-medium leading-relaxed">
              বুননের প্রতিটি ধাপে আমরা পরিবেশবান্ধব নিয়ম এবং টেকসই উন্নয়ন অনুসরণ করি। উন্নত কাপড় উৎপাদনের পাশাপাশি ভবিষ্যৎ পৃথিবীকে সুরক্ষিত রাখা আমাদের ধ্রুব প্রতিশ্রুতি।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 text-left">
            <div className="bg-zinc-900 border border-zinc-800/80 p-5 rounded-2xl flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Leaf className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm text-white">১০০% অর্গানিক ডাইং</h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">কোনো ক্ষতিকর রাসায়নিক বা বিষাক্ত রং ব্যবহার না করে প্রাকৃতিক রঙের স্পর্শে প্রতিটি টি-শার্ট ডাই করা হয় যা একদম স্কিন ড্যামেজ ফ্রি।</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800/80 p-5 rounded-2xl flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Gift className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm text-white">জিরো-প্লাস্টিক স্টার্চ পলি</h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">আমাদের প্যাকেজিংয়ে পরিবেশ ক্ষতিকারক কোনো প্লাস্টিক নেই। প্রতিটি টি-শার্ট কাসাভা স্টার্চ দিয়ে তৈরি পচনশীল থলিতে কাস্টমারদের কাছে পৌঁছায়।</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800/80 p-5 rounded-2xl flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm text-white">ফেয়ার ওয়েজ অ্যান্ড রাইটস</h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">বুননের কারখানায় কর্মরত ডাইং মাস্টার এবং দক্ষ দর্জি কারিগরদের শতভাগ নায্য মজুরি ও সুরক্ষিত কর্মপরিবেশ আইন প্রফেশনালি বজায় রাখা হয়।</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SEAMLESS WORKFLOW TIMELINE: HOW WE DELIVER VALUE */}
      <section className="space-y-6">
        <div className="border-l-4 border-amber-500 pl-4 py-0.5">
          <h2 className="text-2xl font-black text-zinc-900 tracking-tight">সহজতম প্রফেশনাল ডেলিভারি ও রিয়েল ট্র্যাকিং প্রসেস</h2>
          <p className="text-xs text-zinc-550 mt-1 uppercase font-bold tracking-wider">ডোরস্টেপ এক্সপ্রেস ক্যাশ অন ডেলিভারি ৪টি সহজ ধাপে</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative">
          
          {/* Connector Line for Desktop */}
          <div className="absolute top-10 left-16 right-16 h-0.5 bg-zinc-250 hidden sm:block z-0" />

          {[
            {
              step: '১',
              title: 'ডিজাইন ও সাইজ সিলেক্ট',
              desc: 'আমাদের রিকমেন্ডেড মডেলে আপনার প্রিয় রিফাইন্ড টি-শার্ট বা রাজকীয় পোলোর সঠিক সাইজ দেখে কার্ট আইকন দিয়ে ব্যাগে যোগ করুন।',
              icon: <ShoppingBag className="w-5 h-5 text-amber-500" />
            },
            {
              step: '২',
              title: 'ক্যাশ অন ডেলিভারি',
              desc: 'চেকআউটে নাম, মোবাইল ও ঠিকানা দিন। শিপিং সিলেক্ট করুন। ডেলিভারিম্যান ঘরে টাকা নিয়ে গেলে কাপড় রিসিভ করবেন।',
              icon: <Truck className="w-5 h-5 text-amber-500" />
            },
            {
              step: '৩',
              title: 'রিয়েল-টাইম ট্র্যাকিং',
              desc: 'অ্যাডমিন প্যানেল থেকে পেন্ডিং অর্ডার প্যাকড অথবা ইন-ট্রানজিট হওয়া মাত্র ড্যাশবোর্ডে স্ট্যাটাস বদলে যাবে, যা লোকাল ট্র্যারে দেখা যায়।',
              icon: <Cpu className="w-5 h-5 text-amber-500" />
            },
            {
              step: '৪',
              title: '৭ দিনের সাইজ এক্সচেঞ্জ',
              desc: 'পাউচ খোলার পর যদি কোনো কারণে সাইজে অসঙ্গতি পান, তবে বুনন নম্বরে নির্দ্বিধায় কল দিয়ে একদম ফ্রিতে এক্সচেঞ্জ করিয়ে নিন।',
              icon: <RotateCcw className="w-5 h-5 text-amber-500" />
            }
          ].map((node, index) => (
            <div 
              key={index} 
              className="bg-white border border-zinc-200/80 p-5 rounded-2xl flex flex-col items-center sm:items-start text-center sm:text-left space-y-4 shadow-xs relative z-10 transition-transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between w-full">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  {node.icon}
                </div>
                <span className="w-7 h-7 rounded-full bg-zinc-950 font-mono text-zinc-100 flex items-center justify-center font-bold text-xs ring-4 ring-zinc-100">
                  {node.step}
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="font-extrabold text-zinc-950 text-sm">{node.title}</h3>
                <p className="text-[11px] text-zinc-500 leading-normal font-medium">{node.desc}</p>
              </div>
            </div>
          ))}

        </div>
      </section>

    </div>
  );
}
