'use client';

import { useState } from 'react';
import {
  Package, TrendingUp, AlertTriangle, Bot, Send,
  Wifi, Network, CheckCircle, RefreshCw, ChevronRight,
  BarChart3, Zap, ArrowUpRight, Info,
  Clock, Users, Activity
} from 'lucide-react';

interface ChatMessage {
  id: number;
  sender: 'seller' | 'ai';
  message: string;
  timestamp: string;
  status?: string;
}

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    sender: 'seller',
    message: 'পরের সপ্তাহে ক্যাম্পাসে ফেস্টিভ্যাল আছে — আমার আরও ২০টি ট্রিমার লাগবে।',
    timestamp: '১০:৩২ এএম'
  },
  {
    id: 2,
    sender: 'ai',
    message: 'লোকাল কনটেক্সট যোগ করা হয়েছে। JSON পেলোড আপডেট করা হচ্ছে এবং P2P সার্চ শুরু হচ্ছে...',
    timestamp: '১০:৩২ এএম',
    status: 'processing'
  },
  {
    id: 3,
    sender: 'ai',
    message: '✅ দেবিদ্বার নোডে ২০টি ট্রিমার পাওয়া গেছে। সরাসরি ট্রান্সফার করার অনুমতির অপেক্ষায় — মেইন হাব বাইপাস করা হচ্ছে।',
    timestamp: '১০:৩৩ এএম',
    status: 'success'
  }
];

const p2pNodes = [
  { id: 1, name: 'দেবিদ্বার নোড', status: 'connected', items: '২০ ট্রিমার', distance: '১২ কিমি', latency: '৪৫এমএস' },
  { id: 2, name: 'কুমিল্লা হাব', status: 'connecting', items: 'সার্চ করা হচ্ছে...', distance: '৩৫ কিমি', latency: '—' },
  { id: 3, name: 'চান্দিনা নোড', status: 'idle', items: 'স্ট্যান্ডবাই', distance: '২৮ কিমি', latency: '—' },
];

const weeklyData = [45, 62, 58, 80, 73, 91, 67];
const days = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'];

