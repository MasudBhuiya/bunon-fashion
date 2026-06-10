/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Phone, Mail, MapPin, ShieldCheck, Truck, RefreshCcw, Sparkles, Lock } from 'lucide-react';
// @ts-ignore - Vite handles static png imports natively, bypass TS module check
import brandLogo from '../assets/images/brand_logo_1780987950455.png';

interface FooterProps {
  setView: (view: string) => void;
}

export default function Footer({ setView }: FooterProps) {
  return (
    <footer className="bg-zinc-950 text-zinc-300 border-t border-zinc-900 font-sans mt-auto">
      
      {/* Premium Trust Badges row */}
      <div className="border-b border-zinc-900 bg-zinc-900/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            
            <div className="flex flex-col md:flex-row items-center gap-4 px-4">
              <div className="p-3 bg-zinc-950/80 rounded-2xl text-amber-400 shadow-lg border border-zinc-800">
                <Truck className="w-5.5 h-5.5" />
              </div>
              <div>
                <h4 className="font-extrabold text-white text-sm">সুপার কুরিয়ার ডেলিভারি</h4>
                <p className="text-xs text-zinc-400 mt-1 leading-normal">ঢাকা সিটি ও সমগ্র বাংলাদেশে সর্বোচ্চ ৭২ ঘণ্টায় ক্যাশ অন ডেলিভারি (COD) এবং হোম শিপিং সুবিধা।</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 px-4 border-y md:border-y-0 md:border-x border-zinc-850 py-6 md:py-0">
              <div className="p-3 bg-zinc-950/80 rounded-2xl text-amber-400 shadow-lg border border-zinc-800">
                <ShieldCheck className="w-5.5 h-5.5" />
              </div>
              <div>
                <h4 className="font-extrabold text-white text-sm">১০০% কম্বড কাঁচা কটন</h4>
                <p className="text-xs text-zinc-400 mt-1 leading-normal">সবচেয়ে আরামদায়ক ২৪০ ও ২৬০ জিএসএম (GSM) সূক্ষ্ম সুতার বুনন গ্যারান্টি। কোনো রকম ড্যামেজ বা ভেজালমুক্ত পোশাক কারিগরি।</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 px-4">
              <div className="p-3 bg-zinc-950/80 rounded-2xl text-amber-400 shadow-lg border border-zinc-800">
                <RefreshCcw className="w-5.5 h-5.5" />
              </div>
              <div>
                <h4 className="font-extrabold text-white text-sm">সহজ ৭ দিনের এক্সচেঞ্জ</h4>
                <p className="text-xs text-zinc-400 mt-1 leading-normal">সাইজ বা ফিটিংসে কোনো সমস্যা থাকলে কোনো বাড়তি প্রশ্ন ছাড়াই পরিবর্তনের শতভাগ সুবিধা।</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main links columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Logo intro */}
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 select-none">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-zinc-900 border border-amber-500/30 flex items-center justify-center shadow-lg">
                <img 
                  src={brandLogo} 
                  alt="বুনন লোগো"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col pl-1 border-l border-zinc-800/80 gap-0.5">
                <div className="flex items-baseline gap-1">
                  <span className="font-extrabold text-lg text-white tracking-tight leading-none bg-linear-to-r from-white to-zinc-300 bg-clip-text text-transparent">
                    বুনন
                  </span>
                  <span className="text-amber-400 font-extrabold text-[10px] tracking-wider leading-none">
                    BUNON
                  </span>
                </div>
                <span className="text-[7.5px] font-black text-zinc-400 tracking-wider leading-none uppercase">
                  THREADS & TRENDS
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-sm">
              বুনন (Bunon) হচ্ছে একটি অত্যন্ত এক্সক্লুসিভ ফ্যাশন হাউজ। স্থানীয় কারিগরদের দিয়ে তৈরি নিখুঁত বুনন সেলাই, কালার ফাস্টনেস এবং আকর্ষণীয় আরামদায়ক ডিজাইন দিয়ে প্রতিটি টি-শার্ট ও পোলো শার্ট আমরা তৈরি করি অত্যন্ত যত্ন সহকারে।
            </p>
          </div>

          {/* Quick link sections */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h5 className="font-extrabold text-white text-xs uppercase tracking-widest mb-4 border-b border-zinc-900 pb-2">সহায়তা হাব</h5>
              <ul className="space-y-2.5 text-xs text-zinc-400 font-semibold">
                <li><a href="#" className="hover:text-amber-400 transition-colors">আমাদের লক্ষ্য ও উদ্দেশ্য</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">রিটার্ন ও মানি রিফান্ড পলিসি</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">মোবাইল কুরিয়ার ট্র্যাকিং</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">বুনন ফ্র্যাঞ্চাইজ ক্যারিয়ার</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-extrabold text-white text-xs uppercase tracking-widest mb-4 border-b border-zinc-900 pb-2">জনপ্রিয় কালেকশনস</h5>
              <ul className="space-y-2.5 text-xs text-zinc-400 font-semibold">
                <li><a href="#" className="hover:text-amber-400 transition-colors">ক্লাসিক কটন টি-শার্টস</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">ওভারসাইজড ড্রপ-শোল্ডার</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">রয়াল কলার পোলো শার্টস</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">এলিট ড্রাই-ফিট স্পোর্টস জার্সি</a></li>
              </ul>
            </div>
          </div>

          {/* Contacts info */}
          <div>
            <h5 className="font-extrabold text-white text-xs uppercase tracking-widest mb-4 border-b border-zinc-900 pb-2">আমাদের প্রধান কার্যালয়</h5>
            <div className="space-y-3.5 text-xs text-zinc-400 font-semibold">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">ফ্ল্যাট ৩বি, বুনন টাওয়ার, সেক্টর ১১, উত্তরা মডেল টাউন, ঢাকা - ১২৩০, বাংলাদেশ।</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-amber-500 shrink-0" />
                <span>০১৮০০-বুনন (সকাল ৯টা - রাত ৮টা)</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-amber-500 shrink-0" />
                <span>support@bunonapparel.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* copyright */}
        <div className="border-t border-zinc-900 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 font-mono">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-[10px] text-zinc-500 font-bold shrink-0">
              &copy; {new Date().getFullYear()} বুনন অ্যাপারেলস লিমিটেড। সর্বস্বত্ব সংরক্ষিত।
            </p>
            {/* Extremely subtle & hidden lock trigger */}
            <button 
              onClick={() => {
                setView('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-zinc-950 hover:text-zinc-800 focus:outline-hidden p-1 transition-all rounded"
              title="অ্যাডমিন অপারেশনস"
              id="hidden-admin-trigger"
            >
              <Lock className="w-3.5 h-3.5 opacity-10 hover:opacity-100 transition-opacity cursor-pointer" />
            </button>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-[10px] text-zinc-500 font-bold">স্থায়ী গুণমান ও সাশ্রয়ী মূল্যের মেলবন্ধন</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
