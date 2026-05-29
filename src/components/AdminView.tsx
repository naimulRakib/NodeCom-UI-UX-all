'use client';

import { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard, Map, BarChart3, Settings, Bell,
  AlertTriangle, CheckCircle,
  Activity, Globe, Network, Package, ArrowRight,
  ChevronRight, RefreshCw, Filter, Download,
  Clock, Shield, Cpu, Radio, Truck
} from 'lucide-react';

const aiFeedLogs = [
  { id: 1, type: 'XGBoost', message: 'কুমিল্লা জোনে ম্যাক্রো ডিমান্ড সিগন্যাল শনাক্ত হয়েছে', time: '১০:৪৫', level: 'info' },
  { id: 2, type: 'Edge AI', message: 'বুড়িচং নোডে হাইপার-লোকাল কনটেক্সট যাচাই করা হয়েছে', time: '১০:৪৪', level: 'success' },
  { id: 3, type: 'ACO', message: 'ট্রাক ৪০৪ রিরুটিং: কুমিল্লা ➔ দেবিদ্বার (৩৫ মিনিট সাশ্রয়)', time: '১০:৪৩', level: 'warning' },
  { id: 4, type: 'P2P', message: 'দেবিদ্বার ↔ বুড়িচং মেশ লিংক প্রতিষ্ঠিত হয়েছে', time: '১০:৪২', level: 'success' },
  { id: 5, type: 'XGBoost', message: 'ঢাকা-চট্টগ্রাম করিডোরে ডিমান্ড স্পাইকের পূর্বাভাস (৬ ঘণ্টার মধ্যে)', time: '১০:৪১', level: 'warning' },
  { id: 6, type: 'LLM', message: 'উৎসবের কনটেক্সট যোগ করা হয়েছে: কুমিল্লা, নোয়াখালী অঞ্চল', time: '১০:৪০', level: 'info' },
  { id: 7, type: 'ACO', message: 'ট্রাক ৪০৫ অপ্টিমাল রুট সেট করা হয়েছে: ৪টি নোড কভার করবে', time: '১০:৩৯', level: 'info' },
  { id: 8, type: 'Edge AI', message: 'চট্টগ্রাম পোর্ট নোডে ইমপোর্ট ব্যাচ পৌঁছানোর বিষয়টি নিশ্চিত করা হয়েছে', time: '১০:৩৮', level: 'success' },
];

const activeTrucks = [
  {
    id: '৪০৪',
    route: 'ঢাকা ➔ কুমিল্লা হাব ➔ দেবিদ্বার ➔ বুড়িচং',
    status: 'চলমান',
    eta: '১ঘ ২০মিনিট',
    progress: 62,
    color: 'from-indigo-500 to-purple-600',
    items: '৮৫ আইটেম',
    currentLeg: 'কুমিল্লা হাব',
    driver: 'রাজু মিয়া'
  },
  {
    id: '৪০৫',
    route: 'চট্টগ্রাম ➔ ফেনী হাব ➔ নোয়াখালী',
    status: 'লোড হচ্ছে',
    eta: '৩ ঘণ্টা',
    progress: 15,
    color: 'from-emerald-500 to-teal-600',
    items: '১২৩ আইটেম',
    currentLeg: 'চট্টগ্রাম পোর্ট',
    driver: 'করিম হোসেন'
  },
  {
    id: '৪০৬',
    route: 'ঢাকা ➔ নারায়ণগঞ্জ ➔ মুন্সিগঞ্জ',
    status: 'বিলম্বিত',
    eta: '২ঘ ৪৫মিনিট',
    progress: 38,
    color: 'from-amber-500 to-orange-600',
    items: '৪৭ আইটেম',
    currentLeg: 'পোস্তগোলা',
    driver: 'সালাম উদ্দিন'
  },
];

const zoneData = [
  { zone: 'ঢাকা মেট্রো', nodes: 24, accuracy: 94, demand: 'উচ্চ', status: 'active' },
  { zone: 'কুমিল্লা', nodes: 12, accuracy: 91, demand: 'মাঝারি', status: 'active' },
  { zone: 'চট্টগ্রাম', nodes: 18, accuracy: 89, demand: 'উচ্চ', status: 'active' },
  { zone: 'সিলেট', nodes: 8, accuracy: 85, demand: 'নিম্ন', status: 'active' },
  { zone: 'ময়মনসিংহ', nodes: 6, accuracy: 82, demand: 'মাঝারি', status: 'partial' },
];

