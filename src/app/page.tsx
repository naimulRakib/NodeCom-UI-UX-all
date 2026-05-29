'use client';

import { useState } from 'react';
import { Smartphone, Store, Shield, ChevronRight, AlertTriangle, Sparkles } from 'lucide-react';
import Link from 'next/link';
import CustomerView from '@/components/CustomerView';
import SellerView from '@/components/SellerView';
import AdminView from '@/components/AdminView';

type View = 'customer' | 'seller' | 'admin';

export default function Home() {
  const [activeView, setActiveView] = useState<View>('customer');

  const views = [
    {
      key: 'customer' as View,
      label: 'গ্রাহক',
      sublabel: 'কাস্টমার অ্যাপ',
      icon: <Smartphone className="w-4 h-4" />,
      color: 'from-indigo-500 to-purple-600',
      activeColor: 'bg-indigo-600',
      badge: 'মোবাইল',
    },
    {
      key: 'seller' as View,
      label: 'বিক্রেতা',
      sublabel: 'সেলার ড্যাশবোর্ড',
      icon: <Store className="w-4 h-4" />,
      color: 'from-emerald-500 to-teal-600',
      activeColor: 'bg-emerald-600',
      badge: 'ট্যাবলেট',
    },
    {
      key: 'admin' as View,
      label: 'অ্যাডমিন',
      sublabel: 'গ্লোবাল অর্কেস্ট্রেটর',
      icon: <Shield className="w-4 h-4" />,
      color: 'from-amber-500 to-orange-600',
      activeColor: 'bg-amber-600',
      badge: 'ডেস্কটপ',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ background: '#030712' }}>
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 border-b border-white/5"
        style={{ background: 'rgba(3, 7, 18, 0.95)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-screen-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center glow-indigo">
                <span className="text-white font-black text-base">N</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-white font-bold text-sm leading-none">নোডঅন-কমার্স</p>
                <p className="text-indigo-400 text-xs mt-0.5">হাইপারলোকাল ডিসেন্ট্রালাইজড প্ল্যাটফর্ম</p>
              </div>
            </div>

            {/* View Switcher - Center */}
            <div className="flex-1 flex justify-center">
              <div className="flex items-center gap-1 p-1 rounded-2xl glass">
                {views.map((view) => {
                  const isActive = activeView === view.key;
                  return (
                    <button
                      key={view.key}
                      onClick={() => setActiveView(view.key)}
                      className={`relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${isActive
                          ? `${view.activeColor} text-white`
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                      style={isActive ? { boxShadow: '0 4px 15px rgba(0,0,0,0.3)' } : {}}
                    >
                      {view.icon}
                      <span className="hidden sm:inline">{view.label}</span>
                      <span className="sm:hidden">{view.label}</span>
                      {isActive && (
                        <span className="hidden md:inline text-xs opacity-70 font-normal ml-1">
                          ({view.badge})
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Info */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link
                href="/problems"
                className="hidden sm:flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-all border metric-card hover:bg-rose-500/10"
                style={{
                  background: 'rgba(127,29,29,0.2)',
                  borderColor: 'rgba(127,29,29,0.5)',
                  color: '#f87171',
                }}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                সমস্যা
              </Link>
              <Link
                href="/solutions"
                className="hidden sm:flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-all border metric-card hover:bg-emerald-500/10"
                style={{
                  background: 'rgba(16,185,129,0.12)',
                  borderColor: 'rgba(52,211,153,0.45)',
                  color: '#34d399',
                }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                সমাধান
              </Link>
              <div className="hidden sm:flex items-center gap-2 glass rounded-xl px-3 py-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full pulse-dot" />
                <span className="text-emerald-400 text-xs font-medium">প্রোটোটাইপ v১.০</span>
              </div>
            </div>
          </div>

          {/* View Context Bar */}
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
            <span className="text-slate-600 text-xs">বর্তমান ভিউ:</span>
            <div className="flex items-center gap-1.5">
              {views.find(v => v.key === activeView)?.icon}
              <span className="text-slate-300 text-xs font-medium">
                {views.find(v => v.key === activeView)?.label} —
                {' '}{views.find(v => v.key === activeView)?.sublabel}
              </span>
            </div>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-slate-600 text-xs">{views.find(v => v.key === activeView)?.badge} ভিউ</span>

            {/* Quick switch hints */}
            <div className="ml-auto flex gap-2">
              {views.filter(v => v.key !== activeView).map(v => (
                <button
                  key={v.key}
                  onClick={() => setActiveView(v.key)}
                  className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
                >
                  {v.label} →
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* View Content */}
      <main className="flex-1">
        {activeView === 'customer' && <CustomerView />}
        {activeView === 'seller' && <SellerView />}
        {activeView === 'admin' && <AdminView />}
      </main>

      {/* Bottom Navigation (mobile floating switcher) */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 sm:hidden">
        <div className="flex items-center gap-1 p-1.5 rounded-2xl border border-white/10"
          style={{ background: 'rgba(3, 7, 18, 0.9)', backdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
          {views.map((view) => (
            <button
              key={view.key}
              onClick={() => setActiveView(view.key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${activeView === view.key
                  ? `${view.activeColor} text-white`
                  : 'text-slate-500'
                }`}
            >
              {view.icon}
              {activeView === view.key && view.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
