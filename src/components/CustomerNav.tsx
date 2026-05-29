'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ShoppingCart, Package, Home, User } from 'lucide-react';

export default function CustomerNav() {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/customer', icon: <Home className="w-5 h-5" />, label: 'হোম' },
    { href: '/customer/search', icon: <Search className="w-5 h-5" />, label: 'সার্চ' },
    { href: '/customer/cart', icon: <ShoppingCart className="w-5 h-5" />, label: 'কার্ট' },
    { href: '/customer/orders', icon: <Package className="w-5 h-5" />, label: 'অর্ডার' },
    { href: '/customer/profile', icon: <User className="w-5 h-5" />, label: 'প্রোফাইল' },
  ];

  return (
    <div className="sticky bottom-0 mt-auto z-40 bg-[#0f172a]">
      <div className="glass border-t border-white/5 px-4 py-3 pb-safe">
        <div className="flex justify-around">
          {navItems.map((item, i) => {
            const isActive = pathname === item.href;
            return (
              <Link key={i} href={item.href} className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-600 hover:text-slate-400'}`}>
                {item.icon}
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
