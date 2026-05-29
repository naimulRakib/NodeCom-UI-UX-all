'use client';

import { useState } from 'react';
import {
  MapPin, Zap, ShoppingCart, Star, RotateCcw, Package,
  ChevronRight, Heart, Search, Bell, ArrowRight, Shield,
  Truck, Clock, CheckCircle, TrendingUp
} from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice: string;
  rating: number;
  reviews: number;
  stock: number;
  category: string;
  badge: string;
  badgeColor: string;
  emoji: string;
  deliveryTime: string;
  discount: string;
}

const products: Product[] = [
  {
    id: 1,
    name: 'প্রো ট্রিমার এক্স৫',
    price: '৳১,২৯৯',
    originalPrice: '৳১,৮৯৯',
    rating: 4.8,
    reviews: 234,
    stock: 7,
    category: 'গ্রুমিং',
    badge: 'হট ডিল',
    badgeColor: 'from-rose-500 to-pink-600',
    emoji: '✂️',
    deliveryTime: '১৫ মিনিট',
    discount: '৩২% ছাড়'
  },
  {
    id: 2,
    name: 'স্মার্টওয়াচ আল্ট্রা',
    price: '৳৩,৪৯৯',
    originalPrice: '৳৪,৯৯৯',
    rating: 4.9,
    reviews: 512,
    stock: 3,
    category: 'ওয়্যারেবলস',
    badge: 'সীমিত স্টক',
    badgeColor: 'from-amber-500 to-orange-600',
    emoji: '⌚',
    deliveryTime: '১২ মিনিট',
    discount: '৩০% ছাড়'
  },
  {
    id: 3,
    name: 'ওয়্যারলেস ইয়ারবাডস প্রো',
    price: '৳৮৯৯',
    originalPrice: '৳১,৪৯৯',
    rating: 4.7,
    reviews: 389,
    stock: 12,
    category: 'অডিও',
    badge: 'বেস্টসেলার',
    badgeColor: 'from-indigo-500 to-purple-600',
    emoji: '🎧',
    deliveryTime: '১৮ মিনিট',
    discount: '৪০% ছাড়'
  },
  {
    id: 4,
    name: 'পাওয়ার ব্যাংক ২০কে',
    price: '৳১,১৯৯',
    originalPrice: '৳১,৬৯৯',
    rating: 4.6,
    reviews: 167,
    stock: 5,
    category: 'চার্জিং',
    badge: 'নতুন',
    badgeColor: 'from-emerald-500 to-teal-600',
    emoji: '🔋',
    deliveryTime: '২০ মিনিট',
    discount: '২৯% ছাড়'
  },
];

