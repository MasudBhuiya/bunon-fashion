/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Category, Review, BrandUpdate } from './types';

export const CATEGORIES: Category[] = [
  {
    id: 'all',
    name: 'All',
    banglaName: 'সব কালেকশন',
    icon: 'LayoutGrid',
    bgColor: 'bg-zinc-100',
    textColor: 'text-zinc-600',
  },
  {
    id: 'classic',
    name: 'Classic Tees',
    banglaName: 'ক্লাসিক টি-শার্টস',
    icon: 'Shirt',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
  },
  {
    id: 'oversized',
    name: 'Oversized Tees',
    banglaName: 'ওভারসাইজড কুল টিজ',
    icon: 'Sparkles',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
  },
  {
    id: 'polo',
    name: 'Premium Polo',
    banglaName: 'প্রিমিয়াম পোলো শার্ট',
    icon: 'Smartphone', // We'll map this to a custom collar icon or standard shirt in rendering
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-700',
  },
  {
    id: 'jersey',
    name: 'Athletic Jersey',
    banglaName: 'এলিট স্পোর্টস জার্সি',
    icon: 'Leaf',
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-700',
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'b1',
    name: 'Minimalists Carbon Black Crewneck',
    banglaName: 'মিনিমালিস্ট কার্বন ব্ল্যাক ক্রু-নেক টি-শার্ট',
    description: '১০০% কম্বড কটন ২৪০ জিএসএম (GSM) হেভিওয়েট কাপড়ে তৈরি এই ব্ল্যাক টি-শার্টটি ব্রিদেবল এবং অত্যন্ত আরামদায়ক। এর ডাবল-স্টিচড কলার এবং কালার ফাস্টনেস গ্যারান্টি আপনাকে দেবে দীর্ঘস্থায়ী ক্লাসিক ফিলিং।',
    price: 490,
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600',
    category: 'classic',
    categoryBangla: 'ক্লাসিক টি-শার্টস',
    rating: 4.9,
    reviewsCount: 142,
    stock: 28,
    isFeatured: true,
    features: [
      '১০০% প্রি-শ্রাঙ্ক কম্বড কটন শার্ট বডি',
      '২৪০ জিএসএম প্রিমিয়াম হেভিওয়েট কটন ফ্যাব্রিকস',
      'ম্যাচিং রিবড রাউন্ড কলার এবং আরামদায়ক নেক ব্যান্ড',
      'অত্যন্ত দীর্ঘস্থায়ী ডাবল-সুইং থ্রেড ফিনিশিং',
      'অর্গানিক কালার ডাই যা শত ধোয়াতেও নষ্ট হবে না'
    ]
  },
  {
    id: 'b2',
    name: 'Premium Ivory White Polo Shirt',
    banglaName: 'প্রিমিয়াম আইভরি হোয়াইট কলার পোলো',
    description: 'রয়াল ফিট ডিজাইনের এই আইভরি কটন পোলো শার্টটিতে রয়েছে অত্যন্ত সফট পিক কটন টেক্সচার। কর্পোরেট মিটিং অথবা ক্যাজুয়াল আউটিং সবখানেই এটি আপনাকে দেবে আভিজাত্যের স্পর্শ।',
    price: 850,
    imageUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=600',
    category: 'polo',
    categoryBangla: 'প্রিমিয়াম পোলো শার্ট',
    rating: 4.8,
    reviewsCount: 96,
    stock: 14,
    isFeatured: true,
    features: [
      '১০০% পিউর পিক কটন ডাবল লাকোস্ট নিট',
      'স্থায়ী এবং টেকসই কলার ফিটিংস প্রযুক্তি',
      'ক্লাসিক ২-বাটন স্লিক প্লাকেট এবং এমবস্ড লোগো',
      'অত্যন্ত ব্রিদেবল এবং ঘাম শোষণ ক্ষমতা সম্পন্ন',
      'কালার এবং ফিটিং গ্যারান্টি আজীবন'
    ]
  },
  {
    id: 'b3',
    name: 'Sage Green Oversized Drop-Shoulder Tee',
    banglaName: 'সেজ গ্রিন ওভারসাইজড ড্রপ-শোল্ডার টিজ',
    description: 'আধুনিক স্ট্রিটওয়্যার ট্রেন্ডের সাথে মানানসই আল্ট্রা-কম্প্যাক্ট সেজ গ্রিন ওভারসাইজড টি-শার্ট। এর ২৬০ জিএসএম থিক ফ্যাব্রিক এবং রিল্যাক্সড কাটটি আপনাকে দেবে অনবদ্য লেভেল-আপ স্টাইল।',
    price: 590,
    imageUrl: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=600',
    category: 'oversized',
    categoryBangla: 'ওভারসাইজড কুল টিজ',
    rating: 4.7,
    reviewsCount: 185,
    stock: 22,
    isFeatured: true,
    features: [
      '২৬০ জিএসএম সুপার-কম্প্যাক্ট অর্গানিক সুতা',
      'রিল্যাক্সড ড্রপ শোল্ডার কাট এবং অতিরিক্ত উইডথ',
      'রিংক-ফ্রি ইজি-কেয়ার কটন ব্লেন্ড ফ্যাব্রিক',
      'অত্যন্ত গর্জিয়াস ও মিনিমালিস্ট ড্রেইপ ফিল',
      'ট্রেন্ডি নুড কালার ভাইবস'
    ]
  },
  {
    id: 'b4',
    name: 'Retro Crimson Maroon Polo Shirt',
    banglaName: 'রেট্রো ক্রিমসন মেরুন পোলো শার্ট',
    description: 'একটি রেট্রো কালেকশন যা ডিজাইন করা হয়েছে স্টাইলের সাথে রিল্যাক্সেশন প্রদানের জন্য। ক্লাসিক মেরুন বেসমেন্টে বর্ডার স্ট্রাইপড কলার ডিজাইনে একটি মার্জিত লুক দেয়।',
    price: 890,
    imageUrl: 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?q=80&w=600',
    category: 'polo',
    categoryBangla: 'প্রিমিয়াম পোলো শার্ট',
    rating: 4.9,
    reviewsCount: 74,
    stock: 12,
    isFeatured: true,
    features: [
      'প্রিমিয়াম সুপিমা কটন নিটেড লাকোস্ট প্যাটার্ন',
      'ডাবল রিইনফোর্সড কালার ট্রিটেড কলার',
      'রিং স্পান লাস্টার ফিনিশিং ফেইড প্রোটেকশন সহ',
      'সহজ ড্রাই-ক্লিন ও রোদ-প্রতিরোধী ফ্যাব্রিক',
      'হাতা এবং কাফ লাইনে গর্জিয়াস টিয়া স্ট্রাইপস'
    ]
  },
  {
    id: 'b5',
    name: 'Neon Horizon Athletic Quick-Dry Jersey',
    banglaName: 'নিওন হরাইজন অ্যাথলেটিক কুইক-ড্রাই জার্সি',
    description: 'খেলোয়াড় ও ফিটনেস প্রেমীদের জন্য রাজকীয় এয়ার-ফ্লো ড্রাই-ফিট জার্সি। এর ইন্টারলক ওভেন প্যানেল নিশ্চিত করে স্পোর্টিং টাইমে সর্বোচ্চ মাত্রার বাতাস চলাচল এবং স্বস্তির ফিলিং।',
    price: 690,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600',
    category: 'jersey',
    categoryBangla: 'এলিট স্পোর্টস জার্সি',
    rating: 4.6,
    reviewsCount: 52,
    stock: 18,
    isFeatured: false,
    features: [
      '১২০ জিএসএম আল্ট্রা-লাইট মাল্টি-ফিলামেন্ট ড্রাই ফিট',
      'অ্যান্টি-উইকিং ঘাম ও গন্ধ প্রতিরোধী সিলভার আয়ন ফাইবার',
      'স্মুথ ফ্ল্যাটলক স্টিচড সিমস যা বডি স্ক্র্যাচ একদম কমায়',
      'ফোর-ওয়ে সুপার স্ট্রেন্থ স্ট্রেচাবিলিটি',
      'হাই-রেজল্যুশন ফেইডলেস সাবলিমেশন ভাইব্রেন্ট কালার'
    ]
  },
  {
    id: 'b6',
    name: 'Vintage Mustard Graphic T-Shirt',
    banglaName: 'ভিন্টেজ মাস্টার্ড গ্রাফিক্স টি-শার্ট',
    description: 'বুকের ওপর ফুটিয়ে তোলা অনন্য এনভায়রনমেন্টাল মিনিমাল মেসেজ আর্ট প্রিন্ট সহ এই মাস্টার্ড ইয়োলো ক্রু-নেক শার্টটি অত্যন্ত ইউনিক কালার কম্বিনেশন তৈরি করে। ক্যাজুয়াল ডেনিমের সাথে সেরা ম্যাচ।',
    price: 520,
    imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=600',
    category: 'classic',
    categoryBangla: 'ক্লাসিক টি-শার্টস',
    rating: 4.8,
    reviewsCount: 108,
    stock: 35,
    isFeatured: false,
    features: [
      '১০০% কাঁচা অর্গানিক কটন হেভি নিট',
      'নন-টক্সিক ও ইকো-ফ্রেন্ডলি ফ্লেক্সিবল স্ক্রিন প্রিন্ট',
      'রিল্যাক্সড অল-ডে ফিট সাইজিং চার্ট',
      'ইস্ত্রি করার সময়েও প্রিন্টিং লেবেল ড্যামেজ ফ্রি থাকবে',
      'শোল্ডার টু শোল্ডার কলার ট্যাপ ব্যাক সেলাই'
    ]
  },
  {
    id: 'b7',
    name: 'Midnight Black Oversized Anime Graphic Tee',
    banglaName: 'মিডনাইট ব্ল্যাক অ্যানিমে গ্রাফিক্স ওভারসাইজড',
    description: 'তরুণদের পছন্দের চমৎকার জাপানিজ নান্দনিক ফ্যান্টাসি থিম বুকে ও ব্যাক সাইডে এমবস্ড রবার ফ্লেক্সো প্রিন্ট সহ এই ব্ল্যাক ওভারসাইজড টি-শার্টটি যেকোনো পার্টি বা হ্যাংআউটে রাজকীয় লুক দেয়।',
    price: 650,
    imageUrl: 'https://images.unsplash.com/photo-1564859228273-274232fdb516?q=80&w=600',
    category: 'oversized',
    categoryBangla: 'ওভারসাইজড কুল টিজ',
    rating: 4.9,
    reviewsCount: 221,
    stock: 9,
    isFeatured: false,
    features: [
      '২৭০ জিএসএম হেভি কটন প্লাস পলিয়েস্টার মিক্স',
      'পিঠে এবং বুকের উপর চমৎকার হাই-ডেফিনিশন ফ্লেক্সো প্রিন্টিং',
      'ধোয়ার পরেও কোঁচকাবে না, কালার ও ফেব্রিক সম্পূর্ণ প্রি-শ্রাঙ্ক',
      'ট্রেন্ডি স্ট্রিটওয়্যার ড্রপ শোল্ডার লুজ ডিজাইন',
      'লেদার মেটাল ক্যাজুয়াল আউটার কলার লেবেল ট্যাগ'
    ]
  },
  {
    id: 'b8',
    name: 'Stealth Olive Green Premium Polo',
    banglaName: 'স্টিলথ অলিভ গ্রিন প্রিমিয়াম কলার পোলো',
    description: 'মার্জিত টেস্টের জন্য নিখুঁত অল-সিজন প্রিমিয়াম পোলো। এটি ওজনে যেমন হালকা, তেমনি এর ইলাস্টিক হাতার গ্রিপটি আপনার বাইসেপকে একটি চমৎকার রাউন্ডেড অ্যাথলেটিক শেপ দেবে।',
    price: 890,
    imageUrl: 'https://images.unsplash.com/photo-1625910513397-a400c7746b14?q=80&w=600',
    category: 'polo',
    categoryBangla: 'প্রিমিয়াম পোলো শার্ট',
    rating: 4.7,
    reviewsCount: 65,
    stock: 16,
    isFeatured: false,
    features: [
      'রয়াল ফিট পিক লাকোস্টে কটন ব্লেন্ডিং',
      'কালার প্রোটেকটেড অ্যান্টি-সলিং ট্রিমস প্রযুক্তি',
      'সুইডিশ ইলাস্টিক হাতা গ্রিপ ডিজাইন',
      'অত্যন্ত এলিগেন্ট এবং প্রফেশনাল আউটার স্ট্রাইপ কাফ',
      'হাই লাস্টার মাদার-অফ-পার্ল স্লিক বাটনস'
    ]
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'r1',
    productName: 'মিনিমালিস্ট কার্বন ব্ল্যাক ক্রু-নেক টি-শার্ট',
    customerName: 'মাসুদ রানা',
    rating: 5,
    comment: 'The quality of the fabric is incredible at this price pointing. The GSM is really thick and heavy. Best streetwear in Bangladesh!',
    commentBangla: 'কাপড়টা আসলেই অনেক প্রিমিয়াম। ২৪০ জিএসএমের কাপড় বাইরে কিনতে গেলে ৮০০ টাকার ওপরে লাগত। কালার এবং সেলাই একদম পারফেক্ট। বুনন ব্রান্ডের সার্ভিস অসাম!',
    date: '০৪ জুন, ২০২৬',
    isVerifiedPurchase: true
  },
  {
    id: 'r2',
    productName: 'প্রিমিয়াম আইভরি হোয়াইট কলার পোলো',
    customerName: 'আরিফ চৌধুরী',
    rating: 5,
    comment: 'Extremely professional look and Royal fits. Used it for an office gathering and got several compliments.',
    commentBangla: 'পরা মাত্রই একটা রাজকীয় ভাইবস আসে। আইভরি গোল্ড ফিনিশিংটা জোস লেগেছে। হাতার ফিটিংস এবং কাপড় খুবই আরামদায়ক। আরও ২ টা কালার অর্ডার করলাম।',
    date: '০৩ জুন, ২০২৬',
    isVerifiedPurchase: true
  },
  {
    id: 'r3',
    productName: 'সেজ গ্রিন ওভারসাইজড ড্রপ-শোল্ডার টিজ',
    customerName: 'তানজিলা তাসনিম',
    rating: 4,
    comment: 'The drop shoulder cut is perfectly relaxed. Sage green color is extremely eye-soothing.',
    commentBangla: 'আমার ভাইয়ের জন্য গিফট হিসেবে আনিয়েছিলাম, ও খুবই খুশি হয়েছে। কাপড়টা খুব সফট আর রিল্যাক্সড ড্রপ শোল্ডার লুকটি দেখতে দারুণ লাগে। ধন্যবাদ বুনন!',
    date: '২৮ মে, ২০২৬',
    isVerifiedPurchase: true
  },
  {
    id: 'r4',
    productName: 'নিওন হরাইজন অ্যাথলেটিক কুইক-ড্রাই জার্সি',
    customerName: 'সাকিব আল হাসান',
    rating: 5,
    comment: 'Sweat-wicking works like magic! Extremely thin and lightweight, perfect for running.',
    commentBangla: 'ভারী ক্রিকেট প্র্যাকটিসের সময়ে ট্রাই করলাম, বাতাস খুব সুন্দর চলে আর সাথে সাথে ঘাম শুকিয়ে যায়! অ্যাথলেটদের জন্য সেরা চয়েজ। গলার ফিটিংস অ্যান্ড ম্যাটেরিয়াল ১০/১০।',
    date: '২৪ মে, ২০২৬',
    isVerifiedPurchase: true
  }
];

