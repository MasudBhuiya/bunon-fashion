/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  ClipboardList, 
  ArrowLeft, 
  Trash2, 
  Calendar, 
  ShieldAlert, 
  Truck, 
  CheckCircle, 
  Package, 
  ArrowRight,
  User,
  Camera,
  LogOut,
  Edit2,
  Check,
  Search,
  History,
  CheckCircle2
} from 'lucide-react';
import { Order, UserProfile } from '../types';
import { fetchProfileFromDb, upsertProfileInDb, normalizePhoneNumber } from '../lib/db';

interface OrdersViewProps {
  orders: Order[];
  onClearOrders: () => void;
  onCancelOrder: (orderId: string) => void;
  onGoBack: () => void;
  userProfile: UserProfile | null;
  onUpdateProfile: (profile: UserProfile | null) => void;
}

const PRESET_AVATARS = [
  { id: 'preset-1', name: 'Elegant Chic', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop' },
  { id: 'preset-2', name: 'Contemporary Casual', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop' },
  { id: 'preset-3', name: 'Modern Apparels', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=150&auto=format&fit=crop' },
  { id: 'preset-4', name: 'Technical Mindset', url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=150&auto=format&fit=crop' }
];

export default function OrdersView({
  orders,
  onClearOrders,
  onCancelOrder,
  onGoBack,
  userProfile,
  onUpdateProfile
}: OrdersViewProps) {
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // States for Login / Setup Form
  const [loginMethod, setLoginMethod] = useState<'track' | 'create'>('track');
  const [searchContact, setSearchContact] = useState('');
  const [createName, setCreateName] = useState('');
  const [createPhone, setCreatePhone] = useState('');
  const [createEmail, setCreateEmail] = useState('');
  const [selectedPresetAvatar, setSelectedPresetAvatar] = useState(PRESET_AVATARS[0].url);
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Editing profile details state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');

  const triggerConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // 1. Passwordless Track Login Handler (Registered database + Order Fallback)
  const handleTrackLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setLoginError('');
    setLoginSuccess('');

    const query = searchContact.trim().toLowerCase();
    if (!query) {
      setLoginError('অনুগ্রহ করে আপনার মোবাইল ফোন নম্বর বা ইমেইল আইডি লিখুন!');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. First, search within the persistent Supabase profiles table
      let foundProfile = await fetchProfileFromDb(query);

      // 2. If not found in the registry, search the order records as fallback
      if (!foundProfile) {
        const matchedOrders = orders.filter(
          o => {
            const oPhoneNorm = normalizePhoneNumber(o.shippingInfo.phone);
            const qPhoneNorm = normalizePhoneNumber(query);
            if (oPhoneNorm && qPhoneNorm && oPhoneNorm === qPhoneNorm) {
              return true;
            }
            const oEmailClean = o.shippingInfo.email.trim().toLowerCase();
            const qClean = query.trim().toLowerCase();
            return oEmailClean === qClean || 
                   o.shippingInfo.phone.trim().toLowerCase() === qClean ||
                   o.shippingInfo.phone.includes(query) || 
                   o.shippingInfo.email.toLowerCase().includes(query);
          }
        );

        if (matchedOrders.length > 0) {
          // Find the latest order’s details to synthesize a profile
          const latestOrder = matchedOrders[0];
          foundProfile = {
            name: latestOrder.shippingInfo.name,
            phone: latestOrder.shippingInfo.phone,
            email: latestOrder.shippingInfo.email,
            avatarUrl: PRESET_AVATARS[0].url // Use default elegant blazer
          };

          // Register them automatically so they are persisted in Supabase
          await upsertProfileInDb(foundProfile);
        }
      }

      // 3. Act on found profile
      if (foundProfile) {
        // Safe copy also locally
        try {
          const storedUsers = localStorage.getItem('bunon_registered_users');
          const users: UserProfile[] = storedUsers ? JSON.parse(storedUsers) : [];
          const filtered = users.filter(u => u.phone.trim().toLowerCase() !== foundProfile!.phone.trim().toLowerCase());
          localStorage.setItem('bunon_registered_users', JSON.stringify([foundProfile, ...filtered]));
        } catch (je) {}

        onUpdateProfile(foundProfile);
        setLoginSuccess('প্রোফাইল গর্জিয়াসভাবে খুঁজে পাওয়া গেছে! ড্যাশবোর্ড লোড হচ্ছে...');
        setSearchContact('');
      } else {
        setLoginError('দুঃখিত, এই নম্বর বা ইমেইলের অনুকূলে বুনন সিস্টেমে পূর্বে নিবন্ধিত কোনো প্রোফাইল বা শপিং অর্ডার তথ্য পাওয়া যায়নি। অনুগ্রহ করে নতুন প্রোফাইল তৈরি করুন!');
      }
    } catch (err) {
      console.error('Track login error', err);
      setLoginError('নেটওয়ার্ক সংযোগে সমস্যা হয়েছে, অনুগ্রহ করে আবার চেষ্টা করুন!');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. Custom Guest Profile Creation Handler (With real-time Supabase save)
  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setLoginError('');
    setLoginSuccess('');

    if (!createName.trim()) return setLoginError('অনুগ্রহ করে নাম প্রদান করুন!');
    if (!createPhone.trim()) return setLoginError('অনুগ্রহ করে ফোন নম্বর লিখুন!');
    if (createPhone.trim().length < 11) return setLoginError('সচল মোবাইল নম্বরটি কমপক্ষে ১১ ডিজিটের হতে হবে!');

    const guestProfile: UserProfile = {
      name: createName,
      phone: createPhone,
      email: createEmail,
      avatarUrl: selectedPresetAvatar
    };

    setIsSubmitting(true);
    try {
      // Save profile instantly to Supabase database
      const success = await upsertProfileInDb(guestProfile);
      
      if (success) {
        // Sync to local fallback too
        try {
          const storedUsers = localStorage.getItem('bunon_registered_users');
          const users: UserProfile[] = storedUsers ? JSON.parse(storedUsers) : [];
          const filtered = users.filter(u => 
            u.phone.trim().toLowerCase() !== guestProfile.phone.trim().toLowerCase()
          );
          const updated = [guestProfile, ...filtered];
          localStorage.setItem('bunon_registered_users', JSON.stringify(updated));
        } catch (je) {}

        onUpdateProfile(guestProfile);
        setLoginSuccess('আপনার মেহমান প্রোফাইলটি সফলভাবে তৈরি ও সংরক্ষিত হয়েছে!');
        setCreateName('');
        setCreatePhone('');
        setCreateEmail('');
      } else {
        setLoginError('প্রোফাইলটি নিবন্ধিত করা সম্ভব হয়নি। অনুগ্রহ করে পুনরায় চেষ্টা করুন!');
      }
    } catch (err: any) {
      console.error('Error creating profile', err);
      const errMsg = err?.message || err?.details || String(err);
      setLoginError(`ডেটাবেজ সংযোগ ত্রুটি: ${errMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Edit Profile Form Active Toggle
  const startEditing = () => {
    if (userProfile) {
      setEditName(userProfile.name);
      setEditPhone(userProfile.phone);
      setEditEmail(userProfile.email);
      setIsEditingProfile(true);
    }
  };

  const handleSaveProfileChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!editName.trim()) return;
    if (!editPhone.trim()) return;

    if (userProfile) {
      setIsSubmitting(true);
      const updated: UserProfile = {
        ...userProfile,
        name: editName,
        phone: editPhone,
        email: editEmail
      };

      try {
        const success = await upsertProfileInDb(updated);
        if (success) {
          onUpdateProfile(updated);
          setIsEditingProfile(false);
        } else {
          setLoginError('প্রোফাইল পরিবর্তন সংরক্ষণ করা যায়নি!');
        }
      } catch (err: any) {
        console.error('Error saving profile modifications', err);
        const errMsg = err?.message || err?.details || String(err);
        setLoginError(`প্রোফাইল পরিবর্তনের ডেটাবেজ ত্রুটি: ${errMsg}`);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // 4. Custom File Upload Reader (Base64 saved to Supabase)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && userProfile) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        if (typeof reader.result === 'string') {
          const updatedProfile = {
            ...userProfile,
            avatarUrl: reader.result
          };
          onUpdateProfile(updatedProfile);
          
          try {
            await upsertProfileInDb(updatedProfile);
          } catch (err) {
            console.error('Failed to sync uploaded avatar to Supabase:', err);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Filter orders related to the active logged-in User Profile
  const filteredOrders = userProfile 
    ? orders.filter(
        o => {
          const oPhoneNorm = normalizePhoneNumber(o.shippingInfo.phone);
          const uPhoneNorm = normalizePhoneNumber(userProfile.phone);
          if (oPhoneNorm && uPhoneNorm && oPhoneNorm === uPhoneNorm) {
            return true;
          }
          const oEmailClean = o.shippingInfo.email.trim().toLowerCase();
          const uEmailClean = userProfile.email ? userProfile.email.trim().toLowerCase() : '';
          return (uEmailClean && oEmailClean === uEmailClean) ||
                 (o.shippingInfo.phone.trim().toLowerCase() === userProfile.phone.trim().toLowerCase());
        }
      )
    : [];

  return (
    <div className="font-sans max-w-4xl mx-auto space-y-8">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="border-l-4 border-amber-500 pl-4 py-0.5">
          <h1 className="text-2xl font-black text-zinc-950 tracking-tight">ড্যাশবোর্ড ও লাইভ ট্র্যাকিং</h1>
          <p className="text-xs text-zinc-500 mt-1 uppercase font-bold tracking-wider">রিয়েল-টাইমে আপনার কাপড়ের শিপিং, অর্ডার ইতিহাস ও প্রোফাইল ট্র্যাকিং</p>
        </div>
        
        <button
          onClick={onGoBack}
          className="inline-flex items-center gap-1.5 text-xs font-black text-zinc-700 bg-zinc-100 hover:bg-zinc-200 px-4 py-2.5 rounded-xl transition-all cursor-pointer border border-zinc-200 self-start"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          কালেকশনে ফিরে যান
        </button>
      </div>

      {/* 1. NO LOGGED IN PROFILE VIEW */}
      {!userProfile ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch pt-2">
          
          {/* Scientific Info & Brand Pitch Panel */}
          <div className="md:col-span-5 bg-zinc-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-zinc-850 relative overflow-hidden shadow-xl">
            {/* Soft decorative background circles */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="space-y-6 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                B
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-black text-white leading-tight">বুনন ইন্টেলিজেন্ট ট্র্যাকিং হাব</h2>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  আপনার পূর্বে অর্ডার করা পোশাক ট্র্যাক করা ও প্রোফাইল ছবি সাজানো এখন আরও জাদুকরী ও সুরক্ষিত। আপনার ফোন নম্বর অথবা ইমেইল দিয়ে প্রবেশ করলেই কোনো পাসওয়ার্ড ছাড়াই আপনার সব অর্ডারের তালিকা দেখতে পাবেন।
                </p>
              </div>
            </div>

            <div className="pt-8 border-t border-zinc-850 relative z-10">
              <span className="text-[10px] uppercase font-black tracking-wider text-zinc-500 block mb-2">সহায়তা কুটির</span>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                কোনো অর্ডার ট্র্যাক করতে সমস্যা হলে আমাদের কাস্টমার কেয়ার নম্বরে অথবা ইমেইলে যোগাযোগ করুন।
              </p>
            </div>
          </div>
          <div className="md:col-span-7 bg-white rounded-3xl border border-zinc-200 shadow-lg p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Form toggles */}
              <div className="inline-flex bg-zinc-100 p-1 rounded-xl mb-6">
                <button
                  type="button"
                  onClick={() => { setLoginMethod('track'); setLoginError(''); }}
                  className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
                    loginMethod === 'track' ? 'bg-zinc-950 text-white shadow' : 'text-zinc-650 hover:text-zinc-900'
                  }`}
                >
                  ফোন বা ইমেইল দিয়ে লগইন / ট্র্যাক করুন
                </button>
                <button
                  type="button"
                  onClick={() => { setLoginMethod('create'); setLoginError(''); }}
                  className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
                    loginMethod === 'create' ? 'bg-zinc-950 text-white shadow' : 'text-zinc-650 hover:text-zinc-900'
                  }`}
                >
                  নতুন প্রোফাইল তৈরি করুন
                </button>
              </div>

              {loginError && (
                <div className="mb-4 p-3.5 bg-rose-50 border border-rose-150 text-rose-700 rounded-xl text-xs font-bold leading-relaxed">
                  ⚠️ {loginError}
                </div>
              )}

              {loginSuccess && (
                <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-150 text-emerald-800 rounded-xl text-xs font-bold leading-relaxed">
                  🎉 {loginSuccess}
                </div>
              )}

              {/* METHOD 1: Track or Login with email or phone */}
              {loginMethod === 'track' ? (
                <form onSubmit={handleTrackLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-black tracking-wider text-zinc-500 block">মোবাইল ফোন নম্বর অথবা ইমেইল:</label>
                    <div className="relative flex items-center font-sans">
                      <input
                        type="text"
                        required
                        placeholder="যেমন: 01712345678 বা customer@domain.com"
                        value={searchContact}
                        onChange={(e) => setSearchContact(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-4 pr-12 py-3.5 text-xs text-zinc-900 focus:ring-1 focus:ring-amber-500 font-sans font-medium"
                      />
                      <div className="absolute right-3.5 text-zinc-400">
                        <Search className="w-4 h-4" />
                      </div>
                    </div>
                    <span className="text-[10px] text-zinc-400 mt-1 block font-medium">নিবন্ধিত ফোন নম্বর বা ইমেইল লিখলেই আপনার প্রোফাইল ও বর্তমান অর্ডার স্ট্যাটাস সরাসরি লোড হবে।</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                  >
                    লগইন করুন ও ড্যাশবোর্ডে প্রবেশ করুন
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </button>
                </form>
              ) : (
                /* METHOD 2: Manual profile setting */
                <form onSubmit={handleCreateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-black tracking-wider text-zinc-500 block">আপনার নাম:</label>
                      <input
                        type="text"
                        required
                        placeholder="যেমন: আরিয়ান মালিক"
                        value={createName}
                        onChange={(e) => setCreateName(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-900 focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-black tracking-wider text-zinc-500 block">মোবাইল নম্বর:</label>
                      <input
                        type="text"
                        required
                        placeholder="যেমন: 017xxxxxxxx"
                        value={createPhone}
                        onChange={(e) => setCreatePhone(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-900 focus:ring-1 focus:ring-amber-500 font-sans font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-black tracking-wider text-zinc-500 block">ইমেইল ঠিকানা (ঐচ্ছিক):</label>
                    <input
                      type="email"
                      placeholder="যেমন: name@domain.com"
                      value={createEmail}
                      onChange={(e) => setCreateEmail(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-900 focus:ring-1 focus:ring-amber-500 font-sans font-medium"
                    />
                  </div>

                  {/* Aesthetic Avatar Selector */}
                  <div className="space-y-2 pt-2">
                    <label className="text-[10px] uppercase font-black tracking-wider text-zinc-500 block">পছন্দের ফ্যাশনেবল অবতার:</label>
                    <div className="flex gap-3 justify-center">
                      {PRESET_AVATARS.map((preset) => {
                        const isSelected = selectedPresetAvatar === preset.url;
                        return (
                          <div
                            key={preset.id}
                            onClick={() => setSelectedPresetAvatar(preset.url)}
                            className={`relative w-12 h-12 rounded-full overflow-hidden border-2 cursor-pointer transition-all ${
                              isSelected ? 'border-amber-500 scale-105' : 'border-zinc-200 hover:border-zinc-350'
                            }`}
                          >
                            <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            {isSelected && (
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <span className="bg-amber-500 text-zinc-950 p-1.5 rounded-full block shadow-md">
                                  <Check className="w-2.5 h-2.5 stroke-[3.5]" />
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-zinc-950 hover:bg-zinc-850 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95 cursor-pointer mt-2"
                  >
                    তৈরি করুন ও ড্যাশবোর্ডে প্রবেশ করুন
                  </button>
                </form>
              )}
            </div>

            {/* Note about secure guest access */}
            <div className="border-t border-zinc-150 pt-4 mt-6 text-zinc-400 text-[10px] text-center font-medium leading-relaxed">
              🔒 বুনন সিকিউর ট্র্যাকিং: আপনার তথ্য সম্পূর্ণ লাইভ ইনক্রিপ্টেড এবং নিরাপদ।
            </div>

            {/* Quick Auto login matching recent browser storage helper optionally */}
            {orders.length > 0 && (
              <div className="border-t border-zinc-150 pt-4 mt-4 flex flex-col gap-2 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <span className="text-zinc-500 font-medium">ক্যাম্পেইনের অধীনে আপনার ব্রাউজারে {orders.length} টি সম্ভাব্য অর্ডার রেকর্ড ট্র্যাক রয়েছে।</span>
                  <button
                    type="button"
                    onClick={() => {
                      const latest = orders[0];
                      const autoProfile: UserProfile = {
                        name: latest.shippingInfo.name,
                        phone: latest.shippingInfo.phone,
                        email: latest.shippingInfo.email,
                        avatarUrl: PRESET_AVATARS[0].url
                      };
                      onUpdateProfile(autoProfile);
                    }}
                    className="inline-flex items-center gap-1.5 text-amber-600 font-black tracking-wide hover:underline cursor-pointer shrink-0"
                  >
                    <History className="w-3.5 h-3.5" />
                    সাম্প্রতিক অর্ডার দিয়ে অটো-লগইন
                  </button>
                </div>
                <p className="text-[10px] text-zinc-400 font-medium leading-normal bg-zinc-50 p-2.5 rounded-lg border border-zinc-100">
                  ⚠️ <strong>গোপনীয়তা নীতি:</strong> এই সুবিধাটি শুধুমাত্র আপনার <strong>বর্তমান ব্রাউজার ও ডিভাইসে</strong> পূর্বে সফলভাবে সম্পন্ন করা অর্ডারের সাময়িক ক্যাশ থেকে কাজ করছে। অন্য কোনো ডিভাইসের গ্রাহক বা তৃতীয় পক্ষ কোনোভাবেই আপনার এই তথ্য অ্যাক্সেস বা দেখতে পারবে না।
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (

        /* 2. ACTIVE LOGGED IN PROFILE VIEW & SYSTEM DASHBOARD */
        <div className="space-y-8">
          
          {/* USER PROFILE INFO BANNER & INTERACTION CONTAINER */}
          <div className="bg-zinc-950 text-white rounded-3xl border border-zinc-800 shadow-xl p-5 sm:p-6 relative overflow-hidden">
            {/* Ambient Background subtle lights */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              {/* Profile Main block containing editable avatar & custom file upload */}
              <div className="flex flex-col sm:flex-row items-center gap-5">
                
                {/* Profile Pic with Hover Camera Trigger */}
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-zinc-900 border-2 border-amber-500/50 group shrink-0 shadow-lg">
                  <img 
                    src={userProfile.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150'} 
                    alt={userProfile.name} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* File Upload Hidden Overlay */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer"
                    title="প্রোফাইল ছবি পরিবর্তন করুন"
                  >
                    <Camera className="w-5 h-5 text-amber-400" />
                    <span className="text-[7px] text-zinc-300 font-extrabold mt-1 tracking-widest uppercase">UPLOAD</span>
                  </div>
                  
                  {/* Native Hidden input file trigger */}
                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                {/* Profile Details area */}
                {isEditingProfile ? (
                  <form onSubmit={handleSaveProfileChanges} className="space-y-2.5 w-full text-zinc-950">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input 
                        type="text"
                        required
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="bg-white border border-zinc-200 px-3 py-1.5 rounded-lg text-xs font-bold text-zinc-900 w-full sm:w-40"
                        placeholder="আপনার নাম"
                      />
                      <input 
                        type="text"
                        required
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="bg-white border border-zinc-200 px-3 py-1.5 rounded-lg text-xs font-bold text-zinc-900 w-full sm:w-40 font-sans"
                        placeholder="ফোন নম্বর"
                      />
                      <input 
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="bg-white border border-zinc-200 px-3 py-1.5 rounded-lg text-xs font-bold text-zinc-900 w-full sm:w-44 font-sans"
                        placeholder="ইমেইল আইডি"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        type="submit"
                        className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        সংরক্ষণ করুন
                      </button>
                      <button 
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                      >
                        বাতিল
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center sm:text-left space-y-1">
                    <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                      <h2 className="text-lg font-black text-white shrink-0">{userProfile.name}</h2>
                      <span className="text-[8px] font-black uppercase text-amber-500 bg-amber-500/10 border border-amber-500/15 px-2 py-0.5 rounded leading-none shrink-0 tracking-widest">
                        BUNON VERIFIED MEMBER
                      </span>
                    </div>
                    <p className="text-xs text-zinc-350 flex items-center justify-center sm:justify-start gap-1 font-sans">
                      <span>📱 {userProfile.phone}</span>
                      {userProfile.email && (
                        <>
                          <span className="text-zinc-500">•</span>
                          <span>✉️ {userProfile.email}</span>
                        </>
                      )}
                    </p>

                    {/* Quick presets list for active users to swap instant visuals */}
                    <div className="pt-2 flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                      <span className="text-[9px] text-zinc-500 font-black uppercase">Preset characters:</span>
                      <div className="flex gap-1.5">
                        {PRESET_AVATARS.map((preset) => {
                          const isCustomActive = userProfile.avatarUrl === preset.url;
                          return (
                            <button
                              key={preset.id}
                              onClick={() => onUpdateProfile({ ...userProfile, avatarUrl: preset.url })}
                              className={`w-5 h-5 rounded-full overflow-hidden border transition-transform hover:scale-110 cursor-pointer ${isCustomActive ? 'border-amber-400 scale-105' : 'border-zinc-700'}`}
                              title={preset.name}
                            >
                              <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Edit/Logout operations */}
              <div className="flex items-center justify-center gap-2 self-center sm:self-auto">
                {!isEditingProfile && (
                  <button
                    onClick={startEditing}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 hover:bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-black tracking-wide text-zinc-300 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-zinc-400" />
                    প্রোফাইল সংশোধন
                  </button>
                )}
                
                <button
                  type="button"
                  onClick={() => {
                    triggerConfirm(
                      'প্রোফাইল থেকে সাইন-আউট করুন',
                      'আপনি কি আপনার সক্রিয় ড্যাশবোর্ড প্রোফাইল থেকে লগআউট করতে চান? পরবর্তীকালে আপনি যেকোনো সময় পুনরায় আপনার ফোন নম্বর দিয়ে আপনার পোশাকের লাইভ অর্ডার দেখতে ফিরে আসতে পারবেন।',
                      () => onUpdateProfile(null)
                    );
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 hover:bg-rose-500/10 border border-rose-550/20 rounded-xl text-xs font-black tracking-wide text-rose-400 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  লগআউট
                </button>
              </div>

            </div>

          </div>

          {/* DYNAMIC LIST OF ACTIVE PROFILE FILTERED ORDERS */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-150 pb-2">
              <h3 className="font-extrabold text-zinc-950 text-base flex items-center gap-1.5">
                <ClipboardList className="w-5 h-5 text-amber-500" />
                আপনার ক্রয়কৃত পোশাকের তথ্য ({filteredOrders.length} টি অর্ডার)
              </h3>

              {filteredOrders.length > 0 && (
                <button
                  onClick={() => triggerConfirm(
                    'অর্ডার হিস্ট্রি সাফ করা',
                    'আপনার ডিভাইসের ডাটা থেকে অর্ডার হিস্ট্রি মুছে দেয়া হবে। আপনি কি নিশ্চিত?',
                    onClearOrders
                  )}
                  className="text-xs font-black text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  ইতিহাস সাফ করুন
                </button>
              )}
            </div>

            {filteredOrders.length === 0 ? (
              <div className="font-sans text-center py-12 bg-zinc-50 rounded-3xl border border-zinc-200 p-8 max-w-lg mx-auto">
                <div className="w-14 h-14 bg-zinc-100 rounded-full flex items-center justify-center mx-auto text-zinc-450 mb-4">
                  <ClipboardList className="w-7 h-7" />
                </div>
                <h3 className="text-base font-black text-zinc-800">কোনো পোশাক অর্ডার পাওয়া যায়নি!</h3>
                <p className="text-xs text-zinc-400 mt-2 max-w-xs mx-auto leading-relaxed">
                  আপনার বর্তমান ইমেইল ({userProfile.email || 'নাই'}) অথবা ফোন ({userProfile.phone}) নম্বরের অধীনে বুনন শপে এখনো কোনো অর্ডারের রেকর্ড যুক্ত হয়নি। অনুগ্রহ করে একটি নতুন পোশাক কিনে অর্ডারটি সম্পন্ন করুন।
                </p>
                
                <button
                  onClick={onGoBack}
                  className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-zinc-950 text-white font-black text-xs uppercase tracking-widest rounded-full shadow-lg transition-all active:scale-95 cursor-pointer hover:bg-amber-500 hover:text-zinc-950"
                >
                  স্টোর ব্রাউজ করুন
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Render user profile specific matched orders list */
              <div className="space-y-6">
                {filteredOrders.map((order) => (
                  <div 
                    key={order.id} 
                    className="bg-white rounded-3xl border border-zinc-200 shadow-xs hover:border-zinc-300 transition-all p-5 sm:p-6"
                    id={`order-log-${order.id}`}
                  >
                    {/* Order Status bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-100 pb-4 mb-4 gap-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xs font-black text-zinc-950 border-r border-zinc-200 pr-3 font-mono leading-none">
                          অর্ডার ID: #{order.id}
                        </span>
                        
                        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-bold leading-none">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{order.date}</span>
                        </div>
                      </div>

                      {/* Status indicator colors inside panel */}
                      <div className="flex items-center gap-2">
                        {order.status === 'Pending' ? (
                          <span className="text-[10px] uppercase font-black tracking-widest px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1 leading-none">
                            <Package className="w-3.5 h-3.5 animate-pulse text-amber-500" />
                            প্রক্রিয়াধীন (Pending)
                          </span>
                        ) : order.status === 'Shipped' ? (
                          <span className="text-[10px] uppercase font-black tracking-widest px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1 leading-none">
                            <Truck className="w-3.5 h-3.5 animate-bounce text-blue-500" />
                            অন হ্যান্ড ডেলিভারি (Shipped)
                          </span>
                        ) : order.status === 'Cancelled' ? (
                          <span className="text-[10px] uppercase font-black tracking-widest px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1 leading-none">
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                            বাতিল (Cancelled)
                          </span>
                        ) : (
                          <span className="text-[10px] uppercase font-black tracking-widest px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 leading-none">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                            সম্পন্ন (Delivered)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Detailed Columns */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      
                      {/* Products bought list */}
                      <div className="lg:col-span-8 space-y-3">
                        <span className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-wider block">ক্রয়কৃত পোশাক আইটেম:</span>
                        
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div key={item.product.id} className="flex gap-3 justify-between items-center text-xs bg-zinc-50 border border-zinc-150 p-3 rounded-2xl">
                              <div className="flex gap-3 items-center min-w-0">
                                <img 
                                  src={item.product.imageUrl} 
                                  alt={item.product.name} 
                                  className="w-11 h-11 object-cover rounded-xl border border-zinc-200 shrink-0"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="min-w-0">
                                  <h4 className="font-extrabold text-zinc-900 truncate leading-none mb-1">{item.product.banglaName}</h4>
                                  <span className="text-zinc-450 text-[10px] font-bold block">৳{item.product.price} x {item.quantity}</span>
                                </div>
                              </div>
                              <span className="font-black text-zinc-950 shrink-0">৳{item.product.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Info & Bills */}
                      <div className="lg:col-span-4 bg-zinc-50 border border-zinc-150 rounded-2xl p-4.5 space-y-4 text-xs font-medium text-zinc-650">
                        <div className="space-y-2">
                          <div>
                            <span className="text-[9px] text-zinc-400 uppercase font-black block">ডেলিভারি গন্তব্য:</span>
                            <span className="font-extrabold text-zinc-900 mt-0.5 block">{order.shippingInfo.address}, {order.shippingInfo.city === 'dhaka' ? 'ঢাকা সিটি' : 'ঢাকার বাইরে'}</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-[11px] pt-1">
                            <span className="text-zinc-400 font-bold">পেমেন্ট মেথড:</span>
                            <span className="font-extrabold text-amber-700 bg-amber-500/10 px-2 py-0.5 rounded uppercase">{order.paymentMethod}</span>
                          </div>
                        </div>

                        <div className="border-t border-zinc-200/80 pt-3 flex justify-between items-center text-sm">
                          <span className="font-black text-zinc-900">সর্বমোট পরিশোধ বিল:</span>
                          <span className="text-base font-black text-zinc-950 font-sans">৳{order.totalPrice}</span>
                        </div>

                        {order.status === 'Pending' && (
                          <button
                            onClick={() => triggerConfirm(
                              'অর্ডারটি বাতিল করুন',
                              'আপনি কি নিশ্চিত যে আপনার এই সক্রিয় অর্ডারটি বাতিল করতে চান? এটি বাতিল করলে পোশাকের স্টক আবার স্টোরে ফিরিয়ে দেওয়া হবে।',
                              () => onCancelOrder(order.id)
                            )}
                            className="w-full mt-2 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold text-[10px] border border-rose-150 transition-all cursor-pointer flex items-center justify-center gap-1"
                          >
                            <ShieldAlert className="w-3.5 h-3.5" />
                            অর্ডার বাতিল করুন
                          </button>
                        )}
                      </div>

                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* CONFIRMATION DIALOG MODAL */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-zinc-200 w-full max-w-sm rounded-[24px] p-6 shadow-2xl space-y-4 text-left font-sans animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-zinc-950 pb-2 border-b border-zinc-150">
              <span className="text-lg">⚠️</span>
              <h3 className="font-extrabold text-xs tracking-tight text-zinc-900">{confirmModal.title}</h3>
            </div>
            <p className="text-xs text-zinc-550 font-bold leading-relaxed">
              {confirmModal.message}
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 rounded-xl text-[10px] font-black text-zinc-700 transition-colors cursor-pointer"
              >
                বাতিল
              </button>
              <button
                onClick={confirmModal.onConfirm}
                className="px-4.5 py-2 bg-rose-600 hover:bg-rose-700 rounded-xl text-[10px] font-black text-white transition-colors cursor-pointer"
              >
                হ্যাঁ, নিশ্চিত
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