export default function CustomerView() {
  const [cartCount, setCartCount] = useState(0);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [addedToCart, setAddedToCart] = useState<number | null>(null);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState('সব');

  const categories = ['সব', 'গ্রুমিং', 'ওয়্যারেবলস', 'অডিও', 'চার্জিং'];

  const handleAddToCart = (id: number) => {
    setCartCount(c => c + 1);
    setAddedToCart(id);
    setTimeout(() => setAddedToCart(null), 1500);
  };

  const toggleWishlist = (id: number) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const filteredProducts = activeCategory === 'সব'
    ? products
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #030712 0%, #0f172a 100%)' }}>
      {/* Mobile Container */}
      <div className="mx-auto max-w-md min-h-screen flex flex-col relative font-sans">

        {/* Top Status Bar */}
        <div className="flex items-center justify-between px-4 pt-3 pb-1">
          <span className="text-xs text-slate-500 font-medium">৯:৪১</span>
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5">
              {[1,2,3,4].map(i => (
                <div key={i} className={`w-1 rounded-full bg-slate-${i <= 3 ? '300' : '600'}`} style={{ height: `${4 + i * 2}px` }} />
              ))}
            </div>
            <svg className="w-3.5 h-3.5 text-slate-300" viewBox="0 0 24 24" fill="currentColor">
              <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
            </svg>
            <div className="flex items-center gap-0.5">
              <div className="w-6 h-3 rounded-sm border border-slate-400 relative">
                <div className="absolute inset-0.5 right-1 bg-slate-300 rounded-sm" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-1.5 bg-slate-400 rounded-r-sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <header className="px-4 pt-2 pb-3">
          <div className="flex items-center justify-between mb-3">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center glow-indigo">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-tight">নোডঅন-কমার্স</p>
                <p className="text-indigo-400 text-xs">হাইপারলোকাল কমার্স</p>
              </div>
            </div>
            {/* Action Icons */}
            <div className="flex items-center gap-2">
              <button className="relative w-9 h-9 rounded-xl glass flex items-center justify-center">
                <Bell className="w-4 h-4 text-slate-400" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full pulse-dot" />
              </button>
              <button className="relative w-9 h-9 rounded-xl glass flex items-center justify-center btn-primary"
                onClick={() => setCartCount(0)}>
                <ShoppingCart className="w-4 h-4 text-slate-400" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Location Badge */}
          <div className="flex items-center gap-2 p-2.5 rounded-2xl glass mb-3 border border-indigo-500/20">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold leading-tight">📍 বুড়িচং ক্যাম্পাস নোড</p>
              <p className="text-indigo-400 text-xs">০.৫ কিমি দূরে • অ্যাক্টিভ নোড</p>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-400 rounded-full pulse-dot" />
              <span className="text-emerald-400 text-xs font-medium">লাইভ</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="পণ্য খুঁজুন..."
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl glass text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 border border-transparent transition-all"
            />
          </div>
        </header>

        {/* Hero Delivery Banner */}
        <div className="px-4 mb-4">
          <div className="relative rounded-3xl overflow-hidden p-4" style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)'
          }}>
            {/* Decorative circles */}
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-indigo-500/10" />
            <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-indigo-500/15" />
            <div className="absolute bottom-0 left-1/2 w-40 h-20 bg-indigo-600/10 blur-2xl rounded-full" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/40 rounded-full px-3 py-1 mb-3">
                <Zap className="w-3 h-3 text-amber-400" />
                <span className="text-amber-400 text-xs font-bold">বিশেষ অফার</span>
              </div>
              <h1 className="text-white text-xl font-bold leading-tight mb-1">
                ⚡ <span className="text-indigo-300">ইন্সট্যান্ট</span> ডেলিভারি
              </h1>
              <h2 className="text-white text-xl font-bold leading-tight mb-3">
                ১৫ মিনিটের মধ্যে — <span className="text-emerald-400">নিশ্চিত</span>
              </h2>
              <div className="flex items-center gap-4 text-xs text-slate-300">
                <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-emerald-400" /> লোকাল নোড থেকে</span>
                <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-indigo-400" /> ফ্রি রিটার্ন</span>
              </div>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-5xl float-anim">📦</div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="px-4 mb-4 grid grid-cols-3 gap-2">
          {[
            { icon: <Truck className="w-4 h-4" />, label: 'অ্যাক্টিভ ডেলিভারি', value: '২৮', color: 'text-indigo-400' },
            { icon: <Clock className="w-4 h-4" />, label: 'গড় সময়', value: '১৪ মি.', color: 'text-emerald-400' },
            { icon: <TrendingUp className="w-4 h-4" />, label: 'রেটিং', value: '৪.৯/৫', color: 'text-amber-400' },
          ].map((stat, i) => (
            <div key={i} className="glass rounded-2xl p-3 text-center metric-card">
              <div className={`${stat.color} flex justify-center mb-1`}>{stat.icon}</div>
              <p className="text-white font-bold text-sm">{stat.value}</p>
              <p className="text-slate-500 text-xs mt-0.5 leading-tight">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Category Tabs */}
        <div className="px-4 mb-4">
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-indigo-600 text-white glow-indigo'
                    : 'glass text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Section Header */}
        <div className="px-4 mb-3 flex items-center justify-between">
          <h3 className="text-white font-bold text-base">লোকাল পণ্যসমূহ</h3>
          <button className="flex items-center gap-1 text-indigo-400 text-sm">
            সব দেখুন <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Product Grid */}
        <div className="px-4 grid grid-cols-2 gap-3 mb-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="glass rounded-3xl overflow-hidden metric-card group relative flex flex-col">
              {/* Product Badge */}
              <div className={`absolute top-2 left-2 z-10 bg-gradient-to-r ${product.badgeColor} rounded-full px-2 py-0.5 shadow-lg`}>
                <span className="text-white text-xs font-bold">{product.badge}</span>
              </div>

              {/* Wishlist */}
              <button
                className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full glass flex items-center justify-center"
                onClick={() => toggleWishlist(product.id)}
              >
                <Heart className={`w-3.5 h-3.5 transition-colors ${wishlist.includes(product.id) ? 'text-rose-500 fill-rose-500' : 'text-slate-400'}`} />
              </button>

              {/* Product Image */}
              <div className="h-32 flex items-center justify-center relative overflow-hidden flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(16,185,129,0.05) 100%)' }}>
                <div className="absolute inset-0 opacity-30" style={{
                  backgroundImage: 'radial-gradient(circle at 30% 70%, rgba(99,102,241,0.3) 0%, transparent 60%)'
                }} />
                <span className="text-5xl relative z-10 group-hover:scale-110 transition-transform duration-300">
                  {product.emoji}
                </span>
              </div>

              <div className="p-3 flex flex-col flex-1">
                {/* Category */}
                <span className="text-indigo-400 text-xs font-medium">{product.category}</span>

                {/* Name */}
                <h4 className="text-white font-bold text-sm leading-tight mt-0.5 mb-1 flex-1">{product.name}</h4>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-2 mt-auto">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-amber-400 text-xs font-medium">{product.rating}</span>
                  <span className="text-slate-500 text-xs">({product.reviews})</span>
                </div>

                {/* Local Stock */}
                <div className="flex items-center gap-1 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot flex-shrink-0" />
                  <span className="text-emerald-400 text-[10px] sm:text-xs font-semibold leading-tight">লোকাল স্টক: {product.stock} পিস</span>
                </div>

                {/* Delivery Time */}
                <div className="flex items-center gap-1 mb-2">
                  <Clock className="w-3 h-3 text-indigo-400 flex-shrink-0" />
                  <span className="text-indigo-400 text-[10px] sm:text-xs leading-tight">{product.deliveryTime} ডেলিভারি</span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-white font-bold text-sm">{product.price}</p>
                    <p className="text-slate-500 text-[10px] line-through">{product.originalPrice}</p>
                  </div>
                  <span className="text-emerald-400 text-[10px] sm:text-xs font-bold bg-emerald-400/10 rounded-full px-1.5 sm:px-2 py-0.5">
                    {product.discount}
                  </span>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={() => handleAddToCart(product.id)}
                  className={`w-full py-2 rounded-2xl text-sm font-bold transition-all btn-primary ${
                    addedToCart === product.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-indigo-600 text-white hover:bg-indigo-500'
                  }`}
                >
                  {addedToCart === product.id ? (
                    <span className="flex items-center justify-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> যুক্ত হয়েছে!
                    </span>
                  ) : (
                    'কার্টে যোগ করুন'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Zero Cost Return Button */}
        <div className="px-4 mb-4">
          <button
            onClick={() => setShowReturnModal(true)}
            className="w-full p-4 rounded-3xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <RotateCcw className="w-6 h-6 text-rose-400" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-white font-bold text-sm">ত্রুটিপূর্ণ পণ্য ফেরত দিন</p>
                <p className="text-rose-400 text-sm font-semibold">(জিরো কস্ট) • ১০০% গ্যারান্টি</p>
                <p className="text-slate-500 text-xs mt-0.5">কোনো প্রশ্ন ছাড়াই — রিটার্ন গ্রহণ করা হয়</p>
              </div>
              <ArrowRight className="w-5 h-5 text-rose-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>

        {/* Bottom Nav */}
        <div className="sticky bottom-0 mt-auto z-40">
          <div className="glass border-t border-white/5 px-4 py-3 pb-safe">
            <div className="flex justify-around">
              {[
                { icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>, label: 'হোম', active: true },
                { icon: <Search className="w-5 h-5" />, label: 'সার্চ', active: false },
                { icon: <ShoppingCart className="w-5 h-5" />, label: 'কার্ট', active: false },
                { icon: <Package className="w-5 h-5" />, label: 'অর্ডার', active: false },
                { icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>, label: 'প্রোফাইল', active: false },
              ].map((item, i) => (
                <button key={i} className={`flex flex-col items-center gap-1 transition-colors ${item.active ? 'text-indigo-400' : 'text-slate-600 hover:text-slate-400'}`}>
                  {item.icon}
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Return Modal */}
        {showReturnModal && (
          <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
            <div className="w-full max-w-md slide-up bg-[#0f172a] rounded-t-3xl border border-white/10 shadow-2xl relative">
              <div className="p-6">
                <div className="w-12 h-1 bg-slate-600 rounded-full mx-auto mb-6" />
                <h3 className="text-white font-bold text-lg mb-2 text-center">রিটার্ন রিকোয়েস্ট</h3>
                <p className="text-slate-400 text-sm text-center mb-6">সম্পূর্ণ ফ্রি — ৭২ ঘণ্টার মধ্যে রিফান্ড</p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {['পণ্যটি ত্রুটিপূর্ণ ছিল', 'ভুল আইটেম পেয়েছি', 'নিম্ন মান', 'অন্যান্য'].map(r => (
                    <button key={r} className="p-3 glass rounded-2xl text-sm text-slate-300 hover:border-indigo-500/50 hover:text-white transition-all text-center leading-tight">
                      {r}
                    </button>
                  ))}
                </div>
                <button className="w-full py-3 bg-indigo-600 text-white rounded-2xl font-bold btn-primary mb-3">
                  রিটার্ন শুরু করুন
                </button>
                <button onClick={() => setShowReturnModal(false)} className="w-full py-3 text-slate-400 text-sm font-medium hover:text-white transition-colors">
                  বাতিল করুন
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