export const INITIAL_UPDATES: BrandUpdate[] = [
  {
    id: 'u1',
    title: 'নতুন সামার ড্রপ ২০২৬ লঞ্চ হলো!',
    excerpt: 'নিয়ে এলাম ২৬০ জিএসএম ড্রপ শোল্ডার এবং সুপিমা কটনের রাজকীয় পোলোর নতুন কালেকশন। আমাদের স্টক সীমিত, আজই আপনার ফেভারিটটি লুফে নিন!',
    content: 'সুপ্রিয় বুনন ফ্যামিলি, আপনাদের দাবির পরিপ্রেক্ষিতে আমরা নিয়ে এসছি আমাদের এই বছরের সবচেয়ে আকর্ষনীয় সামার ড্রপ ২০২৬। সম্পূর্ণ নিজস্ব ডিজাইনার টিম দ্বারা তৈরি আমাদের নতুন ২৬০ জিএসএম ওভারসাইজড অ্যানিমে টিজ এবং ডাবল জেনুইন মার্সারাইজড লাকোস্ট সুতোয় তৈরি চমৎকার সব ওভেন কলার পোলো শার্টস। আপনার মনের মতো কমবোর্ড কালারস এবং ট্রেন্ডি লুকের সঠিক মেলবন্ধন পাবেন এই নতুন শপে। সাইজ চার্ট দেখে অর্ডার করতে আজই আমাদের মেইন পেজে স্ক্রোল করুন।',
    category: 'new-arrival',
    categoryBangla: 'নতুন কালেকশন',
    date: '০৫ জুন, ২০২৬',
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600',
    badge: 'NEW DROP'
  },
  {
    id: 'u2',
    title: 'ঈদ স্পেশাল ফ্ল্যাশ সেল! ২০% ইনস্ট্যান্ট ডিসকাউন্ট প্রো-কোড',
    excerpt: 'বুননের প্রিমিয়াম ড্রেসে ঈদ আভিজাত্য বাড়াতে ব্যবহার করুন কুপন কোড BUNONEED20 আর পান ২০% সরাসরি ডিসকাউন্ট ও ফ্রি ডেলিভারি!',
    content: 'ঈদুল আযহার আনন্দকে স্টাইলিশ ডিজাইনে রাঙাতে বুনন নিয়ে নিয়ে এসেছে বিশাল উৎসব অফার। ১০০০ টাকার ঊর্ধ্বে যেকোনো দুটি কটন বা প্রিমিয়াম পোলো শার্ট কার্টে রেখে চেকআউট পেইজে "BUNONEED20" প্রো-কোডটি ব্যবহার করলেই পাবেন এক ক্লিকে ফ্ল্যাট ২০% ইন্সট্যান্ট ডিসকাউন্ট। সাথে ঢাকা ও সারা বাংলাদেশের যেকোনো প্রান্তে সম্পূর্ণ জিরো শিপিং কস্ট ডেলিভারি সুবিধা। এই অফারটি আগামী ১৫ জুন পর্যন্ত চলবে। লিমিটেড সাইজেস এভেইলেবল!',
    category: 'discount',
    categoryBangla: 'ধামাকা অফার',
    date: '০১ জুন, ২০২৬',
    imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600',
    badge: '20% OFF'
  },
  {
    id: 'u3',
    title: 'সুন্দরবনের খাঁটি কম্বড অর্গানিক কটন ও সেলাই আপগ্রেডস',
    excerpt: 'গ্রাহকদের রিভিউ ও পরামর্শ অনুযায়ী ডাবল সেলাইয়ের সুতো এবং কলারের রিব কাপড়ে আমরা এনেছি দারুণ পরিবর্তন ও কোয়ালিটি ইমপ্রুভমেন্ট।',
    content: 'বুনন সবসময় কাস্টমার সেটিসফ্যাকশনকে সর্বোচ্চ প্রাধান্য দেয়। মে মাসের রিভিউগুলো মনিটর করে আমরা লক্ষ্য করেছি আপনারা কলার রিব টেক্সচার এবং সেলাই আরও নিখুঁত আশা করছিলেন। অত্যন্ত আনন্দের সাথে জানাচ্ছি যে ২ জুন থেকে উৎপাদিত সব পোলো এবং টি-শার্টে ব্যবহার করা হচ্ছে আন্তর্জাতিক কোয়ালিটি ডুরি থ্রেডস এবং ৭-প্লাস পয়েন্ট কলার ফিউজিং ইলাস্টিক, যা ওয়াশিং মেশিনে ৫০টি ওয়াশের পরেও কলার ফ্লাটনেস একদম আসল কালেকশনের মতো প্রিজার্ভ করবে। ভালো জিনিস সবসময়ই উন্নত হচ্ছে আপনাদের ভালোবাসায়!',
    category: 'notice',
    categoryBangla: 'ব্র্যান্ড ঘোষণা',
    date: '২৮ মে, ২০২৬',
    imageUrl: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=600',
    badge: 'QUALITY UPGRADE'
  }
];