export default function AdminView() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [feedLogs, setFeedLogs] = useState(aiFeedLogs);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);

  // Simulate live feed additions
  useEffect(() => {
    const interval = setInterval(() => {
      const newLogs = [
        { id: Date.now(), type: 'ACO', message: 'নতুন অপ্টিমাল রুট ক্যালকুলেশন সম্পন্ন হয়েছে', time: 'এখন', level: 'info' },
        { id: Date.now(), type: 'Edge AI', message: 'লোকাল নোড ডেটা সিঙ্ক্রোনাইজ করা হয়েছে', time: 'এখন', level: 'success' },
        { id: Date.now(), type: 'XGBoost', message: 'আগামী ৪ ঘণ্টার জন্য ডিমান্ড ফোরকাস্ট আপডেট করা হয়েছে', time: 'এখন', level: 'info' },
      ];
      const randomLog = newLogs[Math.floor(Math.random() * newLogs.length)];
      setFeedLogs(prev => [randomLog, ...prev.slice(0, 11)]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { key: 'dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'ড্যাশবোর্ড' },
    { key: 'routes', icon: <Map className="w-5 h-5" />, label: 'ACO রাউটিং' },
    { key: 'analytics', icon: <BarChart3 className="w-5 h-5" />, label: 'অ্যানালিটিক্স' },
    { key: 'nodes', icon: <Network className="w-5 h-5" />, label: 'নোড ম্যানেজার' },
    { key: 'ai', icon: <Cpu className="w-5 h-5" />, label: 'এআই পাইপলাইন' },
    { key: 'settings', icon: <Settings className="w-5 h-5" />, label: 'সেটিংস' },
  ];

  return (
    <div className="min-h-screen flex font-sans" style={{ background: '#030712' }}>
      {/* Sidebar */}
      <aside className={`flex-shrink-0 flex flex-col border-r border-white/5 transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-60'}`}
        style={{ background: 'linear-gradient(180deg, #0a0f1e 0%, #030712 100%)' }}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 glow-indigo">
              <Globe className="w-5 h-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <p className="text-white font-bold text-sm leading-tight">নোডঅন-কমার্স</p>
                <p className="text-indigo-400 text-xs">ম্যাক্রো অর্কেস্ট্রেটর</p>
              </div>
            )}
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => setActiveSection(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activeSection === item.key
                  ? 'bg-indigo-600/30 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
              }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* System Status */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-white/5">
            <div className="glass rounded-2xl p-3 space-y-2">
              <p className="text-slate-500 text-xs font-medium mb-2">সিস্টেম স্ট্যাটাস</p>
              {[
                { label: 'ACO ইঞ্জিন', status: 'অ্যাক্টিভ', ok: true },
                { label: 'LLM পাইপলাইন', status: 'অ্যাক্টিভ', ok: true },
                { label: 'P2P মেশ', status: '৪৮/৫২ নোড', ok: true },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px] sm:text-xs">{s.label}</span>
                  <div className="flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${s.ok ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    <span className={`text-[10px] sm:text-xs ${s.ok ? 'text-emerald-400' : 'text-amber-400'}`}>{s.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 flex-shrink-0"
          style={{ background: 'rgba(10, 15, 30, 0.8)', backdropFilter: 'blur(12px)' }}>
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="text-slate-500 hover:text-white transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>
            <div>
              <h2 className="text-white font-bold text-lg leading-tight">গ্লোবাল অ্যাডমিন প্যানেল</h2>
              <p className="text-slate-500 text-[11px] sm:text-xs mt-0.5">ম্যাক্রো অর্কেস্ট্রেশন • রিয়েল-টাইম ডেটা</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 glass rounded-xl px-3 py-2 border border-white/5">
              <span className="w-2 h-2 bg-emerald-400 rounded-full pulse-dot shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span className="text-emerald-400 text-[11px] sm:text-xs font-bold">৪৮ নোড অনলাইন</span>
            </div>
            <button className="relative w-9 h-9 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors border border-white/5">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full border border-[#030712]" />
            </button>
            <div className="flex items-center gap-2 glass rounded-xl px-3 py-2 border border-white/5">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-inner">
                <span className="text-white text-[10px] sm:text-xs font-bold">A</span>
              </div>
              <span className="text-slate-300 text-xs sm:text-sm font-medium">অ্যাডমিন</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-6 grid-bg custom-scrollbar">
          {/* KPI Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { icon: <Network className="w-6 h-6" />, label: 'অ্যাক্টিভ নোড', value: '৪৮', sub: '৫২ এর মধ্যে', change: '+৩', color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
              { icon: <Truck className="w-6 h-6" />, label: 'অ্যাক্টিভ ট্রাক', value: '১৭', sub: '৩ রিরুটিং', change: '৩ বিলম্বিত', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
              { icon: <Package className="w-6 h-6" />, label: "আজকের অর্ডার", value: '৮,৪৩২', sub: '৯৭.২% সফল', change: '+১২%', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
              { icon: <Activity className="w-6 h-6" />, label: 'এআই ফোরকাস্ট নিখুঁততা', value: '৯২%', sub: 'হাইব্রিড মডেল', change: '+৭২%', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
            ].map((kpi, i) => (
              <div key={i} className={`glass rounded-3xl p-5 metric-card border ${kpi.border} hover:bg-white/5 transition-colors`}>
                <div className={`w-12 h-12 ${kpi.bg} rounded-2xl flex items-center justify-center ${kpi.color} mb-4 shadow-inner`}>
                  {kpi.icon}
                </div>
                <p className="text-white font-black text-2xl sm:text-3xl mb-1">{kpi.value}</p>
                <p className="text-slate-300 text-[13px] sm:text-sm font-semibold">{kpi.label}</p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                  <p className="text-slate-500 text-[10px] sm:text-[11px] font-medium">{kpi.sub}</p>
                  <span className={`${kpi.color} text-[10px] sm:text-[11px] font-bold`}>{kpi.change}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Main Grid: Map + Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            {/* ACO Map Area */}
            <div className="lg:col-span-2 glass rounded-3xl overflow-hidden shadow-xl border border-indigo-500/10">
              {/* Map Header */}
              <div className="flex items-center justify-between p-5 border-b border-white/5 bg-black/20">
                <div>
                  <h3 className="text-white font-bold text-sm sm:text-base">ACO রুট ম্যাপ</h3>
                  <p className="text-slate-500 text-[10px] sm:text-xs mt-0.5">অ্যান্ট কলোনি অপ্টিমাইজেশন • রিয়েল-টাইম</p>
                </div>
                <div className="flex gap-2">
                  <button className="glass rounded-xl px-3 py-1.5 text-[11px] sm:text-xs font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 border border-white/10 hover:bg-white/5">
                    <Filter className="w-3.5 h-3.5" /> ফিল্টার
                  </button>
                  <button className="glass rounded-xl px-3 py-1.5 text-[11px] sm:text-xs font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 border border-white/10 hover:bg-white/5">
                    <RefreshCw className="w-3.5 h-3.5" /> রিফ্রেশ
                  </button>
                </div>
              </div>

              {/* Map Visual */}
              <div className="relative h-64 sm:h-72 overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #111827 100%)' }}>
                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-[0.15]" style={{
                  backgroundImage: 'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)',
                  backgroundSize: '40px 40px'
                }} />

                {/* Route Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 260" preserveAspectRatio="none">
                  <path d="M 100 130 Q 200 80 300 120" stroke="#6366f1" strokeWidth="2.5" fill="none" strokeDasharray="6 4" opacity="0.8" className="animate-dash" />
                  <path d="M 300 120 Q 360 100 400 140" stroke="#10b981" strokeWidth="2.5" fill="none" strokeDasharray="6 4" opacity="0.9" className="animate-dash-reverse" />
                  <path d="M 400 140 Q 450 160 500 150" stroke="#10b981" strokeWidth="3" fill="none" opacity="1" strokeLinecap="round" />
                  <path d="M 100 130 Q 150 180 220 200 Q 320 210 400 190" stroke="#f59e0b" strokeWidth="2" fill="none" strokeDasharray="4 4" opacity="0.6" className="animate-dash" />
                  <circle cx="300" cy="120" r="5" fill="#6366f1" opacity="1" className="shadow-[0_0_10px_#6366f1]" />
                  <circle cx="300" cy="120" r="12" fill="none" stroke="#6366f1" strokeWidth="1.5" opacity="0.6">
                    <animate attributeName="r" values="5;20;5" dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0;0.8" dur="2.5s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="400" cy="140" r="4" fill="#10b981" opacity="1" className="shadow-[0_0_10px_#10b981]" />
                </svg>

                {/* City Labels */}
                {[
                  { name: 'ঢাকা', x: '14%', y: '42%', active: false },
                  { name: 'কুমিল্লা হাব', x: '46%', y: '36%', active: true },
                  { name: 'দেবিদ্বার', x: '63%', y: '48%', active: true },
                  { name: 'বুড়িচং', x: '80%', y: '44%', active: true },
                  { name: 'চট্টগ্রাম', x: '20%', y: '70%', active: false },
                ].map((city, i) => (
                  <div key={i} className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                    style={{ left: city.x, top: city.y }}>
                    <div className="flex flex-col items-center gap-1.5">
                      <div className={`w-3.5 h-3.5 rounded-full border-[2.5px] shadow-lg ${city.active ? 'bg-indigo-500 border-indigo-300 shadow-indigo-500/50' : 'bg-slate-700 border-slate-500 shadow-black/50'}`}>
                        {city.active && <div className="absolute inset-0 rounded-full bg-indigo-400 node-ping" />}
                      </div>
                      <span className={`text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-lg backdrop-blur-md shadow-lg ${city.active ? 'text-white bg-indigo-600/70 border border-indigo-400/50' : 'text-slate-300 bg-slate-800/80 border border-slate-600/50'}`}>
                        {city.name}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Route Legend */}
                <div className="absolute bottom-4 left-4 flex flex-col gap-2 bg-black/40 p-2.5 rounded-xl border border-white/5 backdrop-blur-sm">
                  {[
                    { color: '#6366f1', label: 'ট্রাক ৪০৪ (চলমান)' },
                    { color: '#f59e0b', label: 'ট্রাক ৪০৬ (বিলম্বিত)' },
                    { color: '#10b981', label: 'P2P ডাইরেক্ট লিংক' },
                  ].map((leg, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <div className="w-5 h-1 rounded-full shadow-sm" style={{ background: leg.color, boxShadow: `0 0 5px ${leg.color}` }} />
                      <span className="text-[10px] sm:text-xs text-slate-200 font-medium">{leg.label}</span>
                    </div>
                  ))}
                </div>

                {/* ACO Badge */}
                <div className="absolute top-4 right-4 glass rounded-xl px-3.5 py-2 border border-indigo-500/40 shadow-lg shadow-indigo-500/10 bg-[#0f172a]/80 backdrop-blur-md">
                  <p className="text-indigo-400 text-[11px] sm:text-xs font-bold flex items-center gap-1.5">
                    <span className="text-sm">🐜</span> ACO অ্যাক্টিভ
                  </p>
                  <p className="text-slate-400 text-[9px] sm:text-[10px] mt-0.5 font-medium">৩টি রুট অপ্টিমাইজড</p>
                </div>
              </div>

              {/* Active Trucks List */}
              <div className="p-5 bg-black/10">
                <h4 className="text-slate-400 text-[10px] sm:text-xs font-bold mb-4 uppercase tracking-wider flex items-center gap-2">
                   <Truck className="w-3.5 h-3.5" /> অ্যাক্টিভ ট্রাক
                </h4>
                <div className="space-y-3">
                  {activeTrucks.map(truck => (
                    <div key={truck.id} className="p-3.5 rounded-2xl bg-black/20 border border-white/5 hover:border-white/10 hover:bg-black/30 transition-all cursor-default">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${truck.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                            <Truck className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <span className="text-white text-[13px] sm:text-sm font-bold flex items-center gap-2">
                               ট্রাক {truck.id}
                               <span className="text-[9px] sm:text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-slate-300 font-medium">ID</span>
                            </span>
                            <span className="text-slate-400 text-[10px] sm:text-xs font-medium">{truck.driver}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] sm:text-xs px-2.5 py-1 rounded-full glass font-bold shadow-sm ${
                            truck.status === 'চলমান' ? 'text-indigo-400 border border-indigo-500/40 shadow-indigo-500/20' :
                            truck.status === 'লোড হচ্ছে' ? 'text-emerald-400 border border-emerald-500/40 shadow-emerald-500/20' :
                            'text-amber-400 border border-amber-500/40 shadow-amber-500/20 pulse-dot'
                          }`}>{truck.status}</span>
                        </div>
                      </div>
                      <p className="text-slate-300 text-[11px] sm:text-xs mb-3 truncate font-medium bg-white/5 p-2 rounded-lg border border-white/5">{truck.route}</p>
                      <div className="flex items-center gap-3 mb-2.5">
                        <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden shadow-inner">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${truck.color} transition-all duration-1000 relative`}
                            style={{ width: `${truck.progress}%` }}
                          >
                             <div className="absolute inset-0 bg-white/20 w-1/3 blur-sm animate-[shimmer_2s_infinite]" />
                          </div>
                        </div>
                        <span className="text-slate-300 text-[10px] sm:text-xs font-bold w-8 text-right">{truck.progress}%</span>
                        <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded border border-white/5">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span className="text-slate-300 text-[10px] sm:text-xs font-medium">{truck.eta}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <span className="text-slate-500 text-[10px] sm:text-[11px] font-medium">বর্তমান: <span className="text-slate-300">{truck.currentLeg}</span></span>
                        <span className="text-slate-400 text-[10px] sm:text-[11px] font-bold bg-white/5 px-2 py-0.5 rounded">{truck.items}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Live AI Feed */}
            <div className="glass rounded-3xl flex flex-col overflow-hidden shadow-xl border border-white/5">
              <div className="p-4 sm:p-5 border-b border-white/5 bg-black/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-bold text-sm sm:text-base">লাইভ এআই ফিড</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full pulse-dot shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                      <span className="text-emerald-400 text-[10px] sm:text-xs font-medium">রিয়েল-টাইম লগ</span>
                    </div>
                  </div>
                  <button className="glass rounded-xl p-2 sm:p-2.5 text-slate-300 hover:text-white transition-colors border border-white/10 hover:bg-white/5">
                    <Download className="w-4 h-4 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>

              <div ref={feedRef} className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 custom-scrollbar bg-black/10" style={{ maxHeight: '420px' }}>
                {feedLogs.map((log, i) => (
                  <div key={`${log.id}-${i}`} className={`p-3.5 rounded-2xl border transition-all slide-up hover:-translate-y-0.5 shadow-sm ${
                    log.level === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/40 hover:shadow-emerald-500/10' :
                    log.level === 'warning' ? 'bg-amber-500/10 border-amber-500/20 hover:border-amber-500/40 hover:shadow-amber-500/10' :
                    'bg-indigo-500/10 border-indigo-500/20 hover:border-indigo-500/40 hover:shadow-indigo-500/10'
                  }`}>
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span className={`font-bold px-2 py-0.5 rounded text-[10px] sm:text-[11px] shadow-inner ${
                        log.level === 'success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        log.level === 'warning' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                      }`}>[{log.type}]</span>
                      <span className="text-slate-500 text-[9px] sm:text-[10px] font-mono ml-auto bg-black/20 px-1.5 py-0.5 rounded">{log.time}</span>
                    </div>
                    <p className="text-slate-300 text-[11px] sm:text-[13px] leading-relaxed font-medium">{log.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Accuracy Comparison + Zone Data */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Accuracy Chart */}
            <div className="glass rounded-3xl p-5 sm:p-6 shadow-xl border border-white/5 hover:border-white/10 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
                <div>
                  <h3 className="text-white font-bold text-sm sm:text-base">এআই নিখুঁততার তুলনা</h3>
                  <p className="text-slate-400 text-[10px] sm:text-xs mt-0.5 font-medium">ডিমান্ড ফোরকাস্টিং মডেল</p>
                </div>
                <span className="text-emerald-400 text-[11px] sm:text-xs font-bold glass rounded-xl px-3 py-1.5 border border-emerald-500/30 shadow-lg shadow-emerald-500/10 flex items-center gap-1.5 w-fit">
                  <CheckCircle className="w-3.5 h-3.5" /> +৭২% উন্নতি
                </span>
              </div>

              <div className="space-y-7">
                {/* Traditional */}
                <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-slate-300 text-[13px] sm:text-sm font-semibold mb-0.5">ন্যাশনাল ML</p>
                      <p className="text-slate-500 text-[10px] sm:text-[11px] font-medium">সিঙ্গেল সেন্ট্রালাইজড মডেল</p>
                    </div>
                    <span className="text-slate-400 font-black text-xl sm:text-2xl drop-shadow-md">২০%</span>
                  </div>
                  <div className="h-3 sm:h-4 bg-slate-800 rounded-full overflow-hidden shadow-inner border border-slate-700/50">
                    <div className="h-full rounded-full transition-all duration-1000 relative overflow-hidden"
                      style={{ width: '20%', background: 'linear-gradient(90deg, #475569, #64748b)' }}>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_3s_infinite]" />
                    </div>
                  </div>
                  <div className="flex items-start gap-2 mt-3 bg-rose-500/5 p-2 rounded-lg border border-rose-500/10">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400 mt-0.5 flex-shrink-0" />
                    <span className="text-rose-400/90 text-[10px] sm:text-[11px] font-medium leading-tight">লোকাল কনটেক্সট অনুপস্থিত, উচ্চ ফলস-পজিটিভ রেট</span>
                  </div>
                </div>

                {/* Hybrid */}
                <div className="bg-indigo-900/10 p-4 rounded-2xl border border-indigo-500/20 shadow-lg shadow-indigo-500/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center justify-between mb-3 relative z-10">
                    <div>
                      <p className="text-white text-[13px] sm:text-sm font-bold mb-0.5">ম্যাক্রো-মাইক্রো হাইব্রিড এআই</p>
                      <p className="text-indigo-400 text-[10px] sm:text-[11px] font-medium">XGBoost + Edge LLM + ACO</p>
                    </div>
                    <span className="text-indigo-400 font-black text-xl sm:text-2xl drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]">৯২%</span>
                  </div>
                  <div className="h-3 sm:h-4 bg-slate-800 rounded-full overflow-hidden relative shadow-inner border border-slate-700/50 z-10">
                    <div className="h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                      style={{ width: '92%', background: 'linear-gradient(90deg, #4f46e5, #818cf8, #a5b4fc)' }}>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-[200%]"
                        style={{ animation: 'shimmer 2.5s linear infinite' }} />
                    </div>
                  </div>
                  <div className="flex items-start gap-2 mt-3 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20 z-10 relative">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-emerald-400/90 text-[10px] sm:text-[11px] font-medium leading-tight">হাইপার-লোকাল কনটেক্সট অন্তর্ভুক্ত, রিয়েল-টাইম আপডেট</span>
                  </div>
                </div>

                {/* Visual Comparison */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-3 border-t border-white/10">
                  {[
                    { label: 'ফলস অ্যালার্ট', nat: '৮৩%', hyb: '৮%', better: true },
                    { label: 'রেসপন্স টাইম', nat: '২৪ ঘণ্টা', hyb: '১৫ মিনিট', better: true },
                  ].map((comp, i) => (
                    <div key={i} className="glass rounded-2xl p-3 sm:p-4 border border-white/5 bg-black/20 hover:bg-black/40 transition-colors">
                      <p className="text-slate-400 text-[10px] sm:text-[11px] font-semibold mb-2 sm:mb-3 uppercase tracking-wider">{comp.label}</p>
                      <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2.5">
                        <span className="text-rose-400/70 text-[11px] sm:text-xs font-medium line-through">{comp.nat}</span>
                        <ArrowRight className="hidden sm:block w-3 h-3 text-slate-600" />
                        <span className="text-emerald-400 text-[13px] sm:text-base font-black drop-shadow-md">{comp.hyb}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Zone Overview */}
            <div className="glass rounded-3xl p-5 sm:p-6 shadow-xl border border-white/5 hover:border-white/10 transition-colors flex flex-col">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-white font-bold text-sm sm:text-base">জোন ওভারভিউ</h3>
                  <p className="text-slate-400 text-[10px] sm:text-xs mt-0.5 font-medium">সকল অ্যাক্টিভ অঞ্চল</p>
                </div>
                <button className="text-indigo-400 text-[11px] sm:text-xs font-bold flex items-center gap-1 hover:text-indigo-300 transition-colors bg-indigo-500/10 px-2.5 py-1.5 rounded-lg border border-indigo-500/20">
                  সব দেখুন <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2.5 flex-1">
                {zoneData.map((zone, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-black/20 border border-white/5 hover:border-white/10 hover:bg-black/30 transition-all cursor-default group">
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full flex-shrink-0 shadow-sm ${zone.status === 'active' ? 'bg-emerald-400 shadow-emerald-400/50' : 'bg-amber-400 pulse-dot shadow-amber-400/50'}`} />
                        <span className="text-white text-[13px] sm:text-sm font-bold">{zone.zone}</span>
                      </div>
                      <span className={`text-[9px] sm:text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm ${
                        zone.demand === 'উচ্চ' ? 'text-rose-400 bg-rose-500/10 border border-rose-500/30 shadow-rose-500/10' :
                        zone.demand === 'মাঝারি' ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30 shadow-amber-500/10' :
                        'text-slate-300 bg-slate-500/20 border border-slate-500/30 shadow-slate-500/10'
                      }`}>{zone.demand} ডিমান্ড</span>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] sm:text-[11px] text-slate-400 font-medium">
                      <span className="bg-white/5 px-2 py-0.5 rounded border border-white/5"><span className="text-white font-bold">{zone.nodes}</span> নোড</span>
                      <span className="flex items-center gap-1.5 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                        <span>নিখুঁততা:</span>
                        <span className="text-indigo-400 font-bold">{zone.accuracy}%</span>
                      </span>
                    </div>
                    <div className="mt-3 h-1.5 bg-slate-800 rounded-full overflow-hidden shadow-inner border border-slate-700/30">
                      <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_5px_rgba(99,102,241,0.5)] group-hover:from-indigo-400 group-hover:to-purple-400 transition-colors"
                        style={{ width: `${zone.accuracy}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Global Stats */}
              <div className="mt-5 pt-5 border-t border-white/10 grid grid-cols-3 gap-3">
                {[
                  { label: 'মোট নোড', value: '৫২', icon: <Radio className="w-4 h-4 sm:w-5 sm:h-5" />, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
                  { label: 'জোন', value: '১২', icon: <Globe className="w-4 h-4 sm:w-5 sm:h-5" />, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
                  { label: 'আপটাইম', value: '৯৯.৭%', icon: <Shield className="w-4 h-4 sm:w-5 sm:h-5" />, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
                ].map((s, i) => (
                  <div key={i} className="text-center p-3 rounded-2xl bg-black/20 border border-white/5 hover:bg-black/40 transition-colors">
                    <div className={`${s.color} ${s.bg} border ${s.border} w-8 h-8 sm:w-10 sm:h-10 mx-auto rounded-xl flex items-center justify-center mb-2 shadow-inner`}>{s.icon}</div>
                    <p className="text-white font-black text-sm sm:text-base leading-tight mb-0.5 drop-shadow-sm">{s.value}</p>
                    <p className="text-slate-400 text-[10px] sm:text-[11px] font-semibold">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes dash {
          to { stroke-dashoffset: -12; }
        }
        @keyframes dash-reverse {
          to { stroke-dashoffset: 12; }
        }
        .animate-dash {
          animation: dash 1.5s linear infinite;
        }
        .animate-dash-reverse {
          animation: dash-reverse 1.5s linear infinite;
        }
      `}</style>
    </div>
  );
}