export default function SellerView() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'ai' | 'network'>('overview');
  const [p2pStatus, setP2pStatus] = useState<'idle' | 'searching' | 'found'>('found');

  const handleSend = () => {
    if (!inputMsg.trim()) return;
    const newMsg: ChatMessage = {
      id: messages.length + 1,
      sender: 'seller',
      message: inputMsg,
      timestamp: 'এখন'
    };
    setMessages(prev => [...prev, newMsg]);
    setInputMsg('');
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        sender: 'ai',
        message: 'বিশ্লেষণ সম্পন্ন হয়েছে। লোকাল ডিমান্ড প্যাটার্ন আপডেট করা হয়েছে। পরবর্তী পদক্ষেপ অনুমোদন করুন।',
        timestamp: 'এখন',
        status: 'success'
      }]);
    }, 2000);
  };

  const maxBar = Math.max(...weeklyData);

  return (
    <div className="min-h-screen grid-bg font-sans" style={{ background: 'linear-gradient(135deg, #030712 0%, #0f172a 100%)' }}>
      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* Seller Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 bg-emerald-400 rounded-full pulse-dot" />
              <span className="text-emerald-400 text-xs font-medium">লাইভ ড্যাশবোর্ড</span>
            </div>
            <h1 className="text-2xl font-bold text-white leading-tight">সেলার ড্যাশবোর্ড</h1>
            <p className="text-slate-500 text-sm mt-0.5">বুড়িচং ক্যাম্পাস নোড • আজকের ডেটা</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="glass rounded-xl px-3 py-2 flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors">
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">রিফ্রেশ</span>
            </button>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">R</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 p-1 glass rounded-2xl mb-6 shadow-lg">
          {[
            { key: 'overview', label: 'ওভারভিউ', icon: <BarChart3 className="w-4 h-4" /> },
            { key: 'ai', label: 'এআই এজেন্ট', icon: <Bot className="w-4 h-4" /> },
            { key: 'network', label: 'P2P নেটওয়ার্ক', icon: <Network className="w-4 h-4" /> },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-indigo-600 text-white glow-indigo shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-4 slide-up">
            {/* Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  icon: <Package className="w-5 h-5" />,
                  label: 'বর্তমান স্টক',
                  value: '১৪৭',
                  sub: 'মোট আইটেম',
                  color: 'text-indigo-400',
                  bg: 'bg-indigo-500/10',
                  change: '+১২'
                },
                {
                  icon: <TrendingUp className="w-5 h-5" />,
                  label: 'বিগত ৭ দিনের সেল',
                  value: '৳৮৯,৪৫০',
                  sub: '৩৪৫ অর্ডার',
                  color: 'text-emerald-400',
                  bg: 'bg-emerald-500/10',
                  change: '+২৩%'
                },
                {
                  icon: <Users className="w-5 h-5" />,
                  label: 'অ্যাক্টিভ কাস্টমার',
                  value: '২,৮৩১',
                  sub: 'এই সপ্তাহে',
                  color: 'text-purple-400',
                  bg: 'bg-purple-500/10',
                  change: '+৮%'
                },
                {
                  icon: <Activity className="w-5 h-5" />,
                  label: 'গড় রেটিং',
                  value: '৪.৮/৫',
                  sub: '৫৬৭ রিভিউ',
                  color: 'text-amber-400',
                  bg: 'bg-amber-500/10',
                  change: '↑ ০.২'
                },
              ].map((m, i) => (
                <div key={i} className="glass rounded-3xl p-4 metric-card hover:bg-white/5 transition-colors">
                  <div className={`w-10 h-10 ${m.bg} rounded-2xl flex items-center justify-center ${m.color} mb-3 shadow-inner`}>
                    {m.icon}
                  </div>
                  <p className="text-slate-400 text-[11px] sm:text-xs mb-1 font-medium">{m.label}</p>
                  <p className="text-white font-bold text-lg sm:text-xl leading-tight">{m.value}</p>
                  <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-white/5">
                    <p className="text-slate-500 text-[10px] sm:text-[11px]">{m.sub}</p>
                    <span className={`text-[10px] sm:text-[11px] font-bold ${m.color}`}>{m.change}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Stock Alert */}
            <div className="relative rounded-3xl p-4 sm:p-5 border border-amber-500/30 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
              style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(245,158,11,0.05) 100%)' }}>
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-500/10 rounded-full blur-xl" />
              <div className="relative z-10">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center flex-shrink-0 shadow-inner">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-amber-500 font-bold text-sm">🚨 এআই অ্যালার্ট</span>
                      <span className="text-[10px] sm:text-xs glass rounded-full px-2 py-0.5 text-amber-400 border border-amber-500/30 shadow-sm">হাই প্রায়োরিটি</span>
                    </div>
                    <p className="text-white font-semibold text-sm mb-1.5 leading-tight">২ দিনের মধ্যে স্টক-আউট সম্ভব</p>
                    <p className="text-slate-400 text-[11px] sm:text-xs mb-3 leading-relaxed">ট্রিমার স্টক ক্রিটিক্যাল লেভেলে পৌঁছেছে। বর্তমান বিক্রির গতিতে, ৪৮ ঘণ্টার মধ্যে স্টক-আউট হওয়ার ৮৭% সম্ভাবনা রয়েছে।</p>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-500 transition-colors btn-primary shadow-lg shadow-amber-500/20">
                        এখনই অর্ডার করুন
                      </button>
                      <button className="px-4 py-2 glass text-slate-300 rounded-xl text-xs font-medium hover:text-white transition-colors hover:bg-white/5">
                        বিস্তারিত দেখুন
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Sales Chart */}
            <div className="glass rounded-3xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-bold text-sm sm:text-base">সাপ্তাহিক সেল</h3>
                <span className="text-emerald-400 text-xs sm:text-sm font-medium flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-lg">
                  <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> +২৩% প্রবৃদ্ধি
                </span>
              </div>
              <div className="flex items-end justify-between gap-1 sm:gap-2 h-28 sm:h-32 mt-2">
                {weeklyData.map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                    <div
                      className="w-full max-w-[40px] rounded-t-lg transition-all duration-700 relative group cursor-pointer"
                      style={{
                        height: `${(val / maxBar) * 100}%`,
                        background: i === 5
                          ? 'linear-gradient(to top, #4f46e5, #818cf8)'
                          : 'linear-gradient(to top, rgba(99,102,241,0.4), rgba(99,102,241,0.2))'
                      }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 rounded-lg px-2 py-1 text-[10px] sm:text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg z-10 pointer-events-none">
                        {val}k৳
                      </div>
                    </div>
                    <span className="text-slate-500 text-[10px] sm:text-xs font-medium">{days[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="glass rounded-3xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-sm sm:text-base">সাম্প্রতিক অর্ডার</h3>
                <button className="text-indigo-400 text-xs sm:text-sm font-medium flex items-center gap-1 hover:text-indigo-300 transition-colors">সব <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></button>
              </div>
              <div className="space-y-1">
                {[
                  { id: '#ORD-4512', item: 'প্রো ট্রিমার এক্স৫', time: '৮ মি. আগে', status: 'ডেলিভারিং', color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
                  { id: '#ORD-4511', item: 'স্মার্টওয়াচ আল্ট্রা', time: '২৩ মি. আগে', status: 'সম্পন্ন', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
                  { id: '#ORD-4510', item: 'ওয়্যারলেস ইয়ারবাডস', time: '৪৫ মি. আগে', status: 'সম্পন্ন', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
                ].map((order, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 px-2 hover:bg-white/5 rounded-xl transition-colors cursor-pointer">
                    <div>
                      <p className="text-white text-[13px] sm:text-sm font-medium mb-0.5 leading-tight">{order.item}</p>
                      <p className="text-slate-500 text-[10px] sm:text-xs leading-tight">{order.id} • {order.time}</p>
                    </div>
                    <span className={`${order.color} ${order.bg} border ${order.border} text-[10px] sm:text-xs font-medium rounded-full px-2.5 py-1 shadow-sm`}>{order.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI Agent Tab */}
        {activeTab === 'ai' && (
          <div className="slide-up">
            <div className="glass rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[600px] border border-indigo-500/20">
              {/* Chat Header */}
              <div className="p-4 border-b border-white/5 flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(99,102,241,0.05) 100%)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center glow-indigo shadow-lg">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm sm:text-base leading-tight">এজ LLM এজেন্ট</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full pulse-dot" />
                      <span className="text-emerald-400 text-[10px] sm:text-xs font-medium">অ্যাক্টিভ • লোকাল প্রসেসিং</span>
                    </div>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <div className="glass rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 border border-indigo-500/20">
                      <Zap className="w-3 h-3 text-amber-400" />
                      <span className="text-[10px] sm:text-xs text-slate-300 font-medium">Llama 3.1</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Context Tags */}
              <div className="px-4 py-2.5 border-b border-white/5 flex gap-2 flex-wrap flex-shrink-0 bg-black/10">
                {['ক্যাম্পাস-ফেস্ট-কনটেক্সট', 'লোকাল-ডিমান্ড-স্কোর: ৮৯', 'P2P-এনাবলড'].map(tag => (
                  <span key={tag} className="glass rounded-full px-2.5 py-1 text-[10px] sm:text-xs text-indigo-300 border border-indigo-500/30 font-medium">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Messages */}
              <div className="p-4 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender === 'seller' ? 'justify-end' : 'justify-start'} gap-2 sm:gap-3`}>
                    {msg.sender === 'ai' && (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
                        <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                      </div>
                    )}
                    <div className={`max-w-[85%] sm:max-w-[75%] ${msg.sender === 'seller' ? 'order-first' : ''}`}>
                      <div className={`rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 shadow-sm ${
                        msg.sender === 'seller'
                          ? 'bg-indigo-600 text-white rounded-br-sm shadow-indigo-600/20'
                          : msg.status === 'success'
                          ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-100 rounded-bl-sm shadow-emerald-500/10'
                          : 'glass text-slate-200 rounded-bl-sm border border-white/5'
                      }`}>
                        <p className="text-[13px] sm:text-sm leading-relaxed">{msg.message}</p>
                        {msg.status === 'processing' && (
                          <div className="flex gap-1 mt-2.5">
                            {[0,1,2].map(i => (
                              <div key={i} className="w-1.5 h-1.5 bg-indigo-400 rounded-full"
                                style={{ animation: `pulse-dot 1s ease-in-out ${i * 0.2}s infinite` }} />
                            ))}
                          </div>
                        )}
                      </div>
                      <p className={`text-slate-500 text-[10px] mt-1.5 px-1 ${msg.sender === 'seller' ? 'text-right' : 'text-left'}`}>{msg.timestamp}</p>
                    </div>
                    {msg.sender === 'seller' && (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 border border-slate-500/50 flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
                        <span className="text-white text-xs font-bold">S</span>
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start gap-2 sm:gap-3 slide-up">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
                      <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <div className="glass rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-white/5 flex items-center">
                      <div className="flex gap-1.5">
                        {[0,1,2].map(i => (
                          <div key={i} className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-indigo-400 rounded-full"
                            style={{ animation: `pulse-dot 1s ease-in-out ${i * 0.2}s infinite` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-3 sm:p-4 border-t border-white/10 bg-slate-900/50 flex-shrink-0">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputMsg}
                    onChange={e => setInputMsg(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSend()}
                    placeholder="এজেন্টকে কিছু জিজ্ঞাসা করুন..."
                    className="flex-1 glass rounded-2xl px-4 py-2.5 sm:py-3 text-[13px] sm:text-sm text-white placeholder-slate-400 focus:outline-none border border-white/10 focus:border-indigo-500/50 transition-all shadow-inner"
                  />
                  <button
                    onClick={handleSend}
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-600 rounded-2xl flex items-center justify-center hover:bg-indigo-500 transition-colors btn-primary shadow-lg shadow-indigo-600/20 flex-shrink-0"
                  >
                    <Send className="w-4 h-4 sm:w-5 sm:h-5 text-white ml-0.5" />
                  </button>
                </div>
                <p className="text-slate-500 text-[10px] sm:text-xs mt-2.5 text-center font-medium">লোকাল এজ প্রসেসিং • ডেটা ডিভাইসেই থাকে</p>
              </div>
            </div>

            {/* JSON Payload Preview */}
            <div className="mt-4 glass rounded-3xl p-4 shadow-lg border border-emerald-500/10 bg-[#0f172a]/80">
              <div className="flex items-center justify-between mb-3">
                 <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 text-xs sm:text-sm font-medium">P2P পেলোড প্রিভিউ</span>
                 </div>
                 <span className="text-[10px] text-slate-500 font-mono">system.log</span>
              </div>
              <div className="bg-black/40 rounded-xl p-3 border border-white/5 overflow-x-auto custom-scrollbar">
                <pre className="text-[11px] sm:text-xs text-emerald-300 font-mono leading-relaxed">
{`{
  "node_id": "burichang-campus-01",
  "request": {
    "item": "trimmer-pro-x5",
    "quantity": 20,
    "context": "campus-fest-2025",
    "priority": "HIGH"
  },
  "p2p_bypass_hub": true,
  "target_nodes": ["debidwar-01"],
  "demand_score": 0.89
}`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Network Tab */}
        {activeTab === 'network' && (
          <div className="space-y-4 slide-up">
            {/* Network Status Header */}
            <div className="glass rounded-3xl p-5 shadow-lg border border-indigo-500/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-bold text-sm sm:text-base">P2P মেশ নেটওয়ার্ক</h3>
                <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full pulse-dot shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  <span className="text-emerald-400 text-[10px] sm:text-xs font-bold">অ্যাক্টিভ</span>
                </div>
              </div>

              {/* Visual Network Map */}
              <div className="relative h-48 mb-6 bg-black/20 rounded-2xl overflow-hidden border border-white/5 flex items-center justify-center">
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                   backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
                   backgroundSize: '20px 20px'
                }} />
                
                <div className="relative w-full max-w-sm aspect-[2/1]">
                  {/* Central Node */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col items-center justify-center glow-indigo shadow-xl relative z-10 border border-white/10">
                      <Wifi className="w-5 h-5 sm:w-6 sm:h-6 text-white mb-0.5" />
                      <span className="text-white text-[10px] font-bold">বুড়িচং</span>
                    </div>
                    <div className="absolute inset-[-10px] rounded-[1.25rem] border border-indigo-400/40 node-ping" />
                    <div className="absolute inset-[-10px] rounded-[1.25rem] border border-indigo-400/20 node-ping" style={{ animationDelay: '0.5s' }} />
                  </div>

                  {/* Connected Node 1 (Debidwar) */}
                  <div className="absolute top-0 left-4 sm:left-10 flex flex-col items-center gap-1.5 z-20">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl glass flex flex-col items-center justify-center border border-emerald-500/40 shadow-lg shadow-emerald-500/10 bg-[#0f172a]/90 relative">
                      <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 mb-0.5" />
                      <span className="text-white text-[9px] font-bold">দেবিদ্বার</span>
                      {/* Success Ping */}
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-[#0f172a] pulse-dot" />
                    </div>
                  </div>
                  
                  {/* Active Connection Line to Debidwar */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
                    <path d="M 50% 50% L 15% 15%" stroke="url(#activeLine)" strokeWidth="2" strokeDasharray="4 4" className="animate-dash" fill="none" />
                    <defs>
                      <linearGradient id="activeLine" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(52,211,153,0.8)" />
                        <stop offset="100%" stopColor="rgba(99,102,241,0.2)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  {/* Animated Package traveling */}
                  <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.8)] z-10" 
                       style={{ animation: 'travel 2s infinite ease-in-out', offsetPath: 'path("M 0 0 L -80 -50")' }} />

                  {/* Other Nodes */}
                  <div className="absolute bottom-0 right-4 sm:right-10 flex flex-col items-center gap-1.5 z-20">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl glass flex flex-col items-center justify-center border border-amber-500/30 bg-[#0f172a]/80">
                      <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 mb-0.5" />
                      <span className="text-white text-[9px] font-bold">কুমিল্লা</span>
                    </div>
                  </div>
                  
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
                    <path d="M 50% 50% L 85% 85%" stroke="rgba(245,158,11,0.3)" strokeWidth="1" strokeDasharray="2 4" fill="none" />
                  </svg>

                  <div className="absolute top-1/2 -translate-y-1/2 right-0 flex flex-col items-center gap-1.5 z-20">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl glass flex flex-col items-center justify-center border border-slate-600/50 bg-[#0f172a]/60">
                      <Network className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 mb-0.5" />
                      <span className="text-slate-400 text-[9px] font-bold">চান্দিনা</span>
                    </div>
                  </div>
                  
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
                    <path d="M 50% 50% L 100% 50%" stroke="rgba(100,116,139,0.2)" strokeWidth="1" fill="none" />
                  </svg>
                </div>
              </div>

              {/* Discovery Result Banner */}
              <div className="rounded-2xl p-3 sm:p-4 bg-emerald-500/10 border border-emerald-500/30 shadow-inner">
                <div className="flex items-start gap-2 sm:gap-3">
                   <div className="mt-0.5 bg-emerald-500/20 p-1 rounded-lg">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                   </div>
                   <div>
                      <p className="text-emerald-400 text-[13px] sm:text-sm font-bold leading-tight mb-1">
                        দেবিদ্বার নোডের সাথে সংযুক্ত হচ্ছে... ২০টি ট্রিমার পাওয়া গেছে।
                      </p>
                      <p className="text-emerald-100/70 text-[10px] sm:text-xs leading-tight">মেইন হাব বাইপাস করা হয়েছে। সরাসরি P2P ট্রান্সফার অ্যাক্টিভ।</p>
                   </div>
                </div>
              </div>
            </div>

            {/* Node List */}
            <div className="glass rounded-3xl p-5 shadow-lg">
              <h3 className="text-white font-bold mb-4 text-sm sm:text-base">নোড স্ট্যাটাস</h3>
              <div className="space-y-2.5">
                {p2pNodes.map(node => (
                  <div key={node.id} className="flex items-center justify-between p-3 rounded-2xl bg-black/20 border border-white/5 hover:border-white/10 hover:bg-black/30 transition-all cursor-default">
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-sm ${
                        node.status === 'connected' ? 'bg-emerald-400 shadow-emerald-400/50' :
                        node.status === 'connecting' ? 'bg-amber-400 pulse-dot shadow-amber-400/50' : 'bg-slate-600'
                      }`} />
                      <div>
                        <p className="text-white text-[13px] sm:text-sm font-semibold leading-tight mb-0.5">{node.name}</p>
                        <p className="text-slate-500 text-[10px] sm:text-xs font-medium leading-tight">{node.distance} • {node.latency}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-[13px] sm:text-sm font-bold leading-tight mb-0.5 ${
                        node.status === 'connected' ? 'text-emerald-400' :
                        node.status === 'connecting' ? 'text-amber-400' : 'text-slate-500'
                      }`}>{node.items}</p>
                      <p className="text-slate-500 text-[10px] sm:text-xs font-medium leading-tight">
                        {node.status === 'connected' ? 'সংযুক্ত' : node.status === 'connecting' ? 'সংযুক্ত হচ্ছে' : 'নিষ্ক্রিয়'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setP2pStatus('searching')}
                className="w-full mt-5 py-3 sm:py-3.5 bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 rounded-2xl text-[13px] sm:text-sm font-bold hover:bg-indigo-600/40 hover:text-white transition-all group"
              >
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw className={`w-4 h-4 group-hover:rotate-180 transition-transform duration-500 ${p2pStatus === 'searching' ? 'animate-spin text-indigo-400' : ''}`} />
                  নতুন নোড খুঁজুন
                </span>
              </button>
            </div>

            {/* Transfer Stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'মোট P2P ট্রান্সফার', value: '১২৩', sub: 'এই সপ্তাহে', icon: <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6" />, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
                { label: 'হাব বাইপাস সাশ্রয়', value: '৪৫%', sub: 'লজিস্টিক্স খরচ', icon: <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
              ].map((stat, i) => (
                <div key={i} className={`glass rounded-3xl p-4 sm:p-5 metric-card border ${stat.border} hover:bg-white/5 transition-colors`}>
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.bg} rounded-2xl flex items-center justify-center ${stat.color} mb-3 sm:mb-4 shadow-inner`}>
                    {stat.icon}
                  </div>
                  <p className="text-white font-black text-xl sm:text-2xl mb-0.5">{stat.value}</p>
                  <p className="text-slate-300 text-[11px] sm:text-[13px] font-semibold leading-tight mb-1">{stat.label}</p>
                  <p className="text-slate-500 text-[10px] sm:text-xs font-medium">{stat.sub}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes dash {
          to { stroke-dashoffset: -8; }
        }
        .animate-dash {
          animation: dash 1s linear infinite;
        }
        @keyframes travel {
          0% { transform: translate(0, 0); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translate(-100px, -60px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
