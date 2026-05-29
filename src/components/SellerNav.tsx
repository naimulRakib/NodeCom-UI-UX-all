'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Bot, Network, Package } from 'lucide-react';

export default function SellerNav() {
  const pathname = usePathname();

  const tabs = [
    { href: '/seller', label: 'ওভারভিউ', icon: <BarChart3 className="w-4 h-4" />, exact: true },
    { href: '/seller/ai-agent', label: 'এআই এজেন্ট', icon: <Bot className="w-4 h-4" /> },
    { href: '/seller/network', label: 'P2P নেটওয়ার্ক', icon: <Network className="w-4 h-4" /> },
    { href: '/seller/orders', label: 'অর্ডার', icon: <Package className="w-4 h-4" /> },
  ];

  return (
    <div className="flex gap-1 p-1 glass rounded-2xl mb-6 shadow-lg">
      {tabs.map(tab => {
        const isActive = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? 'bg-indigo-600 text-white glow-indigo shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
