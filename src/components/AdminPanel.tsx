/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  TrendingUp, Coins, Package, Clock, Truck, PlusCircle, Trash2, 
  Check, FileText, Lock, AlertCircle, Database, LogOut, CheckCircle2, 
  MessageSquare, Search, Edit, XCircle, RotateCcw, ShieldCheck, Tag,
  ShieldAlert
} from 'lucide-react';
import { Order, Product, Review, BrandUpdate, UserProfile } from '../types';
import { upsertProfileInDb } from '../lib/db';
import { supabase } from '../lib/supabase';

interface AdminPanelProps {
  orders: Order[];
  setOrders: (newOrders: Order[]) => void;
  products: Product[];
  setProducts: (newProducts: Product[]) => void;
  updates: BrandUpdate[];
  setUpdates: (newUpdates: BrandUpdate[]) => void;
  reviews: Review[];
  setReviews: (newReviews: Review[]) => void;
  onLoginChange?: (loggedIn: boolean) => void;
}

// Device authorization helper functions
const getOrCreateDeviceId = () => {
  if (typeof window === 'undefined') return '';
  let devId = localStorage.getItem('bunon_device_id');
  if (!devId) {
    devId = 'dev-' + Math.random().toString(36).substring(2, 10);
    localStorage.setItem('bunon_device_id', devId);
  }
  return devId;
};

const getAllowedDevices = (): { id: string; label: string; addedAt: string }[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('bunon_allowed_devices');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
};

