/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  banglaName: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  categoryBangla: string;
  rating: number;
  reviewsCount: number;
  stock: number;
  isFeatured: boolean;
  features: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalPrice: number;
  shippingInfo: ShippingInfo;
  paymentMethod: string;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
}

export interface Category {
  id: string;
  name: string;
  banglaName: string;
  icon: string; // Lucide icon name
  bgColor: string;
  textColor: string;
}

export interface Review {
  id: string;
  productName: string;
  customerName: string;
  rating: number;
  comment: string;
  commentBangla: string;
  date: string;
  isVerifiedPurchase: boolean;
}

export interface BrandUpdate {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'new-arrival' | 'discount' | 'notice';
  categoryBangla: string;
  date: string;
  imageUrl?: string;
  badge?: string;
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  avatarUrl?: string;
}

