/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, ShieldCheck, ShoppingBag, Truck, CreditCard, Sparkles } from 'lucide-react';
import { CartItem, ShippingInfo, Order, UserProfile } from '../types';

interface CheckoutViewProps {
  cartItems: CartItem[];
  onOrderPlaced: (order: Order) => void;
  onGoBack: () => void;
  userProfile?: UserProfile | null;
}

export default function CheckoutView({
  cartItems,
  onOrderPlaced,
  onGoBack,
  userProfile
}: CheckoutViewProps) {
  const [formData, setFormData] = useState<ShippingInfo>({
    name: userProfile?.name || '',
    phone: userProfile?.phone || '',
    email: userProfile?.email || '',
    address: '',
    city: 'dhaka'
  });

  const [paymentMethod, setPaymentMethod] = useState<string>('cod');
  const [txnId, setTxnId] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  const itemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const itemsTotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  
  // Custom shipping charges - free above 2000 BDT
  const shippingFee = itemsTotal > 2000 ? 0 : (formData.city === 'dhaka' ? 80 : 150);
  const grandTotal = itemsTotal + shippingFee;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Form inputs checks
    if (!formData.name.trim()) return setErrorMsg('অনুগ্রহ করে আপনার সম্পূর্ণ নাম লিখুন।');
    if (!formData.phone.trim()) return setErrorMsg('অনুগ্রহ করে সচল মোবাইল নম্বর লিখুন।');
    if (formData.phone.length < 11) return setErrorMsg('মোবাইল নম্বরটি অবশ্যই কমপক্ষে ১১ সংখ্যার হতে হবে।');
    if (!formData.address.trim()) return setErrorMsg('ডেলিভারি ঠিকানা বা অ্যাড্রেসটি বিস্তারিত লিখুন।');
    
    // Validate Transaction ID for mobile wallets
    if ((paymentMethod === 'bkash' || paymentMethod === 'nagad') && !txnId.trim()) {
      return setErrorMsg('অনুগ্রহ করে পেমেন্টের ট্রানজেকশন আইডি (TxnID) লিখুন কন্টিনিউ করতে।');
    }

    // Creating actual Order record
    const newOrder: Order = {
      id: 'BUNON-' + Math.floor(100000 + Math.random() * 900000),
      items: cartItems,
      totalPrice: grandTotal,
      shippingInfo: formData,
      paymentMethod: paymentMethod === 'cod' 
        ? 'ক্যাশ অন ডেলিভারি (COD)' 
        : paymentMethod === 'bkash' 
        ? `বিকাশ (TxId: ${txnId})` 
        : `নগদ (TxId: ${txnId})`,
      status: 'Pending',
      date: new Date().toLocaleDateString('bn-BD', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };

    setPlacedOrder(newOrder);
    onOrderPlaced(newOrder);
    setIsSuccess(true);
  };

  // Order Success Screen template
  if (isSuccess && placedOrder) {
    return (
      <div className="font-sans max-w-2xl mx-auto py-10 text-center bg-white rounded-3xl border border-zinc-200 p-6 sm:p-10 shadow-xl" id="checkout-success-view">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500 mb-6 scale-110 border border-emerald-100">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-black text-emerald-600">অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে!</h1>
        <p className="text-xs sm:text-sm font-bold text-zinc-500 mt-2 max-w-md mx-auto leading-relaxed">
          আপনার অর্ডারটি সফলভাবে নথিবদ্ধ হয়েছে। ২৪ ঘণ্টার মধ্যে আমাদের কাস্টমার রিলেশন টিম আপনার নম্বরে কল দিয়ে সাইজ ও ঠিকানা ভেরিফাই করে নেবে।
        </p>

        {/* Invoice Summary Brief */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 text-left mt-8 space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-zinc-200">
            <span className="text-[10px] text-zinc-400 font-extrabold uppercase">অর্ডার ট্র্যাকিং আইডি:</span>
            <span className="text-xs font-black font-mono text-amber-600">{placedOrder.id}</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-400 font-bold">অর্ডারের তারিখ:</span>
            <span className="font-black text-zinc-800">{placedOrder.date}</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-400 font-bold">গ্রাহকের নাম:</span>
            <span className="font-extrabold text-zinc-900">{placedOrder.shippingInfo.name}</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-400 font-bold">মোবাইল ফোন নম্বর:</span>
            <span className="font-black font-sans text-zinc-800">{placedOrder.shippingInfo.phone}</span>
          </div>

          <div className="flex justify-between text-xs gap-4">
            <span className="text-zinc-400 font-bold shrink-0">ডেলিভারি গন্তব্য:</span>
            <span className="font-bold text-zinc-700 text-right">{placedOrder.shippingInfo.address}, {placedOrder.shippingInfo.city === 'dhaka' ? 'ঢাকা' : 'ঢাকার বাইরে (সারাদেশ)'}</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-400 font-bold">নির্বাচিত পেমেন্ট মাধ্যম:</span>
            <span className="font-black text-zinc-850 bg-amber-500/10 px-2 py-0.5 rounded text-[11px]">{placedOrder.paymentMethod}</span>
          </div>

          <div className="h-px bg-zinc-200 my-2" />

          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-zinc-900 uppercase">সর্বমোট প্রদেয় বিল:</span>
            <span className="text-lg font-black text-zinc-950 font-sans">
              ৳{placedOrder.totalPrice}
            </span>
          </div>
        </div>

        <button
          onClick={onGoBack}
          className="mt-8 px-8 py-4 bg-zinc-950 text-white font-black text-xs uppercase tracking-widest rounded-full hover:bg-amber-400 hover:text-zinc-950 shadow-md transition-all active:scale-95 cursor-pointer"
        >
          অর্ডার ট্র্যাকিং পেজে যান
        </button>
      </div>
    );
  }

  return (
    <div className="font-sans max-w-6xl mx-auto space-y-8">
      
      <div className="flex items-center gap-3">
        <button
          onClick={onGoBack}
          className="p-2.5 border border-zinc-200 hover:bg-zinc-100 rounded-xl text-zinc-650 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="border-l-4 border-amber-500 pl-4 py-0.5 text-left">
          <h1 className="text-2xl font-black text-zinc-950 tracking-tight">ডেলিভারি চেকআউট (Secure Checkout)</h1>
          <p className="text-xs text-zinc-500 mt-1 uppercase font-bold tracking-wider">সঠিক শিপিং এড্রেস দিয়ে কাস্টম বুনন অর্ডার সম্পন্ন করুন</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Billing inputs form */}
        <form onSubmit={handlePlaceOrder} className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-3xl border border-zinc-150 p-6 space-y-5 shadow-xs text-left">
            <h2 className="font-extrabold text-zinc-950 text-base flex items-center gap-2 pb-3 border-b border-zinc-100 mb-2 uppercase tracking-wide">
              <Truck className="w-5 h-5 text-amber-500" />
              ১. শিপিং ও কুরিয়ার ডেলিভারি ঠিকানা
            </h2>

            {errorMsg && (
              <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-bold leading-relaxed">
                ⚠️ {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-zinc-700 block">গ্রাহকের সম্পূর্ণ নাম <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="যেমন: রাইয়ান চৌধুরী"
                  className="block w-full px-4 py-3 border border-zinc-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 bg-zinc-50/50 transition-all font-bold placeholder-zinc-400"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-zinc-700 block">সচল মোবাইল ফোন নম্বর <span className="text-rose-500">*</span></label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="যেমন: ০১৭১২৩৪৫৬৭৮"
                  className="block w-full px-4 py-3 border border-zinc-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 bg-zinc-50/50 transition-all font-sans font-bold placeholder-zinc-400"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-zinc-700 block">ইমেইল এড্রেস (ঐচ্ছিক)</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="যেমন: rayan@example.com"
                  className="block w-full px-4 py-3 border border-zinc-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 bg-zinc-50/50 transition-all font-bold placeholder-zinc-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-zinc-700 block">ডেলিভারি রিজিয়ন / জোন <span className="text-rose-500">*</span></label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-zinc-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 bg-white transition-all shadow-xs text-zinc-700 font-bold"
                >
                  <option value="dhaka">ঢাকা সিটি (চার্জ ৳৮০)</option>
                  <option value="outside">ঢাকার বাইরে / সারাদেশে (চার্জ ৳১৫০)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-zinc-700 block">বিস্তারিত কুরিয়ার এড্রেস (থানা, জেলা এবং রোড বিবরণ) <span className="text-rose-500">*</span></label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="যেমন: ৫নং রোড, ১২/এ ফ্ল্যাট, উত্তরা সেক্টর ৪, ঢাকা"
                rows={3}
                className="block w-full px-4 py-3 border border-zinc-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 bg-zinc-50/50 transition-all font-semibold placeholder-zinc-400 leading-relaxed"
                required
              />
            </div>
          </div>

          {/* Payment gateway Selection list */}
          <div className="bg-white rounded-3xl border border-zinc-150 p-6 space-y-5 shadow-xs text-left">
            <h2 className="font-extrabold text-zinc-950 text-base flex items-center gap-2 pb-3 border-b border-zinc-100 mb-2 uppercase tracking-wide">
              <CreditCard className="w-5 h-5 text-amber-500" />
              ২. পেমেন্ট মেথড নিশ্চিত করুন
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* COD */}
              <label className={`flex flex-col items-center justify-center p-4.5 rounded-xl border text-center cursor-pointer transition-all ${
                paymentMethod === 'cod' 
                  ? 'border-amber-500 bg-amber-500/10 text-zinc-950 ring-2 ring-amber-500/10 font-bold' 
                  : 'border-zinc-200 hover:border-zinc-350 text-zinc-650'
              }`}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="cod" 
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="sr-only" 
                />
                <span className="text-xs font-extrabold block uppercase tracking-wide">Cash On Delivery</span>
                <span className="text-[10px] text-zinc-500 mt-1 block font-bold">কাপড় হাতে পেয়ে মূল্য পরিশোধ</span>
              </label>

              {/* bKash */}
              <label className={`flex flex-col items-center justify-center p-4.5 rounded-xl border text-center cursor-pointer transition-all ${
                paymentMethod === 'bkash' 
                  ? 'border-pink-500 bg-pink-50 text-pink-700 ring-2 ring-pink-500/15 font-bold' 
                  : 'border-zinc-200 hover:border-zinc-350 text-zinc-650'
              }`}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="bkash" 
                  checked={paymentMethod === 'bkash'}
                  onChange={() => setPaymentMethod('bkash')}
                  className="sr-only" 
                />
                <span className="text-xs font-extrabold block uppercase tracking-wide">বিকাশ (bKash)</span>
                <span className="text-[10px] text-zinc-500 mt-1 block font-bold">Bkash মার্চেন্ট পেমেন্ট</span>
              </label>

              {/* Nagad */}
              <label className={`flex flex-col items-center justify-center p-4.5 rounded-xl border text-center cursor-pointer transition-all ${
                paymentMethod === 'nagad' 
                  ? 'border-orange-500 bg-orange-50 text-orange-700 ring-2 ring-orange-500/15 font-bold' 
                  : 'border-zinc-200 hover:border-zinc-350 text-zinc-650'
              }`}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="nagad" 
                  checked={paymentMethod === 'nagad'}
                  onChange={() => setPaymentMethod('nagad')}
                  className="sr-only" 
                />
                <span className="text-xs font-extrabold block uppercase tracking-wide">নগদ (Nagad)</span>
                <span className="text-[10px] text-zinc-500 mt-1 block font-bold">Nagad মার্চেন্ট পেমেন্ট</span>
              </label>
            </div>

            {/* Wallet instruction panel */}
            {(paymentMethod === 'bkash' || paymentMethod === 'nagad') && (
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-3">
                <p className="text-xs text-zinc-600 leading-relaxed font-semibold">
                  ১. আমাদের অফিসিয়াল মার্চেন্ট নাম্বার <strong>(০১৮০০-বুনন)</strong>-এ গিয়ে প্রয়োজনীয় পরিশোধ মূল্য সেন্ড-মানি বা মার্চেন্ট পেমেন্ট করুন। <br />
                  ২. ট্রানজেকশন সফল হলে টেক্সট মেসেজের <strong>Transaction ID (TxnID)</strong>টি কপি করে নিচের বক্সে প্রদান করুন:
                </p>
                <div className="space-y-1.5 max-w-sm">
                  <label className="text-[10px] font-black text-zinc-700 uppercase tracking-wider block">ফিরতি ট্রানজেকশন আইডি (TxnID):</label>
                  <input
                    type="text"
                    value={txnId}
                    onChange={(e) => setTxnId(e.target.value)}
                    placeholder="যেমন: TR8YI9OLK"
                    className="block w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 bg-white placeholder-zinc-400 uppercase font-black tracking-wider"
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4.5 bg-zinc-950 text-white hover:bg-amber-400 hover:text-zinc-950 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              নিশ্চিত করুন এবং অর্ডার সম্পন্ন করুন
            </button>
          </div>

        </form>

        {/* Right column mini rows items list */}
        <div className="bg-white rounded-3xl border border-zinc-150 p-6 space-y-4 shadow-xs sticky top-24 text-left">
          <h3 className="font-extrabold text-zinc-950 text-xs uppercase tracking-widest border-b border-zinc-100 pb-2 mb-2">শিপিং ব্যাগ তালিকা</h3>

          {/* Scrolling items summary */}
          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div key={item.product.id} className="flex gap-3 justify-between items-center text-xs">
                <div className="flex gap-2.5 items-center min-w-0">
                  <img 
                    src={item.product.imageUrl} 
                    alt={item.product.name} 
                    className="w-10 h-10 object-cover rounded-lg border border-zinc-250 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-zinc-900 truncate leading-none mb-1">{item.product.banglaName}</h4>
                    <span className="text-zinc-400 text-[10px] font-bold block">৳{item.product.price} x {item.quantity}</span>
                  </div>
                </div>
                <span className="font-black text-zinc-950 shrink-0">৳{item.product.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-zinc-100 my-4 pt-3 space-y-2.5 text-xs text-zinc-500 font-semibold">
            <div className="flex justify-between items-center">
              <span>পোশাক সাবটোটাল:</span>
              <span className="font-black text-zinc-950">৳{itemsTotal}</span>
            </div>

            <div className="flex justify-between items-center">
              <span>ডেলিভারি চার্জ:</span>
              <span className="font-black text-zinc-950">
                {shippingFee === 0 ? (
                  <span className="text-emerald-700 text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 bg-emerald-50 rounded-md">ফ্রি</span>
                ) : (
                  `৳${shippingFee}`
                )}
              </span>
            </div>

            <div className="h-px bg-zinc-200 my-2" />

            <div className="flex justify-between items-center text-sm">
              <span className="font-extrabold text-zinc-950 block leading-none">মোট প্রদেয় বিল:</span>
              <span className="text-base font-black text-zinc-950 font-sans">৳{grandTotal}</span>
            </div>
          </div>

          {/* Safe checkout validation info */}
          <div className="border-t border-zinc-100 pt-3 flex items-center justify-center gap-1.5 text-[10px] text-zinc-400 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>১০০% প্রটেক্টেড ডাবল-ইনক্রিপ্ট ট্র্যাকিং</span>
          </div>

        </div>

      </div>
    </div>
  );
}