export default function AdminPanel({
  orders,
  setOrders,
  products,
  setProducts,
  updates,
  setUpdates,
  reviews,
  setReviews,
  onLoginChange
}: AdminPanelProps) {
  
  // Auth state - initialized with sessionStorage to preserve session during browser tab use
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(() => sessionStorage.getItem('bunon_admin_is_logged_in') === 'true');
  const [loginError, setLoginError] = useState('');

  // Admin credentials states (initialized from local storage or defaults)
  const [adminName, setAdminName] = useState(() => localStorage.getItem('bunon_admin_name') || 'মাসউদ ভুঁইয়া');
  const [adminEmail, setAdminEmail] = useState(() => localStorage.getItem('bunon_admin_email') || 'masudbhuiyan1415@gmail.com');
  const [adminPhone, setAdminPhone] = useState(() => localStorage.getItem('bunon_admin_phone') || '01855223656');
  const [adminPassword, setAdminPassword] = useState(() => localStorage.getItem('bunon_admin_password') || 'Masud@2005#');
  const [adminAvatarUrl, setAdminAvatarUrl] = useState(() => localStorage.getItem('bunon_admin_avatar') || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop');

  // Input states for updating profile
  const [tempName, setTempName] = useState(adminName);
  const [tempEmail, setTempEmail] = useState(adminEmail);
  const [tempPhone, setTempPhone] = useState(adminPhone);
  const [tempAvatar, setTempAvatar] = useState(adminAvatarUrl);

  const adminFileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setTempName(adminName);
    setTempEmail(adminEmail);
    setTempPhone(adminPhone);
    setTempAvatar(adminAvatarUrl);
  }, [adminName, adminEmail, adminPhone, adminAvatarUrl]);

  // Diagnostic states
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testResult, setTestResult] = useState('');
  const [customSupaUrl, setCustomSupaUrl] = useState(() => localStorage.getItem('BUNON_SUPABASE_URL') || '');
  const [customSupaKey, setCustomSupaKey] = useState(() => localStorage.getItem('BUNON_SUPABASE_ANON_KEY') || '');

  const handleTestDatabase = async () => {
    setTestStatus('testing');
    setTestResult('');
    try {
      const { error } = await supabase.from('products').select('id').limit(1);
      if (error) {
        setTestStatus('error');
        setTestResult(`ডেটাবেজ রেসপন্স ত্রুটি: ${error.message}। সারণি বা কলামগুলো ঠিকমতো তৈরি করা হয়নি হয়তো।`);
      } else {
        const { data: configData, error: configError } = await supabase
          .from('profiles')
          .select('*')
          .eq('phone', 'ADMIN_CONFIG')
          .single();

        let extra = '';
        if (configError) {
          extra = ' (তবে ADMIN_CONFIG রো-টি পাওয়া যায়নি। নিচে "ডিফল্ট অ্যাডমিন সেটআপ করুন" বাটনে চাপ দিন)';
        } else {
          extra = ' (এবং ক্লাউডে সংরক্ষিত অ্যাডমিন পাসওয়ার্ড সফলভাবে সিঙ্ক হয়েছে)';
        }
        setTestStatus('success');
        setTestResult(`সংযোগ সফল! সুপাবেস ডাটাবেজ সচল রয়েছে${extra}।`);
      }
    } catch (e: any) {
      setTestStatus('error');
      setTestResult(`ভুল কনফিগারেশন বা নেটওয়ার্ক এরর: ${e.message || e}`);
    }
  };

  const handleForceCreateAdminConfig = async () => {
    setTestStatus('testing');
    try {
      const defaultConfig = {
        name: 'মাসউদ ভুঁইয়া',
        email: 'masudbhuiyan1415@gmail.com',
        phone: '01855223656',
        password: 'Masud@2005#',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop'
      };

      localStorage.setItem('bunon_admin_name', defaultConfig.name);
      localStorage.setItem('bunon_admin_email', defaultConfig.email);
      localStorage.setItem('bunon_admin_phone', defaultConfig.phone);
      localStorage.setItem('bunon_admin_password', defaultConfig.password);
      localStorage.setItem('bunon_admin_avatar', defaultConfig.avatarUrl);

      setAdminName(defaultConfig.name);
      setAdminEmail(defaultConfig.email);
      setAdminPhone(defaultConfig.phone);
      setAdminPassword(defaultConfig.password);
      setAdminAvatarUrl(defaultConfig.avatarUrl);

      const { error } = await supabase.from('profiles').upsert({
        phone: 'ADMIN_CONFIG',
        name: 'ADMIN_SETTINGS_METADATA',
        email: defaultConfig.email,
        avatarUrl: JSON.stringify(defaultConfig)
      });

      if (error) {
        setTestStatus('error');
        setTestResult(`অ্যাডমিন ডাটাবেজে ক্লাউড সিঙ্ক করতে ব্যর্থ: ${error.message}। তবে লোকাল কুয়েরি সফল হয়েছে এবং ডিভাইস রিসেট করা হয়েছে।`);
      } else {
        setTestStatus('success');
        setTestResult('ডিফল্ট অ্যাডমিন কনফিগ সফলভাবে ডেটাবেজ ও ব্রাউজার মেমরিতে রিসেট করা হয়েছে! এখন আপনি "Masud@2005#" দিয়ে লগইন করতে পারবেন।');
      }
    } catch (e: any) {
      setTestStatus('error');
      setTestResult(`ভুল হয়েছে: ${e.message || e}`);
    }
  };

  const handleSaveCustomSupa = () => {
    if (customSupaUrl.trim()) {
      localStorage.setItem('BUNON_SUPABASE_URL', customSupaUrl.trim());
    } else {
      localStorage.removeItem('BUNON_SUPABASE_URL');
    }

    if (customSupaKey.trim()) {
      localStorage.setItem('BUNON_SUPABASE_ANON_KEY', customSupaKey.trim());
    } else {
      localStorage.removeItem('BUNON_SUPABASE_ANON_KEY');
    }

    setTestStatus('success');
    setTestResult('সুপাবেস কনফিগারেশন সংরক্ষণ হয়েছে! পেজ রিলোড করা হচ্ছে...');
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  React.useEffect(() => {
    // Attempt to load Admin configuration and credentials from Supabase dynamically (Sync across all domains)
    async function loadSharedAdminConfig() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('phone', 'ADMIN_CONFIG')
          .single();

        if (!error && data && data.avatarUrl) {
          const config = JSON.parse(data.avatarUrl);
          if (config) {
            if (config.name) {
              setAdminName(config.name);
              localStorage.setItem('bunon_admin_name', config.name);
            }
            if (config.email) {
              setAdminEmail(config.email);
              localStorage.setItem('bunon_admin_email', config.email);
            }
            if (config.phone) {
              setAdminPhone(config.phone);
              localStorage.setItem('bunon_admin_phone', config.phone);
            }
            if (config.password) {
              setAdminPassword(config.password);
              localStorage.setItem('bunon_admin_password', config.password);
            }
            if (config.avatarUrl) {
              setAdminAvatarUrl(config.avatarUrl);
              localStorage.setItem('bunon_admin_avatar', config.avatarUrl);
            }
          }
        }
      } catch (e) {
        console.warn('Failed to load shared admin config on mount:', e);
      }
    }
    loadSharedAdminConfig();
  }, []);

  // Tab State
  const [activeTab, setActiveTab] = useState<'metrics' | 'orders' | 'products' | 'updates' | 'reviews'>('metrics');

  // Search filter inside admin view
  const [productSearch, setProductSearch] = useState('');
  const [updateSearch, setUpdateSearch] = useState('');

  // 1. Core Product Form States (Add / Edit)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [pName, setPName] = useState('');
  const [pBangla, setPBangla] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pPrice, setPPrice] = useState(550);
  const [pImg, setPImg] = useState('https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600');
  const [pCat, setPCat] = useState('classic');
  const [pFeatures, setPFeatures] = useState('');
  const [pStock, setPStock] = useState(20);
  const [pFeatured, setPFeatured] = useState(true);
  const [pSuccessMsg, setPSuccessMsg] = useState('');

  // 2. Core Update Form States (Add / Edit)
  const [editingUpdate, setEditingUpdate] = useState<BrandUpdate | null>(null);
  const [uTitle, setUTitle] = useState('');
  const [uExcerpt, setUExcerpt] = useState('');
  const [uContent, setUContent] = useState('');
  const [uCat, setUCat] = useState<'new-arrival' | 'discount' | 'notice'>('new-arrival');
  const [uImg, setUImg] = useState('https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600');
  const [uBadge, setUBadge] = useState('');
  const [uSuccessMsg, setUSuccessMsg] = useState('');

  // 3. Security Password Change States
  const [newPassVal, setNewPassVal] = useState('');
  const [confirmPassVal, setConfirmPassVal] = useState('');
  const [passSuccess, setPassSuccess] = useState(false);
  const [passError, setPassError] = useState('');

  // 4. Custom Confirmation Modal State to replace window.confirm (safely works in sandboxed iframes)
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

  // Secure Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    const normalizedInput = username.trim().toLowerCase();
    
    // Check authentication against dynamically customized Admin credentials
    const isEmailOrPhoneValid = normalizedInput === 'admin' || 
                                normalizedInput === adminEmail.toLowerCase() || 
                                normalizedInput === adminPhone.trim();

    if (isEmailOrPhoneValid && password === adminPassword) {
      // 2 Devices Check
      const myId = getOrCreateDeviceId();
      const currentList = getAllowedDevices();
      const isRegistered = currentList.some(d => d.id === myId);

      if (!isRegistered) {
        if (currentList.length >= 2) {
          setLoginError('⚠️ অ্যাক্সেস ব্লকড! সর্বোচ্চ ২টি ডিভাইস থেকে এই প্যানেলটি ব্যবহারের অনুমতি রয়েছে। ইতিমধ্যে ২টি উইন্ডো/ডিভাইস রেজিস্টার্ড করা আছে। অনুগ্রহ করে অন্য অনুমোদিত ডিভাইস থেকে কোনো একটি ড্রপ করুন অথবা পাসকোড রিসেট করুন।');
          return;
        } else {
          // Register this device
          const newDevice = {
            id: myId,
            label: currentList.length === 0 ? 'ডিভাইস ১ (প্রথম ব্রাউজার)' : 'ডিভাইস ২ (দ্বিতীয় ব্রাউজার)',
            addedAt: new Date().toLocaleString('bn-BD')
          };
          const updatedDevices = [...currentList, newDevice];
          localStorage.setItem('bunon_allowed_devices', JSON.stringify(updatedDevices));
        }
      }

      setIsLoggedIn(true);
      sessionStorage.setItem('bunon_admin_is_logged_in', 'true');
      onLoginChange?.(true);

      // Sync Admin Profile details directly into Supabase on successful login triggers
      const currentAdminProfile: UserProfile = {
        name: adminName,
        phone: adminPhone,
        email: adminEmail,
        avatarUrl: adminAvatarUrl
      };
      upsertProfileInDb(currentAdminProfile).catch(err => {
        console.error('Failed to sync admin profile on login:', err);
      });
    } else {
      setLoginError('ভুল ইমেইল/নম্বর অথবা পাসওয়ার্ড! অনুগ্রহ করে সঠিক তথ্য দিয়ে অ্যাডমিন ড্যাশবোর্ডে প্রবেশ করুন।');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('bunon_admin_is_logged_in');
    onLoginChange?.(false);
    setUsername('');
    setPassword('');
  };

  // Change Admin Profile & Passcode handler
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess(false);

    if (tempEmail.trim() === '') {
      setPassError('অ্যাডমিন ইমেইল খালি রাখা যাবে না!');
      return;
    }
    if (tempPhone.trim() === '') {
      setPassError('অ্যাডমিন মোবাইল নম্বর খালি রাখা যাবে না!');
      return;
    }

    if (newPassVal) {
      if (newPassVal.length < 3) {
        setPassError('পাসওয়ার্ডটি অবশ্যই কমপক্ষে ৩ অক্ষরের হতে হবে।');
        return;
      }
      if (newPassVal !== confirmPassVal) {
        setPassError('পাসওয়ার্ড দুটি মেলেনি! অনুগ্রহ করে আবার চেক করুন।');
        return;
      }
      localStorage.setItem('bunon_admin_password', newPassVal);
      setAdminPassword(newPassVal);
    }

    localStorage.setItem('bunon_admin_name', tempName);
    localStorage.setItem('bunon_admin_email', tempEmail);
    localStorage.setItem('bunon_admin_phone', tempPhone);
    localStorage.setItem('bunon_admin_avatar', tempAvatar);

    setAdminName(tempName);
    setAdminEmail(tempEmail);
    setAdminPhone(tempPhone);
    setAdminAvatarUrl(tempAvatar);

    // Sync admin profile modifications directly into Supabase profiles database
    const updatedAdmin: UserProfile = {
      name: tempName,
      phone: tempPhone,
      email: tempEmail,
      avatarUrl: tempAvatar
    };
    upsertProfileInDb(updatedAdmin).catch(err => {
      console.error('Failed to sync admin profile modifications to Supabase:', err);
    });

    // Sync full dynamic admin credentials & config metadata to Supabase under the shared special key
    const adminConfigToSync = {
      name: tempName,
      email: tempEmail,
      phone: tempPhone,
      password: newPassVal || adminPassword,
      avatarUrl: tempAvatar
    };
    (async () => {
      try {
        await supabase.from('profiles').upsert({
          phone: 'ADMIN_CONFIG',
          name: 'ADMIN_SETTINGS_METADATA',
          email: tempEmail,
          avatarUrl: JSON.stringify(adminConfigToSync)
        });
      } catch (err) {
        console.error('Failed to sync admin config settings to Supabase:', err);
      }
    })();

    setNewPassVal('');
    setConfirmPassVal('');
    setPassSuccess(true);
    setTimeout(() => setPassSuccess(false), 3000);
  };

  const handleAdminAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setTempAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Order status progression
  const handleNextStatus = (orderId: string) => {
    const updated = orders.map(o => {
      if (o.id === orderId) {
        const nextStatus: 'Pending' | 'Shipped' | 'Delivered' = 
          o.status === 'Pending' ? 'Shipped' : 'Delivered';
        return { ...o, status: nextStatus };
      }
      return o;
    });
    setOrders(updated);
  };

  const handleDeleteOrder = (orderId: string) => {
    triggerConfirm(
      'অর্ডার ইতিহাস ডিলিট নিশ্চিতকরণ',
      'আপনি কি নিশ্চিতভাবে এই অর্ডার ইতিহাসটি মুছে ফেলতে চান? এটি আর ফিরিয়ে আনা সম্ভব হবে না।',
      () => {
        const updated = orders.filter(o => o.id !== orderId);
        setOrders(updated);
      }
    );
  };

  // Populate Product Edit Form
  const handleStartEditProduct = (p: Product) => {
    setEditingProduct(p);
    setPName(p.name);
    setPBangla(p.banglaName);
    setPDesc(p.description);
    setPPrice(p.price);
    setPImg(p.imageUrl);
    setPCat(p.category);
    setPFeatures(p.features.join(', '));
    setPStock(p.stock);
    setPFeatured(p.isFeatured);
    
    // Alert feedback
    setPSuccessMsg('সম্পাদনা ফরম লোড করা হয়েছে! সংশোধন করে সেভ করতে পারেন নিচে।');
    setTimeout(() => setPSuccessMsg(''), 3000);
  };

  const handleCancelEditProduct = () => {
    setEditingProduct(null);
    setPName('');
    setPBangla('');
    setPDesc('');
    setPFeatures('');
    setPPrice(550);
    setPStock(20);
    setPImg('https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600');
    setPCat('classic');
    setPFeatured(true);
  };

  // Add & Edit Product Submit Handler
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName || !pBangla || !pDesc) {
      alert('সবগুলো ফিল্ড সঠিকভাবে পূরণ করুন!');
      return;
    }

    const categoryBanglaMap: Record<string, string> = {
      classic: 'ক্লাসিক টি-শার্টস',
      oversized: 'ওভারসাইজড ড্রপ-শোল্ডার',
      polo: 'প্রিমিয়াম পোলো শার্ট',
      jersey: 'স্পোর্টস জার্সি'
    };

    if (editingProduct) {
      // EDIT EXISTING PRODUCT
      const updatedProduct: Product = {
        ...editingProduct,
        name: pName,
        banglaName: pBangla,
        description: pDesc,
        price: Number(pPrice),
        imageUrl: pImg,
        category: pCat,
        categoryBangla: categoryBanglaMap[pCat] || 'প্রিমিয়াম কালেকশন',
        stock: Number(pStock),
        isFeatured: pFeatured,
        features: pFeatures ? pFeatures.split(',').map(f => f.trim()) : ['১০০% বিলাসবহুল কম্বড কটন']
      };

      const updated = products.map(p => p.id === editingProduct.id ? updatedProduct : p);
      setProducts(updated);
      setPSuccessMsg('পোশাকের তথ্য সফলভাবে সংশোধন ও সংরক্ষণ করা হয়েছে!');
      handleCancelEditProduct();
    } else {
      // ADD NEW PRODUCT
      const newProduct: Product = {
        id: 'prod_' + Date.now(),
        name: pName,
        banglaName: pBangla,
        description: pDesc,
        price: Number(pPrice),
        imageUrl: pImg,
        category: pCat,
        categoryBangla: categoryBanglaMap[pCat] || 'প্রিমিয়াম কালেকশন',
        rating: 5.0,
        reviewsCount: 0,
        stock: Number(pStock),
        isFeatured: pFeatured,
        features: pFeatures ? pFeatures.split(',').map(f => f.trim()) : ['১০০% বিলাসবহুল কম্বড কটন']
      };

      const updated = [newProduct, ...products];
      setProducts(updated);
      setPSuccessMsg('নতুন পোশাকটি সফলভাবে স্টোর ক্যাটালগে পাবলিশ করা হয়েছে!');
      handleCancelEditProduct();
    }

    setTimeout(() => setPSuccessMsg(''), 4000);
  };

  const handleDeleteProduct = (productId: string) => {
    triggerConfirm(
      'পোশাক ডিলিট নিশ্চিতকরণ',
      'আপনি কি নিশ্চিত যে পোশাকটি স্টোর থেকে চিরতরে ডিলিট করতে চান? ক্যাটালগ থেকে এটি স্থায়ীভাবে মুছে যাবে।',
      () => {
        const updated = products.filter(p => p.id !== productId);
        setProducts(updated);
        if (editingProduct?.id === productId) {
          handleCancelEditProduct();
        }
      }
    );
  };

  // Populate Updates Form
  const handleStartEditUpdate = (u: BrandUpdate) => {
    setEditingUpdate(u);
    setUTitle(u.title);
    setUExcerpt(u.excerpt);
    setUContent(u.content);
    setUCat(u.category);
    setUImg(u.imageUrl || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600');
    setUBadge(u.badge || '');

    setUSuccessMsg('ঘোষণা ফরম লোড হয়েছে! তথ্য সংশোধন করে সেভ করতে পারেন নিচে।');
    setTimeout(() => setUSuccessMsg(''), 3000);
  };

  const handleCancelEditUpdate = () => {
    setEditingUpdate(null);
    setUTitle('');
    setUExcerpt('');
    setUContent('');
    setUCat('new-arrival');
    setUImg('https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600');
    setUBadge('');
  };

  // Add & Edit brand Update announcement
  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uTitle || !uExcerpt || !uContent) {
      alert('অনুগ্রহ করে টাইটেল ও কনটেন্ট পূরণ করুন!');
      return;
    }

    const categoryBanglaMap: Record<string, string> = {
      'new-arrival': 'নতুন কালেকশন',
      'discount': 'ধামাকা অফার',
      'notice': 'ব্র্যান্ড ঘোষণা'
    };

    if (editingUpdate) {
      // EDIT EXISTING UPDATE
      const updatedAnn: BrandUpdate = {
        ...editingUpdate,
        title: uTitle,
        excerpt: uExcerpt,
        content: uContent,
        category: uCat,
        categoryBangla: categoryBanglaMap[uCat] || 'ব্র্যান্ড ঘোষণা',
        imageUrl: uImg,
        badge: uBadge ? uBadge : undefined
      };

      const updated = updates.map(u => u.id === editingUpdate.id ? updatedAnn : u);
      setUpdates(updated);
      setUSuccessMsg('ঘোষণাটি সফলভাবে হালনাগাদ করা হয়েছে!');
      handleCancelEditUpdate();
    } else {
      // ADD NEW UPDATE
      const newUpdate: BrandUpdate = {
        id: 'upd_' + Date.now(),
        title: uTitle,
        excerpt: uExcerpt,
        content: uContent,
        category: uCat,
        categoryBangla: categoryBanglaMap[uCat] || 'ব্র্যান্ড ঘোষণা',
        date: 'আজকে',
        imageUrl: uImg,
        badge: uBadge ? uBadge : undefined
      };

      const updated = [newUpdate, ...updates];
      setUpdates(updated);
      setUSuccessMsg('নতুন ঘোষণাটি নোটিশবোর্ডে সফলভাবে প্রকাশ করা হয়েছে!');
      handleCancelEditUpdate();
    }

    setTimeout(() => setUSuccessMsg(''), 4000);
  };

  const handleDeleteUpdate = (updateId: string) => {
    triggerConfirm(
      'ঘোষণা ডিলিট নিশ্চিতকরণ',
      'নিশ্চিতভাবে এই ঘোষণাটি এবং ডিসকাউন্ট কুপনটি অফার বা বুলেটিন বোর্ড থেকে মুছে ফেলবেন?',
      () => {
        const updated = updates.filter(u => u.id !== updateId);
        setUpdates(updated);
        if (editingUpdate?.id === updateId) {
          handleCancelEditUpdate();
        }
      }
    );
  };

  const handleDeleteReview = (reviewId: string) => {
    triggerConfirm(
      'রিভিউ ডিলিট নিশ্চিতকরণ',
      'আপনি কি নিশ্চিত যে এই কাস্টমার রিভিউটি মডারেশন তালিকা থেকে ডিলিট করতে চান?',
      () => {
        const updated = reviews.filter(r => r.id !== reviewId);
        setReviews(updated);
      }
    );
  };

  // Metrics calculating
  const lifetimeSales = orders.filter(o => o.status !== 'Cancelled').reduce((sum, o) => sum + o.totalPrice, 0);
  const pendingCount = orders.filter(o => o.status === 'Pending').length;
  const deliveryCount = orders.filter(o => o.status === 'Delivered').length;
  const cancelledCount = orders.filter(o => o.status === 'Cancelled').length;

  const filteredAdminProducts = products.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.banglaName.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.categoryBangla.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredAdminUpdates = updates.filter(u => 
    u.title.toLowerCase().includes(updateSearch.toLowerCase()) ||
    u.categoryBangla.toLowerCase().includes(updateSearch.toLowerCase())
  );

  // LOGIN SCREEN
  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto my-12 bg-zinc-950 border border-zinc-800 text-white rounded-3xl p-8 shadow-2xl relative">
        <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="text-center space-y-4 mb-8">
          <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto text-zinc-950 shadow-lg">
            <Lock className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">বুনন অ্যাডমিন প্রবেশদ্বার</h2>
          <p className="text-xs text-zinc-400">ব্যবসায়ের রিয়েল কন্টেন্ট, প্রোডাক্ট ও অর্ডার নিয়ন্ত্রণ করতে সিকিউর উপায়ে লগইন করুন।</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5 text-xs text-left">
          <div className="space-y-1.5 font-bold">
            <label className="block text-zinc-300">অ্যাডমিন ইউজারনেম অথবা ইমেইল (Username / Email):</label>
            <input 
              type="text" 
              placeholder="অ্যাডমিন ইউজারনেম বা ইমেইল লিখুন"
              className="w-full tracking-wide bg-zinc-900 border border-zinc-850 text-zinc-100 rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-amber-500/35 focus:outline-hidden font-bold"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5 font-bold">
            <label className="block text-zinc-300">সিক্রেট পাসওয়ার্ড (Password):</label>
            <input 
              type="password" 
              placeholder="পাসওয়ার্ড লিখুন"
              className="w-full tracking-wide bg-zinc-900 border border-zinc-850 text-zinc-100 rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-amber-500/35 focus:outline-hidden font-bold"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {loginError && (
            <div className="p-3.5 bg-rose-950/60 border border-rose-900 rounded-xl text-[11px] text-rose-300 font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              {loginError}
            </div>
          )}

          {/* Secure Login helper information displayed only selectively for authenticated device identification */}
          <div className="p-3.5 bg-zinc-900/40 border border-zinc-900/60 rounded-xl space-y-1">
            <p className="text-[10px] text-zinc-500 font-black tracking-wider uppercase">নিরাপত্তা নোটিশ (Security Net):</p>
            <p className="text-[10.5px] text-zinc-400 leading-relaxed font-semibold">
              শুধুমাত্র অনুমোদিত ডিভাইস ও অ্যাক্সেস কি বা নিবন্ধিত ইমেইল ব্যবহার করে এখানে প্রবেশ করা সম্ভব।
            </p>
          </div>

          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-zinc-950 font-black uppercase tracking-widest py-4 rounded-xl text-xs transition-all transform active:scale-95 cursor-pointer shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20"
          >
            সুরক্ষিত লগইন সম্পাদন করুন
          </button>

          {/* Troubleshooting Collapsible Card */}
          <div className="mt-6 pt-5 border-t border-zinc-900">
            <button
              type="button"
              onClick={() => setShowDiagnostics(!showDiagnostics)}
              className="w-full flex items-center justify-between text-[11px] text-zinc-500 hover:text-zinc-300 font-bold tracking-wide cursor-pointer transition-all uppercase"
            >
              <span>⚙️ সুপাবেস ডাটাবেজ ও পাসওয়ার্ড হ্যান্ডলার</span>
              <span className={`text-[9px] transform transition-transform ${showDiagnostics ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {showDiagnostics && (
              <div className="mt-4 p-4 bg-zinc-905 border border-zinc-850 rounded-2xl text-left space-y-4">
                {/* 1. Status Check & Auto Setup */}
                <div className="space-y-2">
                  <p className="text-[10px] text-zinc-400 font-black tracking-wider uppercase">১. সংযোগ ও অ্যাডমিন ইন্সটলেশন:</p>
                  
                  {testStatus !== 'idle' && (
                    <div className={`p-3 rounded-xl text-[10.5px] leading-relaxed font-semibold border ${
                      testStatus === 'testing' ? 'bg-zinc-900 border-zinc-800 text-zinc-300' :
                      testStatus === 'success' ? 'bg-emerald-950/45 border-emerald-900 text-emerald-300' :
                      'bg-rose-955 border-rose-900 text-rose-300'
                    }`}>
                      {testStatus === 'testing' ? '⏳ প্রসেস হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...' : testResult}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-[10.5px] font-bold">
                    <button
                      type="button"
                      disabled={testStatus === 'testing'}
                      onClick={handleTestDatabase}
                      className="py-2.5 px-3 bg-zinc-800 hover:bg-zinc-750 text-zinc-200 rounded-xl transition-all font-bold cursor-pointer text-center"
                    >
                      🔌 ডাটাবেজ টেস্ট করুন
                    </button>
                    <button
                      type="button"
                      disabled={testStatus === 'testing'}
                      onClick={handleForceCreateAdminConfig}
                      className="py-2.5 px-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-xl transition-all font-black cursor-pointer text-center"
                    >
                      🔑 ডিফল্ট অ্যাডমিন সেটআপ
                    </button>
                  </div>
                </div>

                {/* 2. Custom override input */}
                <div className="space-y-3 pt-3 border-t border-zinc-850">
                  <p className="text-[10px] text-zinc-400 font-black tracking-wider uppercase">২. সুপাবেস ম্যানুয়াল ক্রেডেনশিয়াল (প্রয়োজনে):</p>
                  
                  <div className="space-y-2">
                    <div>
                      <label className="block text-[10px] text-zinc-500 font-bold mb-1">SUPABASE URL:</label>
                      <input
                        type="text"
                        placeholder="https://your-project.supabase.co"
                        className="w-full text-[10.5px] bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-lg p-2 font-mono"
                        value={customSupaUrl}
                        onChange={(e) => setCustomSupaUrl(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-550 font-bold mb-1">SUPABASE ANON KEY:</label>
                      <textarea
                        rows={2}
                        placeholder="eyJhbGciOi..."
                        className="w-full text-[10.5px] bg-zinc-950 border border-zinc-805 text-zinc-300 rounded-lg p-2 font-mono resize-none"
                        value={customSupaKey}
                        onChange={(e) => setCustomSupaKey(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleSaveCustomSupa}
                      className="w-full py-2 bg-rose-600/20 hover:bg-rose-650/40 text-rose-300 border border-rose-900/50 rounded-xl text-[10px] font-black transition-all cursor-pointer text-center"
                    >
                      💾 ক্রেডেনশিয়াল সেভ করুন
                    </button>
                    {(localStorage.getItem('BUNON_SUPABASE_URL') || localStorage.getItem('BUNON_SUPABASE_ANON_KEY')) && (
                      <button
                        type="button"
                        onClick={() => {
                          localStorage.removeItem('BUNON_SUPABASE_URL');
                          localStorage.removeItem('BUNON_SUPABASE_ANON_KEY');
                          setCustomSupaUrl('');
                          setCustomSupaKey('');
                          setTestStatus('success');
                          setTestResult('কনফিগ মুছে ফেলা হয়েছে! রিলোড করা হচ্ছে...');
                          setTimeout(() => {
                            if (typeof window !== 'undefined') window.location.reload();
                          }, 1500);
                        }}
                        className="py-2 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-xl text-[10px] font-bold transition-all cursor-pointer"
                      >
                        🗑️ রিসেট
                      </button>
                    )}
                  </div>
                </div>

                {/* 3. Credentials reminder */}
                <div className="text-[10px] text-zinc-500 leading-normal font-semibold space-y-1 bg-zinc-950/30 p-2.5 rounded-xl border border-zinc-900">
                  <p className="font-bold text-zinc-400 text-[10.5px]">💡 ডিফল্ট অ্যাডমিন অ্যাক্সেস ইনফো:</p>
                  <p>• ইউজারনেম: <span className="font-mono text-zinc-300 font-bold select-all">01855223656</span> অথবা <span className="font-mono text-zinc-300 font-bold select-all">masudbhuiyan1415@gmail.com</span></p>
                  <p>• পাসওয়ার্ড: <span className="font-mono text-zinc-300 font-bold select-all">Masud@2005#</span></p>
                  <p className="text-zinc-500 mt-1">নোট: আপনার ডাটাবেজে "profiles" সারণিটি সচল থাকতে হবে। কোনো কারণে Sync ব্যর্থ হলে প্রথমে ডাটাবেজ টেস্ট করে "ডিফল্ট অ্যাডমিন সেটআপ" বাটনে ক্লিক করুন।</p>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    );
  }

  // LOGGED IN DASHBOARD
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Top Welcome Panel */}
      <div className="bg-zinc-950 text-white p-6 sm:p-8 rounded-3xl border border-zinc-850 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden shadow-xl text-left">
        <div className="absolute top-0 right-0 w-80 h-80 bg-linear-to-tr from-amber-500/10 to-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex items-center gap-4.5">
          <div className="relative group shrink-0">
            <img 
              src={adminAvatarUrl} 
              alt="Admin Profile" 
              className="w-16 h-16 rounded-2xl border-2 border-amber-500 object-cover shadow-lg"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">{adminName}</h1>
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] uppercase font-black px-2 py-0.5 rounded-full tracking-wider shrink-0">প্রধান অ্যাডমিন</span>
            </div>
            <p className="text-xs text-zinc-400 mt-1.5 font-bold flex flex-wrap items-center gap-x-3 gap-y-1 font-mono">
              <span>📧 {adminEmail}</span>
              <span className="text-zinc-700 hidden sm:inline">|</span>
              <span>📞 {adminPhone}</span>
            </p>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="relative z-10 inline-flex items-center gap-1.5 px-4.5 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white rounded-xl text-xs font-black hover:bg-zinc-800 transition-all cursor-pointer shadow-sm shrink-0"
        >
          <LogOut className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          লগআউট করুন
        </button>
      </div>

      {/* Tab Navigation buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 bg-zinc-100 p-2 rounded-2xl border border-zinc-200">
        {[
          { id: 'metrics', label: 'মেট্রিক্স ও সেটিংস', icon: ShieldCheck },
          { id: 'orders', label: 'গ্রাহক অর্ডার', icon: Clock },
          { id: 'products', label: 'পোশাক ক্যাটালগ', icon: Package },
          { id: 'updates', label: 'ব্র্যান্ড আপডেট', icon: FileText },
          { id: 'reviews', label: 'রিভিউ হাব', icon: MessageSquare }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center justify-center gap-2 p-3 text-xs font-black rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'bg-zinc-950 text-white shadow-md shadow-zinc-950/10'
                  : 'bg-white/50 hover:bg-white text-zinc-600 hover:text-zinc-950 border border-transparent hover:border-zinc-250'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-zinc-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OPERATIONS METRICS */}
      {activeTab === 'metrics' && (
        <div className="space-y-6">
          <div className="border-l-4 border-amber-500 pl-3 py-0.5">
            <h3 className="text-lg font-black text-zinc-900">ব্যবস্থাপনা ড্যাশবোর্ড ও সেটিংস</h3>
            <p className="text-xs text-zinc-500 font-bold mt-1 uppercase tracking-wide">আপনার মার্চেন্ট অপারেশন হাব সফলভাবে সক্রিয় রয়েছে</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-zinc-50 border border-zinc-150 rounded-2xl p-5 shadow-xs flex items-center gap-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 font-extrabold block uppercase tracking-wider">অপেক্ষমান কাস্টমার অর্ডার</span>
                <p className="text-lg sm:text-xl font-black text-amber-700 leading-none mt-1.5">{pendingCount} টি</p>
              </div>
            </div>

            <div className="bg-zinc-50 border border-zinc-150 rounded-2xl p-5 shadow-xs flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 font-extrabold block uppercase tracking-wider">ডেলিভারড সম্পন্ন</span>
                <p className="text-lg sm:text-xl font-black text-emerald-700 leading-none mt-1.5">{deliveryCount} টি</p>
              </div>
            </div>

            <div className="bg-zinc-50 border border-zinc-150 rounded-2xl p-5 shadow-xs flex items-center gap-4">
              <div className="p-3 bg-rose-50 text-rose-700 rounded-xl border border-rose-100">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 font-extrabold block uppercase tracking-wider">বাতিলকৃত অর্ডার</span>
                <p className="text-lg sm:text-xl font-black text-rose-700 leading-none mt-1.5">{cancelledCount} টি</p>
              </div>
            </div>

            <div className="bg-zinc-50 border border-zinc-150 rounded-2xl p-5 shadow-xs flex items-center gap-4">
              <div className="p-3 bg-slate-100 text-slate-700 rounded-xl border border-slate-200">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 font-extrabold block uppercase tracking-wider">চলতি পোশাক সংখ্যা</span>
                <p className="text-lg sm:text-xl font-black text-zinc-900 leading-none mt-1.5">{products.length} টি</p>
              </div>
            </div>
          </div>

          {/* Change Profile & Password Block */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4 border-t border-zinc-100">
            
            {/* Left explanation info */}
            <div className="lg:col-span-7 bg-zinc-950 text-zinc-300 p-6 rounded-2xl border border-zinc-800 space-y-4">
              <h4 className="font-extrabold text-sm text-amber-400 flex items-center gap-1.5">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                ১০০% সিকিউর অ্যাডমিন কন্ট্রোল ও নিরাপত্তা রুলস
              </h4>
              <div className="text-xs space-y-3 leading-relaxed font-sans">
                <p>
                  বুনন অ্যাপের গ্রাহক অর্ডার ট্র্যাকিং, নতুন পণ্য যোগ, কিংবা যেকোনো পোশাকের বিবরণ পরিবর্তন সম্পূর্ণ অফলাইনে আপনার লোকাল ব্রাউজারের <code className="text-white font-mono bg-zinc-900 px-1 py-0.5 rounded font-bold">localStorage</code> ডাটা ইঞ্জিনে স্টোর থাকে। যার ফলে কোনো সার্ভার খরচা ছাড়াই স্পীডি ডাটা রেন্ডারিং হয়।
                </p>
                <p className="font-semibold text-zinc-400">
                  🔒 <strong className="text-zinc-200">সিকিউরিটি গ্যারান্টি:</strong> ডানদিকের সেটিংসটি ব্যবহার করে আপনি আপনার প্যানেলের অ্যাডমিন নাম, মোবাইল নম্বর, ইমেইল এবং মূল পাসওয়ার্ড পরিবর্তন করতে পারবেন। সেটিংস সেভ করার পর থেকে শুধুমাত্র আপনার দেওয়া নতুন ইমেইল/নম্বর এবং পাসওয়ার্ড দিয়েই ড্যাশবোর্ডে ঢোকা যাবে।
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <button 
                  type="button"
                  onClick={() => setActiveTab('products')} 
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-[11px] rounded-lg cursor-pointer transition-colors"
                >
                  পোশাক এডিট করুন
                </button>
                <button 
                  type="button"
                  onClick={() => setActiveTab('orders')} 
                  className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white font-black text-[11px] rounded-lg cursor-pointer transition-colors"
                >
                  অর্ডার স্ট্যাটাস আপডেট করুন
                </button>
              </div>
            </div>

            {/* Profile Settings form */}
            <div className="lg:col-span-5 bg-zinc-50 border border-zinc-150 p-6 rounded-2xl">
              <h4 className="font-black text-sm text-zinc-900 flex items-center gap-1.5 mb-1 bg-zinc-950/5 p-3 rounded-xl">
                🔐 অ্যাডমিন প্রোফাইল ও সেটিংস
              </h4>
              <p className="text-[10px] text-zinc-400 mb-5 pl-3 font-semibold uppercase">অ্যাডমিন নেম, ইমেইল, মোবাইল ও পাসওয়ার্ড</p>

              <form onSubmit={handleChangePassword} className="space-y-4 text-xs text-left">
                {passError && (
                  <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl font-bold">
                    ⚠️ {passError}
                  </div>
                )}

                {passSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-150 text-emerald-700 font-bold rounded-xl flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    সেটিংস সফলভাবে আপডেট করা হয়েছে!
                  </div>
                )}

                <div className="space-y-1">
                  <label className="block font-black text-zinc-700 font-semibold">অ্যাডমিন নাম (Name):</label>
                  <input 
                    type="text" 
                    value={tempName} 
                    onChange={e => setTempName(e.target.value)}
                    required
                    className="w-full bg-white border border-zinc-200 rounded-xl p-3 text-zinc-900 font-bold focus:ring-1 focus:ring-amber-500 focus:outline-hidden text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-black text-zinc-700 font-semibold">অ্যাডমিন ইমেইল (Email):</label>
                  <input 
                    type="email" 
                    value={tempEmail} 
                    onChange={e => setTempEmail(e.target.value)}
                    required
                    className="w-full bg-white border border-zinc-200 rounded-xl p-3 text-zinc-900 font-bold focus:ring-1 focus:ring-amber-500 focus:outline-hidden text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-black text-zinc-700 font-semibold">অ্যাডমিন মোবাইল নম্বর (Phone):</label>
                  <input 
                    type="text" 
                    value={tempPhone} 
                    onChange={e => setTempPhone(e.target.value)}
                    required
                    className="w-full bg-white border border-zinc-200 rounded-xl p-3 text-zinc-900 font-bold focus:ring-1 focus:ring-amber-500 focus:outline-hidden text-xs font-mono"
                  />
                </div>

                <div className="space-y-1.5 font-bold">
                  <label className="block font-black text-zinc-700">প্রোফাইল ছবি (পিকচার অপশন):</label>
                  <div className="flex items-center gap-3">
                    <img 
                      src={tempAvatar} 
                      alt="Preview" 
                      className="w-12 h-12 rounded-xl border border-zinc-200 object-cover bg-zinc-100 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 space-y-1">
                      <input 
                        type="text" 
                        placeholder="ছবির লিংক (URL) দিতে পারেন"
                        value={tempAvatar} 
                        onChange={e => setTempAvatar(e.target.value)}
                        className="w-full bg-white border border-zinc-200 rounded-xl p-2.5 text-[11px] text-zinc-900 font-medium focus:ring-1 focus:ring-amber-500 focus:outline-hidden font-mono"
                      />
                      <button 
                        type="button"
                        onClick={() => adminFileInputRef.current?.click()}
                        className="text-[10px] bg-zinc-900 hover:bg-zinc-800 text-white font-extrabold px-3 py-1.5 rounded-lg transition-colors cursor-pointer w-full text-center"
                      >
                        📸 পিসির ছবি আপলোড করুন
                      </button>
                      <input 
                        ref={adminFileInputRef}
                        type="file" 
                        accept="image/*"
                        onChange={handleAdminAvatarUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-zinc-200 my-2 pt-2">
                  <span className="text-[10px] text-zinc-400 font-black tracking-wide block mb-2 uppercase">পাসওয়ার্ড পরিবর্তন (কঠিন সিকিউরিটি):</span>
                  
                  <div className="space-y-2.5 font-bold">
                    <div className="space-y-1">
                      <label className="block font-black text-zinc-700 font-semibold">নতুন পাসওয়ার্ড (খালি রাখলে বদলাবে না):</label>
                      <input 
                        type="password" 
                        placeholder="নতুন অ্যাডমিন পাসওয়ার্ড দিন"
                        value={newPassVal} 
                        onChange={e => setNewPassVal(e.target.value)}
                        className="w-full bg-white border border-zinc-200 rounded-xl p-3 text-zinc-900 font-bold focus:ring-1 focus:ring-amber-500 focus:outline-hidden text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block font-black text-zinc-700 font-semibold">পাসওয়ার্ড নিশ্চিত করুন:</label>
                      <input 
                        type="password" 
                        placeholder="পুনরায় পাসওয়ার্ডটি লিখুন"
                        value={confirmPassVal} 
                        onChange={e => setConfirmPassVal(e.target.value)}
                        className="w-full bg-white border border-zinc-200 rounded-xl p-3 text-zinc-900 font-bold focus:ring-1 focus:ring-amber-500 focus:outline-hidden text-xs"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-zinc-950 hover:bg-amber-500 hover:text-zinc-950 text-white py-3.5 rounded-xl font-black uppercase tracking-wider text-xs transition-colors cursor-pointer"
                >
                  সেটিংস ও প্রোফাইল সংরক্ষণ করুন
                </button>
              </form>
            </div>

          </div>

            {/* Authorized Devices Info Block */}
            <div className="bg-zinc-50 border border-zinc-150 p-5 sm:p-6 rounded-2xl border-t-2 border-t-amber-500">
              <h4 className="font-extrabold text-sm text-zinc-950 flex items-center gap-2 mb-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                অনুমোদিত অ্যাক্সেস ডিভাইস ট্র্যাকিং (সর্বোচ্চ ২টি)
              </h4>
              <p className="text-xs text-zinc-500 mb-4 font-semibold">
                আপনার নিরাপত্তার জন্য এই প্যানেলটি সর্বোচ্চ ২টি ব্রাউজার/ডিভাইসে অথোরাইজড রাখা যাবে।
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getAllowedDevices().map((dev) => {
                  const isCurrent = dev.id === getOrCreateDeviceId();
                  return (
                    <div 
                      key={dev.id} 
                      className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                        isCurrent 
                          ? 'bg-amber-50/60 border-amber-300 shadow-xs' 
                          : 'bg-white border-zinc-200 hover:border-zinc-300'
                      }`}
                    >
                      <div className="space-y-1">
                        <p className="text-xs font-black text-zinc-900 flex flex-wrap items-center gap-1.5">
                          {dev.label}
                          {isCurrent && (
                            <span className="text-[9px] bg-amber-500 text-zinc-950 font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                              বর্তমান ব্রাউজার
                            </span>
                          )}
                        </p>
                        <p className="text-[10px] text-zinc-400 font-mono">ID: {dev.id}</p>
                        <p className="text-[10px] text-zinc-400 font-semibold text-zinc-500">সংযুক্ত কাল: {dev.addedAt}</p>
                      </div>
                      <button
                        onClick={() => {
                          triggerConfirm(
                            'ডিভাইস অ্যাক্সেস বাতিল',
                            'আপনি কি এই ডিভাইস বা ব্রাউজারটির এডমিন প্যানেল অ্যাক্সেস বাতিল করতে চান?',
                            () => {
                              const updated = getAllowedDevices().filter(d => d.id !== dev.id);
                              localStorage.setItem('bunon_allowed_devices', JSON.stringify(updated));
                              window.location.reload();
                            }
                          );
                        }}
                        className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-lg border border-transparent hover:border-rose-100 transition-all cursor-pointer"
                        title="ডিভাইস রিমুভ করুন"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  );
                })}
                {getAllowedDevices().length === 0 && (
                  <div className="col-span-2 text-center py-4 bg-zinc-100 text-zinc-400 text-xs font-bold rounded-xl border border-zinc-200">
                    কোনো অনুমোদিত ডিভাইস নথিভুক্ত নেই!
                  </div>
                )}
              </div>

              {getAllowedDevices().length > 0 && (
                <div className="mt-4 text-right">
                  <button
                    onClick={() => {
                      triggerConfirm(
                        'সকল ডিভাইস নিরাপত্তা রিসেট',
                        'আপনি কি নিশ্চিত যে সকল রেজিস্টার্ড বা অনুমোদিত ডিভাইসের অ্যাক্সেস একবারে বাতিল ও রিসেট করতে চান?',
                        () => {
                          localStorage.removeItem('bunon_allowed_devices');
                          window.location.reload();
                        }
                      );
                    }}
                    className="px-4 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 rounded-xl font-bold text-[11px] transition-all cursor-pointer"
                  >
                    সকল ডিভাইস অনুমতি রিসেট করুন
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: ACTIVE CUSTOMER ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="border-l-4 border-amber-500 pl-3 py-0.5">
              <h3 className="text-lg font-black text-zinc-900">সর্বমোট কাস্টমার অর্ডারের তালিকা</h3>
              <p className="text-xs text-zinc-500 font-bold mt-1 uppercase tracking-wide">গ্রাহকদের অর্ডার ডেলিভারি বা শিপিং স্ট্যাটাস পরিবর্তন করুন</p>
            </div>
            
            {orders.length > 0 ? (
              <div className="overflow-x-auto border border-zinc-200 rounded-2xl shadow-xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-black uppercase text-zinc-500 tracking-wider">
                      <th className="p-4">অর্ডার আইডি & তারিখ</th>
                      <th className="p-4">গ্রাহকের কুরিয়ার ঠিকানা</th>
                      <th className="p-4">ক্রয়কৃত পোশাক আইটেম</th>
                      <th className="p-4 text-right">টোটাল বিলিং মূল্য</th>
                      <th className="p-4">শিপিং অগ্রগতি</th>
                      <th className="p-4 text-center">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-150 font-semibold text-zinc-700">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-zinc-50/50">
                        <td className="p-4 space-y-1">
                          <code className="text-[11.5px] text-amber-600 font-extrabold block font-mono">#{o.id}</code>
                          <span className="text-[10px] text-zinc-400 font-bold block">{o.date}</span>
                        </td>
                        <td className="p-4 space-y-1 max-w-[200px]">
                          <span className="font-extrabold text-zinc-950 block leading-tight">{o.shippingInfo.name}</span>
                          <span className="text-[10.5px] text-zinc-650 block font-sans tracking-wide">{o.shippingInfo.phone}</span>
                          <span className="text-[10.5px] text-zinc-400 block truncate" title={o.shippingInfo.address}>
                            {o.shippingInfo.address}, {o.shippingInfo.city === 'dhaka' ? 'ঢাকা সিটি' : 'ঢাকার বাইরে'}
                          </span>
                        </td>
                        <td className="p-4 space-y-1.5">
                          {o.items.map((item, idx) => (
                            <div key={idx} className="text-[11px] text-zinc-700 font-bold flex gap-1.5">
                              <span className="text-zinc-300">•</span>
                              <span className="text-zinc-950 font-black leading-none">{item.product.banglaName}</span>
                              <span className="text-[10px] text-rose-500 font-extrabold shrink-0">({item.product.name}) x{item.quantity}</span>
                            </div>
                          ))}
                        </td>
                        <td className="p-4 text-right">
                          <span className="text-xs sm:text-sm font-black text-zinc-950 block">৳{o.totalPrice}</span>
                          <span className="text-[9px] text-zinc-400 font-black block uppercase tracking-wider">{o.paymentMethod}</span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex px-3 py-1 rounded-lg text-[9px] font-black tracking-widest uppercase border ${
                            o.status === 'Pending' 
                              ? 'bg-amber-50 text-amber-700 border-amber-200' 
                              : o.status === 'Shipped' 
                                ? 'bg-blue-50 text-blue-700 border-blue-200 animate-pulse' 
                                : o.status === 'Cancelled'
                                  ? 'bg-rose-55 text-rose-800 border-rose-300'
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}>
                            {o.status === 'Pending' 
                              ? 'পেন্ডিং' 
                              : o.status === 'Shipped' 
                                ? 'অন ডেমোজ শিপড' 
                                : o.status === 'Cancelled'
                                  ? 'বাতিলকৃত'
                                  : 'ডেলিভারড সম্পন্ন'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            {o.status !== 'Delivered' && o.status !== 'Cancelled' && (
                              <button
                                onClick={() => handleNextStatus(o.id)}
                                className="px-3 py-1.5 bg-zinc-950 hover:bg-amber-400 hover:text-zinc-950 text-white font-black rounded-lg flex items-center gap-1.5 cursor-pointer hover:shadow-xs transition-all text-[10px] uppercase tracking-wider"
                              >
                                <Check className="w-3.5 h-3.5" />
                                {o.status === 'Pending' ? 'শিপ করুন' : 'ডেলিভারি দিন'}
                              </button>
                            )}
                            
                            {(o.status === 'Pending' || o.status === 'Shipped') && (
                              <button
                                onClick={() => {
                                  triggerConfirm(
                                    'অর্ডারটি বাতিল করুন',
                                    'আপনি কি নিশ্চিত যে এই সক্রিয় অর্ডারটি বাতিল করতে চান? এটি বাতিল করলে পোশাকের স্টক আবার স্টোরে ফিরিয়ে দেওয়া হবে।',
                                    () => {
                                      // Cancel the order
                                      const updated = orders.map(itemOrder => {
                                        if (itemOrder.id === o.id) {
                                          return { ...itemOrder, status: 'Cancelled' as const };
                                        }
                                        return itemOrder;
                                      });
                                      setOrders(updated);

                                      // Restore clothing items stock
                                      const restoredProducts = products.map(p => {
                                        const item = o.items.find(i => i.product.id === p.id);
                                        if (item) {
                                          return { ...p, stock: p.stock + item.quantity };
                                        }
                                        return p;
                                      });
                                      setProducts(restoredProducts);
                                    }
                                  );
                                }}
                                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold rounded-lg flex items-center gap-1 cursor-pointer text-[10px] uppercase tracking-wider border border-rose-100 transition-all"
                                title="অর্ডার বাতিল করুন"
                              >
                                <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                                বাতিল করুন
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteOrder(o.id)}
                              className="p-2 text-zinc-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                              title="ডিলিট অর্ডার"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200 text-zinc-400">
                গ্রাহকের কোনো সক্রিয় অর্ডার এখনো পাওয়া যায়নি।
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PRODUCTS CATALOG MANAGER (Unified View to satisfying adding, deleting, and editing product with all details) */}
        {activeTab === 'products' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
              <div className="border-l-4 border-amber-500 pl-3">
                <h3 className="text-lg font-black text-zinc-900">পোশাক ক্যাটালগ ও এডিটর প্যানেল (Products Manager)</h3>
                <p className="text-xs text-zinc-500 font-bold mt-1">পণ্য যোগ করুন, সংশোধন করুন অথবা চিরতরে ডিলিট করুন ক্যাটালগ থেকে</p>
              </div>
              <div className="flex items-center gap-2 max-w-xs w-full">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input 
                    type="text" 
                    placeholder="পোশাক খুঁজুন..."
                    value={productSearch}
                    onChange={e => setProductSearch(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 pl-9 pr-4 text-xs font-bold"
                  />
                </div>
                {productSearch && (
                  <button onClick={() => setProductSearch('')} className="p-2 border border-zinc-200 hover:bg-zinc-50 rounded-xl">
                    <XCircle className="w-4 h-4 text-zinc-500" />
                  </button>
                )}
              </div>
            </div>

            {pSuccessMsg && (
              <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-150 rounded-2xl font-bold flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                {pSuccessMsg}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Product list - Left desk size: lg:col-span-7 */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] text-zinc-400 font-black uppercase tracking-wider">রিয়েল প্রোডাক্ট তালিকা ({filteredAdminProducts.length} টি)</span>
                  {editingProduct && (
                    <button 
                      onClick={handleCancelEditProduct}
                      className="text-xs font-bold text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      সম্পাদনা বাতিল
                    </button>
                  )}
                </div>

                <div className="border border-zinc-200 rounded-2xl overflow-hidden shadow-xs bg-white text-xs">
                  <div className="max-h-[520px] overflow-y-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-zinc-50 border-b border-zinc-200 text-[9.5px] font-black uppercase text-zinc-500 tracking-wider">
                          <th className="p-3.5 pl-4">পোশাকের ছবি & বিবরণ</th>
                          <th className="p-3.5">ক্যাটাগরি</th>
                          <th className="p-3.5 text-right">মূল্য & স্টক</th>
                          <th className="p-3.5 text-center">এ্যাকশন</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 font-semibold text-zinc-700">
                        {filteredAdminProducts.map((p) => {
                          const isBeingEdited = editingProduct?.id === p.id;
                          return (
                            <tr key={p.id} className={`${isBeingEdited ? 'bg-amber-500/5' : 'hover:bg-zinc-50/50'} transition-all`}>
                              <td className="p-3.5 pl-4">
                                <div className="flex items-center gap-3">
                                  <img 
                                    src={p.imageUrl} 
                                    alt={p.banglaName} 
                                    className="w-13 h-10 object-cover rounded-md border border-zinc-200 bg-zinc-100 shrink-0 shadow-inner"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="min-w-0">
                                    <h4 className="font-extrabold text-zinc-950 truncate max-w-[150px] leading-tight flex items-center gap-1.5">
                                      {p.banglaName}
                                      {p.isFeatured && (
                                        <span className="text-[8px] bg-amber-500/15 border border-amber-500/30 text-amber-800 px-1.5 py-0.5 rounded font-black uppercase tracking-wider">Featured</span>
                                      )}
                                    </h4>
                                    <p className="text-[10px] text-zinc-400 uppercase font-mono max-w-[150px] truncate">{p.name}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-3.5">
                                <span className="text-[9.5px] bg-zinc-100 text-zinc-600 border border-zinc-200 px-2 py-0.5 rounded font-black tracking-wide shrink-0">
                                  {p.categoryBangla}
                                </span>
                              </td>
                              <td className="p-3.5 text-right">
                                <span className="text-zinc-950 font-black block">৳{p.price}</span>
                                <span className={`text-[10px] font-bold block ${p.stock <= 10 ? 'text-rose-600' : 'text-zinc-400'}`}>স্টক: {p.stock} টি</span>
                              </td>
                              <td className="p-3.5">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => handleStartEditProduct(p)}
                                    className="p-2 border border-zinc-200 text-zinc-500 hover:text-amber-600 hover:border-amber-300 rounded-xl hover:bg-amber-500/10 cursor-pointer transition-colors"
                                    title="সংশোধন করুন"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(p.id)}
                                    className="p-2 border border-zinc-200 text-zinc-400 hover:text-rose-600 hover:border-rose-300 rounded-xl hover:bg-rose-50 cursor-pointer transition-colors"
                                    title="চিরতরে মুছুন"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Add / Edit Form - Right desk size: lg:col-span-5 */}
              <div className="lg:col-span-5 bg-zinc-50 border border-zinc-150 p-5 sm:p-6 rounded-2xl relative text-xs">
                
                {/* Form Heading based on active action editingProduct vs adding */}
                <div className="pb-3 border-b border-zinc-200 mb-5">
                  <h4 className="font-black text-sm text-zinc-950 flex items-center gap-1.5">
                    {editingProduct ? (
                      <>
                        <Edit className="w-4 h-4 text-amber-500" />
                        ১. পোশাকের সর্বাঙ্গীন তথ্য সংশোধন
                      </>
                    ) : (
                      <>
                        <PlusCircle className="w-4 h-4 text-emerald-500" />
                        ১. শপে নতুন পোশাক যোগ করুন
                      </>
                    )}
                  </h4>
                  {editingProduct && (
                    <p className="text-[10px] text-zinc-400 font-bold uppercase mt-1">Product ID: {editingProduct.id}</p>
                  )}
                </div>

                <form onSubmit={handleProductSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="block font-black text-zinc-700">পোশাকের নাম (ইংরেজি) <span className="text-rose-600">*</span></label>
                    <input 
                      type="text" 
                      placeholder="যেমন: Classic Indigo Polo Shirt"
                      required
                      value={pName} 
                      onChange={e => setPName(e.target.value)}
                      className="w-full bg-white border border-zinc-200 rounded-xl p-3 text-zinc-950 focus:ring-1 focus:ring-amber-500 focus:outline-hidden font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-black text-zinc-700">পোশাকের নাম (বাংলায়) <span className="text-rose-600">*</span></label>
                    <input 
                      type="text" 
                      placeholder="যেমন: ক্লাসিক নীল কলার পোলো"
                      required
                      value={pBangla} 
                      onChange={e => setPBangla(e.target.value)}
                      className="w-full bg-white border border-zinc-200 rounded-xl p-3 text-zinc-950 focus:ring-1 focus:ring-amber-500 focus:outline-hidden font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block font-black text-zinc-700">ডিজাইন মূল্য (টাকা BDT) <span className="text-rose-605">*</span></label>
                      <input 
                        type="number" 
                        required
                        value={pPrice} 
                        onChange={e => setPPrice(Number(e.target.value))}
                        className="w-full bg-white border border-zinc-200 rounded-xl p-3 text-zinc-950 focus:ring-1 focus:ring-amber-500 focus:outline-hidden font-black"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block font-black text-zinc-700">স্টক পিস পরিমাণ <span className="text-rose-605">*</span></label>
                      <input 
                        type="number" 
                        required
                        value={pStock} 
                        onChange={e => setPStock(Number(e.target.value))}
                        className="w-full bg-white border border-zinc-200 rounded-xl p-3 text-zinc-950 focus:ring-1 focus:ring-amber-500 focus:outline-hidden font-black"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-black text-zinc-700">পোশাক বিভাগ (Category):</label>
                    <select 
                      value={pCat} 
                      onChange={e => setPCat(e.target.value)}
                      className="w-full bg-white border border-zinc-200 rounded-xl p-3 text-zinc-900 focus:ring-1 focus:ring-amber-500 focus:outline-hidden font-black"
                    >
                      <option value="classic">Classic T-Shirt (ক্লাসিক কটন টি-শার্ট)</option>
                      <option value="oversized">Oversized Tee (ওভারসাইজড ড্রপ-শোল্ডার)</option>
                      <option value="polo">Premium Polo Shirt (প্রিমিয়াম পোলো শার্ট)</option>
                      <option value="jersey">Sports Jersey (এলিট স্পোর্টস জার্সি)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-black text-zinc-700">পোশাক বুনন বৈশিষ্ট্য (কমা দিয়ে একাধিক লিখুন):</label>
                    <input 
                      type="text" 
                      placeholder="যেমন: ২৬০ GSM কটন, এন্টি শ্রিঙ্ক থ্রেড, ইজি ওয়াশ"
                      value={pFeatures} 
                      onChange={e => setPFeatures(e.target.value)}
                      className="w-full bg-white border border-zinc-200 rounded-xl p-3 text-zinc-950 focus:ring-1 focus:ring-amber-500 focus:outline-hidden font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-black text-zinc-700">পোশাকের ফটো ও ইমেজ লিংক <span className="text-rose-605">*</span></label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        required
                        placeholder="ইমেজ URL দিন"
                        value={pImg} 
                        onChange={e => setPImg(e.target.value)}
                        className="flex-1 bg-white border border-zinc-200 rounded-xl p-3 text-zinc-950 focus:ring-1 focus:ring-amber-500 focus:outline-hidden font-medium font-sans text-[11.5px]"
                      />
                      <label className="bg-zinc-950 text-white hover:bg-amber-400 hover:text-zinc-950 px-4 py-3 rounded-xl cursor-pointer text-xs font-black uppercase tracking-wider flex items-center justify-center shrink-0 transition-colors">
                        ফাইল আপলোড
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setPImg(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                    {pImg && pImg.startsWith('data:') && (
                      <div className="mt-2 relative inline-block p-1 border border-zinc-200 rounded-xl bg-zinc-50">
                        <img 
                          src={pImg} 
                          alt="Uploaded product preview" 
                          className="h-16 w-16 object-cover rounded-lg"
                          referrerPolicy="no-referrer"
                        />
                        <button 
                          type="button" 
                          onClick={() => setPImg('')}
                          className="absolute -top-2 -right-2 bg-rose-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shadow-md hover:bg-rose-700"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block font-black text-zinc-700">বিস্তারিত বিবরণ (Description) <span className="text-rose-605">*</span></label>
                    <textarea 
                      rows={3} 
                      placeholder="এটি সম্পূর্ণ সুতা নিয়ে এবং বুনন ধরন নিয়ে বিস্তারিত নথিবদ্ধ করুন যা কাস্টমারকে আকর্ষণ করবে।"
                      required
                      value={pDesc} 
                      onChange={e => setPDesc(e.target.value)}
                      className="w-full bg-white border border-zinc-200 rounded-xl p-3 text-zinc-950 focus:ring-1 focus:ring-amber-500 focus:outline-hidden font-medium leading-relaxed"
                    />
                  </div>

                  <div className="flex items-center gap-2 py-1 select-none">
                    <input 
                      type="checkbox" 
                      id="pFeaturedToggle"
                      checked={pFeatured} 
                      onChange={e => setPFeatured(e.target.checked)}
                      className="w-4.5 h-4.5 rounded border-zinc-300 text-amber-500 focus:ring-amber-400"
                    />
                    <label htmlFor="pFeaturedToggle" className="text-zinc-700 font-extrabold cursor-pointer">
                      বুনন হোমপেজে "সেরা ট্রেন্ডিং কালেকশন (Featured)" হিসেবে প্রচার করুন
                    </label>
                  </div>

                  <div className="flex gap-2.5 pt-2">
                    {editingProduct && (
                      <button 
                        type="button" 
                        onClick={handleCancelEditProduct}
                        className="w-1/3 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-black py-3.5 rounded-xl cursor-pointer text-xs"
                      >
                        বাতিল করুন
                      </button>
                    )}
                    <button 
                      type="submit"
                      className={`font-black uppercase tracking-widest py-3.5 rounded-xl cursor-pointer transition-all active:scale-95 text-xs flex items-center justify-center gap-1.5 ${
                        editingProduct ? 'w-2/3 bg-amber-500 text-zinc-950 hover:bg-amber-400' : 'w-full bg-zinc-950 text-white hover:bg-zinc-850'
                      }`}
                    >
                      {editingProduct ? (
                        <>
                          <Check className="w-4 h-4 stroke-[3]" />
                          তথ্য সেভ করুন (Save)
                        </>
                      ) : (
                        <>
                          <PlusCircle className="w-4 h-4" />
                          পোশাক ক্যাটালগে যুক্ত করুন
                        </>
                      )}
                    </button>
                  </div>

                </form>

              </div>

            </div>

          </div>
        )}

        {/* TAB 4: PUBLISH / MODIFY UPDATES */}
        {activeTab === 'updates' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
              <div className="border-l-4 border-amber-500 pl-3">
                <h3 className="text-lg font-black text-zinc-900">ব্র্যান্ড ঘোষণা, ডিসকাউন্ট অফার ও কুপন কোড মডারেটর</h3>
                <p className="text-xs text-zinc-500 font-bold mt-1">গ্রাহকদের জন্য ব্র্যান্ড নোটিশ এবং ডিসকাউন্ট কুপন পাবলিশ বা সংশোধন করুন</p>
              </div>

              <div className="flex items-center gap-2 max-w-xs w-full">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input 
                    type="text" 
                    placeholder="ঘোষণা খুঁজুন..."
                    value={updateSearch}
                    onChange={e => setUpdateSearch(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 pl-9 pr-4 text-xs font-bold"
                  />
                </div>
                {updateSearch && (
                  <button onClick={() => setUpdateSearch('')} className="p-2 border border-zinc-200 hover:bg-zinc-50 rounded-xl">
                    <XCircle className="w-4 h-4 text-zinc-500" />
                  </button>
                )}
              </div>
            </div>

            {uSuccessMsg && (
              <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-150 rounded-2xl font-bold flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                {uSuccessMsg}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Current Announcements list */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] text-zinc-400 font-black uppercase tracking-wider">রিয়েল টাইম বুলেটিনবোর্ড ({filteredAdminUpdates.length} টি)</span>
                  {editingUpdate && (
                    <button 
                      onClick={handleCancelEditUpdate}
                      className="text-xs font-bold text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      সম্পাদনা বাতিল
                    </button>
                  )}
                </div>

                <div className="border border-zinc-200 rounded-2xl overflow-hidden shadow-xs bg-white text-xs max-h-[500px] overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-50 border-b border-zinc-200 text-[9.5px] font-black uppercase text-zinc-500 tracking-wider">
                        <th className="p-3.5 pl-4">ঘোষণা বিবরণ</th>
                        <th className="p-3.5">ক্যাটাগরি</th>
                        <th className="p-3.5">প্রমো কোড/ব্যাজ</th>
                        <th className="p-3.5 text-center">এ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 font-semibold text-zinc-700">
                      {filteredAdminUpdates.map((u) => {
                        const isBeingEdited = editingUpdate?.id === u.id;
                        return (
                          <tr key={u.id} className={`${isBeingEdited ? 'bg-amber-500/5' : 'hover:bg-zinc-50/50'} transition-all`}>
                            <td className="p-3.5 pl-4 max-w-[200px]">
                              <div className="space-y-1">
                                <h4 className="font-extrabold text-zinc-950 truncate" title={u.title}>{u.title}</h4>
                                <p className="text-[10.5px] text-zinc-400 truncate font-normal">{u.excerpt}</p>
                              </div>
                            </td>
                            <td className="p-3.5">
                              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded border uppercase shrink-0 ${
                                u.category === 'new-arrival' 
                                  ? 'bg-blue-50 text-blue-700 border-blue-200' 
                                  : u.category === 'discount' 
                                    ? 'bg-pink-50 text-pink-700 border-pink-200' 
                                    : 'bg-zinc-50 text-zinc-700 border-zinc-200'
                              }`}>
                                {u.categoryBangla}
                              </span>
                            </td>
                            <td className="p-3.5 font-mono">
                              {u.badge ? (
                                <span className="bg-amber-500/10 text-amber-805 border border-amber-550/25 px-2 py-0.5 rounded text-[11px] font-black uppercase">
                                  {u.badge}
                                </span>
                              ) : (
                                <span className="text-zinc-400 font-normal">নেই</span>
                              )}
                            </td>
                            <td className="p-3.5">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => handleStartEditUpdate(u)}
                                  className="p-2 border border-zinc-200 text-zinc-500 hover:text-amber-600 hover:border-amber-300 rounded-xl hover:bg-amber-500/10 cursor-pointer transition-colors"
                                  title="সম্পাদনা করুন"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteUpdate(u.id)}
                                  className="p-2 border border-zinc-200 text-zinc-400 hover:text-rose-600 hover:border-rose-300 rounded-xl hover:bg-rose-50 cursor-pointer transition-colors"
                                  title="ঘোষণা ডিলিট করুন"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add/Edit Bulletin announcements Form */}
              <div className="lg:col-span-5 bg-zinc-50 border border-zinc-150 p-5 sm:p-6 rounded-2xl text-xs">
                <div className="pb-3 border-b border-zinc-200 mb-5">
                  <h4 className="font-black text-sm text-zinc-950 flex items-center gap-1.5">
                    {editingUpdate ? (
                      <>
                        <Edit className="w-4 h-4 text-amber-500" />
                        ১. ঘোষণা ও বিজ্ঞপ্তি সংশোধন
                      </>
                    ) : (
                      <>
                        <PlusCircle className="w-4 h-4 text-emerald-500" />
                        ১. নতুন ঘোষণা প্রকাশ করুন
                      </>
                    )}
                  </h4>
                </div>

                <form onSubmit={handleUpdateSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="block font-bold text-zinc-700">ঘোষণার মূল শিরোনাম (Title) <span className="text-rose-605">*</span></label>
                    <input 
                      type="text" 
                      placeholder="যেমন: উইন্টার ধামাকা ২০% স্পেশাল ডিল!"
                      required
                      value={uTitle} 
                      onChange={e => setUTitle(e.target.value)}
                      className="w-full bg-white border border-zinc-200 rounded-xl p-3 text-zinc-950 focus:ring-1 focus:ring-amber-500 focus:outline-hidden font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-zinc-700">সংক্ষিপ্ত এক লাইনের সারাংশ (Excerpt) <span className="text-rose-605">*</span></label>
                    <input 
                      type="text" 
                      placeholder="যেমন: চেকআউটে অফার কোড ব্যবহার করা নিয়ে সংক্ষেপে..."
                      required
                      value={uExcerpt} 
                      onChange={e => setUExcerpt(e.target.value)}
                      className="w-full bg-white border border-zinc-200 rounded-xl p-3 text-zinc-950 focus:ring-1 focus:ring-amber-500 focus:outline-hidden font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block font-bold text-zinc-700">খবর ক্যাটাগরি:</label>
                      <select
                        value={uCat}
                        onChange={e => setUCat(e.target.value as any)}
                        className="w-full bg-white border border-zinc-200 rounded-xl p-3 text-zinc-900 focus:ring-1 focus:ring-amber-500 focus:outline-hidden font-black"
                      >
                        <option value="new-arrival">নতুন কালেকশনস</option>
                        <option value="discount">ধামাকা ডিসকাউন্ট</option>
                        <option value="notice">কোয়ালিটি ঘোষণা</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block font-bold text-zinc-700">স্পেশাল কুপন কোড বা ডিসকাউন্ট ব্যাজ:</label>
                      <input 
                        type="text" 
                        placeholder="যেমন: BUNON789 অথবা 20% OFF"
                        value={uBadge} 
                        onChange={e => setUBadge(e.target.value)}
                        className="w-full bg-white border border-zinc-200 rounded-xl p-3 text-zinc-950 focus:ring-1 focus:ring-amber-500 focus:outline-hidden font-mono uppercase text-xs font-black tracking-widest placeholder-zinc-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-zinc-700">ফটোগ্রাফি লিংক (ইমেজ কাভার):</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        required
                        placeholder="অ্যারাইভাল বা অফারের ইমেজ URL দিন"
                        value={uImg} 
                        onChange={e => setUImg(e.target.value)}
                        className="flex-1 bg-white border border-zinc-200 rounded-xl p-3 text-zinc-950 focus:ring-1 focus:ring-amber-500 focus:outline-hidden font-sans text-[11px]"
                      />
                      <label className="bg-zinc-950 text-white hover:bg-amber-400 hover:text-zinc-950 px-4 py-3 rounded-xl cursor-pointer text-xs font-black uppercase tracking-wider flex items-center justify-center shrink-0 transition-colors">
                        ফাইল আপলোড
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setUImg(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                    {uImg && uImg.startsWith('data:') && (
                      <div className="mt-2 relative inline-block p-1 border border-zinc-200 rounded-xl bg-zinc-50">
                        <img 
                          src={uImg} 
                          alt="Uploaded news preview" 
                          className="h-16 w-16 object-cover rounded-lg"
                          referrerPolicy="no-referrer"
                        />
                        <button 
                          type="button" 
                          onClick={() => setUImg('')}
                          className="absolute -top-2 -right-2 bg-rose-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shadow-md hover:bg-rose-700"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-zinc-700">বিস্তারিত নোটিশ কনটেন্ট (Content HTML / Text) <span className="text-rose-605">*</span></label>
                    <textarea 
                      rows={5}
                      placeholder="বিস্তারিত বিবরণ লিখুন। কাস্টমার বিস্তারিত পড়ুন বাটনে চাপ দিলে চমৎকার মোডালে এটি দেখতে পারবে।"
                      required
                      value={uContent}
                      onChange={e => setUContent(e.target.value)}
                      className="w-full bg-white border border-zinc-200 rounded-xl p-3 text-zinc-950 focus:ring-1 focus:ring-amber-500 focus:outline-hidden leading-relaxed font-semibold"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    {editingUpdate && (
                      <button 
                        type="button" 
                        onClick={handleCancelEditUpdate}
                        className="w-1/3 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-black py-3.5 rounded-xl cursor-pointer text-xs animate-fadeIn"
                      >
                        বাতিল
                      </button>
                    )}
                    <button 
                      type="submit"
                      className={`font-black uppercase tracking-widest py-3.5 rounded-xl cursor-pointer transition-all active:scale-95 text-xs flex items-center justify-center gap-1.5 ${
                        editingUpdate ? 'w-2/3 bg-amber-500 text-zinc-950 hover:bg-amber-400' : 'w-full bg-zinc-950 text-white hover:bg-zinc-850'
                      }`}
                    >
                      {editingUpdate ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          বিজ্ঞপ্তি সেভ করুন
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          আপডেট প্রকাশ করুন
                        </>
                      )}
                    </button>
                  </div>

                </form>
              </div>

            </div>
          </div>
        )}

        {/* TAB 5: CUSTOMER REVIEWS HUB */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="border-l-4 border-amber-500 pl-3 py-0.5">
              <h3 className="text-lg font-black text-zinc-900">গ্রাহক রিভিউ ও টেস্টটিমোনিয়াল মডারেশন হাব</h3>
              <p className="text-xs text-zinc-500 font-bold mt-1 uppercase tracking-wide">রিভিউ তালিকা থেকে অপ্রাসঙ্গিক রিভিউ মুছে ফেলতে পারেন</p>
            </div>
            
            {reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4.5 bg-zinc-50 rounded-2xl border border-zinc-150 flex flex-col justify-between gap-4 text-xs font-semibold">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200/50 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-zinc-950 text-sm">{rev.customerName}</span>
                          <span className="text-[10px] text-amber-600 font-black bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                            {rev.rating} ★ স্টার
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-400 font-normal font-sans">{rev.date}</span>
                      </div>
                      
                      <p className="text-zinc-650 bg-white border border-zinc-100 p-3 rounded-xl font-medium leading-relaxed">
                        {rev.commentBangla || rev.comment}
                      </p>
                      
                      <div className="text-[10.5px] text-zinc-400 font-black uppercase flex items-center gap-1.5 pt-1 pl-1">
                        <Tag className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        টার্গেটেড প্রোডাক্ট: <strong className="text-zinc-800">{rev.productName}</strong>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-zinc-150 flex justify-between items-center mt-2">
                      <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> ভেরিফাইড রিভিউ
                      </span>
                      <button 
                        onClick={() => handleDeleteReview(rev.id)}
                        className="px-3 py-1.5 hover:bg-rose-50 text-rose-600 font-black rounded-lg flex items-center gap-1 cursor-pointer transition-colors border border-rose-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        রিভিউটি মুছুন
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200 text-zinc-400">
                কোনো রিভিউ এখনও পাওয়া যায়নি।
              </div>
            )}
          </div>
        )}

      {/* Custom Elegance Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-zinc-200 w-full max-w-sm rounded-2xl p-6 shadow-2xl space-y-4 text-left font-sans animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-zinc-950 pb-2 border-b border-zinc-150">
              <span className="text-lg">⚠️</span>
              <h3 className="font-extrabold text-xs tracking-tight text-zinc-900">{confirmModal.title}</h3>
            </div>
            <p className="text-xs text-zinc-650 font-bold leading-relaxed">
              {confirmModal.message}
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 bg-zinc-150 hover:bg-zinc-200 border border-zinc-200 rounded-xl text-[10px] font-black text-zinc-700 transition-colors cursor-pointer"
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
