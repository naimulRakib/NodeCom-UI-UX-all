'use client';

import React, { useState, useEffect, useCallback, memo, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, ArrowLeft, Hexagon, Zap, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

/* ═══════════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════════════ */

type NodeId =
  | 'c1' | 'c2' | 'c3' // old model components
  | 'start' | 'edgeAi' | 'mesh' | 'aco' | 'delivery' // new model path
  | 'impact1' | 'impact2' | 'impact3'; // impact metrics

type NodeType = 'legacy' | 'action' | 'tech' | 'impact';

interface NodeDef {
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  type: NodeType;
  tooltip: string;
}

interface Step {
  id: string;
  active: NodeId[];
  badge: string;
  title: string;
  titleSub: string;
  speech: string;
  stat: string | null;
  phase: number; // 0=Legacy fade, 1=Core Tech, 2=Flow, 3=Impact
}

/* ═══════════════════════════════════════════════════════════
   DATA: NODE DEFINITIONS
══════════════════════════════════════════════════════════════ */

const NODES: Record<NodeId, NodeDef> = {
  // Legacy / Context nodes (fade out)
  c1: {
    label: 'সেন্ট্রাল হাব রাউটিং',
    sublabel: 'ধীর ও ব্যয়বহুল',
    icon: <div className="text-2xl">🏢</div>,
    type: 'legacy',
    tooltip: 'অযথা প্যাকেজগুলো ঢাকায় পাঠানো হতো।',
  },
  c2: {
    label: 'ব্লাইন্ড এমএল মডেল',
    sublabel: 'লোকাল ডেটা ছাড়া',
    icon: <div className="text-2xl">🤖</div>,
    type: 'legacy',
    tooltip: 'লোকাল ইভেন্ট বা ছুটি সম্পর্কে কোনো ধারণা ছিল না।',
  },
  c3: {
    label: 'বিচ্ছিন্ন নেটওয়ার্ক',
    sublabel: 'কোনো সমন্বয় নেই',
    icon: <div className="text-2xl">🏪</div>,
    type: 'legacy',
    tooltip: 'রিসেলাররা স্বাধীনভাবে কাজ করত, সম্পদের অপচয় হতো।',
  },

  // New Model / Flow Nodes
  start: {
    label: 'অর্ডার প্লেসড',
    sublabel: 'লোকাল ইনটেন্ট ক্যাপচারড',
    icon: <div className="text-2xl">📦</div>,
    type: 'action',
    tooltip: 'অর্ডারটি সরাসরি নিকটতম হাইপারলোকাল নোডে (যেমন, বুড়িচং) যায়।',
  },
  edgeAi: {
    label: 'এজ LLM + XGBoost',
    sublabel: 'লোকাল কনটেক্সট অ্যানালাইসিস',
    icon: <Zap className="w-6 h-6 text-indigo-400" />,
    type: 'tech',
    tooltip: 'মডেলটি জানে যে আজ "লোকাল মেলা" চলছে, তাই এটি অবিলম্বে ৫ কিমি ব্যাসার্ধের মধ্যে ডেলিভারির রুট অপ্টিমাইজ করে।',
  },
  mesh: {
    label: 'P2P মেশ নেটওয়ার্ক',
    sublabel: 'সরাসরি নোড-টু-নোড',
    icon: <Hexagon className="w-6 h-6 text-emerald-400" />,
    type: 'tech',
    tooltip: 'ঢাকায় যাওয়ার পরিবর্তে, নোডগুলো নিজেদের মধ্যে যোগাযোগ করে (যেমন, বুড়িচং থেকে দেবিদ্বার) সরাসরি স্টক ট্রান্সফার করার জন্য।',
  },
  aco: {
    label: 'ACO রাউটিং',
    sublabel: 'অ্যান্ট কলোনি অপ্টিমাইজেশন',
    icon: <div className="text-2xl">🐜</div>,
    type: 'tech',
    tooltip: 'পিঁপড়ার মতো, অ্যালগরিদমটি রিয়েল-টাইমে সবচেয়ে ছোট এবং কম যানজটপূর্ণ রুট খুঁজে বের করে।',
  },
  delivery: {
    label: 'হাইপারলোকাল ডেলিভারি',
    sublabel: 'মিনিটের মধ্যে, দিনের নয়',
    icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
    type: 'action',
    tooltip: 'প্যাকেজটি ১০-৩০ মিনিটের মধ্যে পৌঁছে যায়। জিরো-কস্ট রিটার্ন সম্ভব কারণ নোডটি মাত্র কয়েক ব্লক দূরে।',
  },

  // Impact Nodes
  impact1: {
    label: 'সময় সাশ্রয়',
    sublabel: '৩ দিন থেকে ৩০ মিনিট',
    icon: <div className="text-2xl">⚡</div>,
    type: 'impact',
    tooltip: 'ডেলিভারি সময় ৯৯% কমেছে।',
  },
  impact2: {
    label: 'লভ্যাংশ বৃদ্ধি',
    sublabel: '৪০% খরচ কমানো',
    icon: <div className="text-2xl">💰</div>,
    type: 'impact',
    tooltip: 'অপ্রয়োজনীয় কুরিয়ার ফি দূর করে লভ্যাংশ বিক্রেতার পকেটে থাকে।',
  },
  impact3: {
    label: 'সাসটেইনিবিলিটি',
    sublabel: 'কার্বন ফুটপ্রিন্ট হ্রাস',
    icon: <div className="text-2xl">🌱</div>,
    type: 'impact',
    tooltip: 'লোকাল ডেলিভারির কারণে পরিবহন নির্গমন ব্যাপকভাবে কমে যায়।',
  },
};

/* ═══════════════════════════════════════════════════════════
   DATA: PRESENTATION STEPS
══════════════════════════════════════════════════════════════ */

const STEPS: Step[] = [
  {
    id: 'intro',
    active: ['c1', 'c2', 'c3'], // Show legacy initially
    badge: 'ভূমিকা',
    title: 'প্যারাডাইম শিফট',
    titleSub: 'সেন্ট্রালাইজড থেকে ডিসেন্ট্রালাইজডে রূপান্তর',
    speech: "আমরা দেখেছি কীভাবে সেন্ট্রালাইজড মডেল বিক্রেতাদের ধ্বংস করে। এখন চলুন সমাধানটি দেখি।", // ~3s
    stat: null,
    phase: 0,
  },
  {
    id: 'shatter',
    active: [], // Clear legacy
    badge: 'সমাধান',
    title: 'কেন্দ্রীয় ব্যবস্থা ভেঙে ফেলা',
    titleSub: 'একটি এজ-ফার্স্ট আর্কিটেকচার',
    speech: "নোডঅন-কমার্স অপ্রয়োজনীয় সেন্ট্রাল হাবকে সম্পূর্ণ সরিয়ে দেয়।", // ~2.5s
    stat: 'দূরত্ব ৯৫% কমানো হয়েছে',
    phase: 0,
  },
  {
    id: 'start',
    active: ['start'],
    badge: 'ধাপ ১',
    title: 'লোকাল ইন্টেন্ট ক্যাপচার',
    titleSub: 'অর্ডারগুলো এজ-এ প্রসেস হয়',
    speech: "যখন একটি অর্ডার আসে, এটি ঢাকায় যায় না। এটি নিকটতম লোকাল নোডে (যেমন, বুড়িচং) যায়।", // ~3.5s
    stat: null,
    phase: 2,
  },
  {
    id: 'edgeai',
    active: ['start', 'edgeAi'],
    badge: 'ধাপ ২',
    title: 'এজ LLM + কনটেক্সট',
    titleSub: 'লোকাল ইভেন্টের রিয়েল-টাইম জ্ঞান',
    speech: "আমাদের হাইব্রিড AI (XGBoost + LLM) স্থানীয় মেলা বা যানজটের মতো কনটেক্সট অবিলম্বে বুঝতে পারে।", // ~4s
    stat: 'পূর্বাভাসের নির্ভুলতা: ৯২%',
    phase: 2,
  },
  {
    id: 'mesh',
    active: ['start', 'edgeAi', 'mesh'],
    badge: 'ধাপ ৩',
    title: 'P2P মেশ নেটওয়ার্ক',
    titleSub: 'নোডগুলো সরাসরি কথা বলে',
    speech: "যদি বুড়িচংয়ে স্টক না থাকে, এটি সরাসরি দেবিদ্বার নোডের সাথে যোগাযোগ করে। কোনো সেন্ট্রাল হাবের প্রয়োজন নেই।", // ~4.5s
    stat: 'সরাসরি নোড-টু-নোড স্থানান্তর',
    phase: 2,
  },
  {
    id: 'aco',
    active: ['start', 'edgeAi', 'mesh', 'aco'],
    badge: 'ধাপ ৪',
    title: 'অ্যান্ট কলোনি রাউটিং',
    titleSub: 'রিয়েল-টাইম পাথ অপ্টিমাইজেশন',
    speech: "ACO অ্যালগরিদম পিঁপড়াদের মতো কাজ করে, যানজট এড়িয়ে সবচেয়ে অপ্টিমাইজড রুট খুঁজে বের করে।", // ~4s
    stat: 'ডেলিভারি রুট দক্ষতা: +৬৮%',
    phase: 2,
  },
  {
    id: 'delivery',
    active: ['start', 'edgeAi', 'mesh', 'aco', 'delivery'],
    badge: 'ধাপ ৫',
    title: 'হাইপারলোকাল ডেলিভারি',
    titleSub: 'ঘণ্টা নয়, মিনিটের মধ্যে',
    speech: "ফলাফল? পণ্য ৩ দিনের পরিবর্তে ৩০ মিনিটের মধ্যে পৌঁছে যায়।", // ~3s
    stat: 'গড় ডেলিভারি: ১৫-৩০ মিনিট',
    phase: 2,
  },
  {
    id: 'impact',
    active: ['start', 'edgeAi', 'mesh', 'aco', 'delivery', 'impact1', 'impact2', 'impact3'],
    badge: 'ফলাফল',
    title: 'নেটওয়ার্ক ইফেক্ট',
    titleSub: 'সকলের জন্য একটি ভালো ইকোসিস্টেম',
    speech: "এই লোকাল মেশ নেটওয়ার্ক লভ্যাংশ বাঁচায়, সময় বাঁচায় এবং জিরো-কস্ট রিটার্ন সম্ভব করে।", // ~4s
    stat: 'বিক্রেতার লভ্যাংশ ৪০% বেড়েছে',
    phase: 3,
  },
];

/* ═══════════════════════════════════════════════════════════
   STYLE HELPERS
══════════════════════════════════════════════════════════════ */

const NODE_COLORS: Record<NodeType, { border: string; bg: string; glow: string; label: string; sub: string }> = {
  legacy: { border: '#475569', bg: 'rgba(30,41,59,0.5)', glow: 'none', label: '#94a3b8', sub: 'rgba(148,163,184,0.5)' },
  action: { border: '#6366f1', bg: 'rgba(49,46,129,0.5)', glow: '0 0 24px rgba(99,102,241,0.4)', label: '#a5b4fc', sub: 'rgba(165,180,252,0.6)' },
  tech: { border: '#10b981', bg: 'rgba(6,78,59,0.5)', glow: '0 0 24px rgba(16,185,129,0.4)', label: '#6ee7b7', sub: 'rgba(110,231,183,0.6)' },
  impact: { border: '#f59e0b', bg: 'rgba(120,53,15,0.5)', glow: '0 0 30px rgba(245,158,11,0.3)', label: '#fcd34d', sub: 'rgba(252,211,77,0.6)' },
};

const INACTIVE = { border: 'rgba(99,102,241,0.15)', bg: 'rgba(3,7,18,0.4)', label: 'rgba(148,163,184,0.4)', sub: 'rgba(148,163,184,0.2)' };

/* ═══════════════════════════════════════════════════════════
   SUB-COMPONENTS
══════════════════════════════════════════════════════════════ */

const FlowNode = memo(function FlowNode({
  id, active, hovered, onHover, onClick, className = '',
}: {
  id: NodeId; active: boolean; hovered: boolean;
  onHover: (id: NodeId | null) => void;
  onClick: (id: NodeId) => void;
  className?: string;
}) {
  const cfg = NODES[id];
  
  // Special logic for legacy nodes fading out
  const isLegacy = cfg.type === 'legacy';
  const displayActive = active;
  
  const c = displayActive ? NODE_COLORS[cfg.type] : INACTIVE;
  const lift = hovered && displayActive;

  return (
    <div
      className={`relative border-2 rounded-2xl px-4 py-3 cursor-pointer select-none ${className}`}
      style={{
        borderColor: c.border,
        background: c.bg,
        boxShadow: lift ? NODE_COLORS[cfg.type].glow : (displayActive && !isLegacy ? `0 0 15px ${NODE_COLORS[cfg.type].border}40` : 'none'),
        opacity: displayActive ? 1 : (isLegacy ? 0 : 0.2), // Legacy nodes disappear completely when inactive
        transform: lift ? 'scale(1.05) translateY(-2px)' : (isLegacy && !displayActive ? 'scale(0.8) translateY(20px)' : 'scale(1)'),
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: (!displayActive && isLegacy) ? 'none' : 'auto'
      }}
      onMouseEnter={() => displayActive && onHover(id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(id)}
    >
      <div className="flex items-center gap-3">
        <div 
          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${displayActive && !isLegacy ? 'bg-white/10' : 'bg-transparent'}`}
          style={{ 
            transform: lift ? 'scale(1.15)' : 'scale(1)', 
            transition: 'transform 0.3s ease',
            color: displayActive ? c.label : c.sub
          }}
        >
          {cfg.icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-sm leading-tight" style={{ color: c.label, transition: 'color 0.4s' }}>
            {cfg.label}
          </p>
          <p className="text-xs mt-0.5 leading-tight" style={{ color: c.sub, transition: 'color 0.4s' }}>
            {cfg.sublabel}
          </p>
        </div>
      </div>

      {/* Connection points */}
      {!isLegacy && displayActive && (
        <>
          <div className="absolute top-1/2 -left-1 w-2 h-2 rounded-full bg-white/30 transform -translate-y-1/2" />
          <div className="absolute top-1/2 -right-1 w-2 h-2 rounded-full bg-white/30 transform -translate-y-1/2" />
        </>
      )}

      {/* Hover tooltip */}
      {hovered && displayActive && (
        <div
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-3 rounded-xl text-xs leading-relaxed pointer-events-none"
          style={{ background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(8px)', border: '1px solid rgba(99,102,241,0.4)', boxShadow: '0 20px 40px rgba(0,0,0,0.6)', color: '#e2e8f0' }}
        >
          {cfg.tooltip}
          <div style={{
            position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0,
            borderLeft: '6px solid transparent', borderRight: '6px solid transparent',
            borderTop: '6px solid rgba(99,102,241,0.4)'
          }} />
        </div>
      )}
    </div>
  );
});

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════ */

export default function SolutionsPage() {
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<NodeId | null>(null);
  
  const step = STEPS[stepIdx];
  const activeSet = new Set<NodeId>(step.active);
  const isActive = (id: NodeId) => activeSet.has(id);
  const isHovered = (id: NodeId) => hoveredNode === id;

  const goNext = useCallback(() => setStepIdx(s => Math.min(s + 1, STEPS.length - 1)), []);
  const goPrev = useCallback(() => setStepIdx(s => Math.max(s - 1, 0)), []);
  const reset = useCallback(() => { setStepIdx(0); setIsPlaying(false); }, []);
  const onHover = useCallback((id: NodeId | null) => setHoveredNode(id), []);
  const onNodeClick = useCallback((id: NodeId) => {
    // Only allow clicking active non-legacy nodes to jump
    if (NODES[id].type === 'legacy') return;
    const idx = STEPS.findIndex(s => s.active.includes(id));
    if (idx !== -1) setStepIdx(idx);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); goNext(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
      else if (e.key === 'Escape') setIsPlaying(false);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [goNext, goPrev]);

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return;
    if (stepIdx >= STEPS.length - 1) { setIsPlaying(false); return; }
    // Dynamic timing based on speech length
    const time = Math.max(3000, step.speech.length * 50); 
    const t = setTimeout(goNext, time);
    return () => clearTimeout(t);
  }, [isPlaying, stepIdx, goNext, step.speech]);

  const progressPct = Math.round((stepIdx / (STEPS.length - 1)) * 100);

  return (
    <div
      className="h-screen flex flex-col overflow-hidden font-sans"
      style={{ background: '#030712' }} // Deep dark background
    >
      {/* Cool tech grid overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-20" style={{
        backgroundImage: `
          linear-gradient(rgba(99, 102, 241, 0.2) 1px, transparent 1px), 
          linear-gradient(90deg, rgba(99, 102, 241, 0.2) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        backgroundPosition: 'center center'
      }} />

      {/* ══ HEADER ══════════════════════════════════════ */}
      <header
        className="relative z-10 flex-shrink-0 flex items-center justify-between px-6 py-3"
        style={{ borderBottom: '1px solid rgba(99,102,241,0.2)', background: 'rgba(3,7,18,0.8)', backdropFilter: 'blur(16px)' }}
      >
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-medium transition-colors text-indigo-400 hover:text-indigo-300"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            নোডঅন-কমার্স
          </Link>
          <div style={{ width: 1, height: 18, background: 'rgba(99,102,241,0.3)' }} />
          <div>
            <p className="text-white font-bold text-sm leading-none">সমাধান আর্কিটেকচার</p>
            <p className="text-xs mt-0.5 text-indigo-500/70">
              এজ-ফার্স্ট মেশ নেটওয়ার্ক — ইন্টারেক্টিভ প্রেজেন্টেশন
            </p>
          </div>
        </div>

        {/* Step dots */}
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5 items-center">
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setStepIdx(i)}
                title={STEPS[i].title}
                style={{
                  height: 8,
                  width: i === stepIdx ? 24 : 8,
                  borderRadius: 999,
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  background: i === stepIdx ? '#4f46e5' : i < stepIdx ? 'rgba(99,102,241,0.5)' : 'rgba(99,102,241,0.15)',
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>
          <span className="text-xs tabular-nums text-indigo-400/70">
            {stepIdx + 1} / {STEPS.length}
          </span>
          <kbd
            className="hidden md:inline text-xs px-2 py-0.5 rounded border border-indigo-500/30 bg-indigo-500/10 text-indigo-400"
          >
            F11 = ফুলস্ক্রিন
          </kbd>
        </div>
      </header>

      {/* ══ MAIN ════════════════════════════════════════ */}
      <div className="relative z-10 flex-1 flex overflow-hidden min-h-0">

        {/* ── FLOWCHART AREA ─────────────────────────── */}
        <div className="flex-1 overflow-y-auto py-8 px-12 flex flex-col items-center relative">
          
          {/* Animated Background Glows */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Current step label */}
          <div className="w-full max-w-4xl mb-12 self-start flex items-start gap-4 slide-up" key={step.id}>
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold flex-shrink-0 mt-0.5 border border-indigo-500/40 bg-indigo-500/20 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              {isPlaying && (
                <span className="w-2 h-2 rounded-full bg-indigo-400 inline-block pulse-dot" />
              )}
              {step.badge}
            </div>
            <div>
              <h2 className="text-white font-black text-2xl leading-none">{step.title}</h2>
              <p className="text-sm mt-1.5 text-indigo-300/70">{step.titleSub}</p>
            </div>
          </div>

          <div className="relative w-full max-w-4xl flex-1 flex flex-col items-center justify-center mt-[-2rem]">
            
            {/* ── LEGACY PHASE (Fades out) ── */}
            <div 
              className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000"
              style={{ 
                opacity: step.phase === 0 ? 1 : 0, 
                pointerEvents: step.phase === 0 ? 'auto' : 'none',
                transform: step.phase === 0 ? 'scale(1)' : 'scale(1.1)'
              }}
            >
              <div className="grid grid-cols-3 gap-6 w-full max-w-3xl">
                {(['c1', 'c2', 'c3'] as NodeId[]).map(id => (
                  <FlowNode key={id} id={id} active={isActive(id)} hovered={isHovered(id)} onHover={onHover} onClick={onNodeClick} />
                ))}
              </div>
              <p className="mt-8 text-slate-500 text-sm font-medium tracking-widest uppercase opacity-60">ভাঙা সেন্ট্রালাইজড মডেল</p>
            </div>

            {/* ── NEW CORE TECH PHASE (Fades in, then moves up) ── */}
            <div 
              className="w-full max-w-4xl flex flex-col items-center transition-all duration-1000"
              style={{
                opacity: step.phase > 0 ? 1 : 0,
                transform: step.phase === 1 ? 'translateY(20vh)' : (step.phase >= 2 ? 'translateY(0)' : 'translateY(40vh)'),
                pointerEvents: step.phase > 0 ? 'auto' : 'none'
              }}
            >
              
              {/* Horizontal Flow Map */}
              <div className="w-full flex items-center justify-between relative px-4 py-8">
                
                {/* Connecting Line (Base) */}
                <div className="absolute top-1/2 left-10 right-10 h-1 bg-slate-800 -translate-y-1/2 rounded-full z-0" />
                
                {/* Animated Connection Line */}
                <div className="absolute top-1/2 left-10 right-10 h-1 -translate-y-1/2 rounded-full z-0 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 via-emerald-400 to-indigo-500 transition-all duration-1000"
                    style={{ 
                      width: isActive('delivery') ? '100%' : isActive('aco') ? '75%' : isActive('mesh') ? '50%' : isActive('edgeAi') ? '25%' : '0%',
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 2s linear infinite'
                    }} 
                  />
                </div>

                {/* Nodes */}
                {(['start', 'edgeAi', 'mesh', 'aco', 'delivery'] as NodeId[]).map((id, i) => (
                  <div key={id} className="relative z-10 w-40 flex flex-col items-center">
                    <div className="mb-4">
                      <FlowNode 
                        id={id} 
                        active={isActive(id)} 
                        hovered={isHovered(id)} 
                        onHover={onHover} 
                        onClick={onNodeClick} 
                        className="w-full"
                      />
                    </div>
                    {/* Step indicator below node */}
                    <div 
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all duration-500 ${
                        isActive(id) 
                          ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_10px_rgba(99,102,241,0.5)]' 
                          : 'bg-slate-900 border-slate-700 text-slate-500'
                      }`}
                    >
                      {i + 1}
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* ── IMPACT PHASE (Fades in at the end) ── */}
            <div 
              className="w-full max-w-3xl mt-12 transition-all duration-1000"
              style={{
                opacity: step.phase === 3 ? 1 : 0,
                transform: step.phase === 3 ? 'translateY(0)' : 'translateY(20px)',
                pointerEvents: step.phase === 3 ? 'auto' : 'none'
              }}
            >
              <div className="text-center mb-6">
                <h3 className="text-emerald-400 font-bold text-lg">সিস্টেম ইফেক্টস</h3>
                <p className="text-slate-400 text-sm">এজ-ফার্স্ট আর্কিটেকচার ব্যবসাগুলো রক্ষা করে</p>
              </div>
              <div className="grid grid-cols-3 gap-6">
                {(['impact1', 'impact2', 'impact3'] as NodeId[]).map(id => (
                  <FlowNode key={id} id={id} active={isActive(id)} hovered={isHovered(id)} onHover={onHover} onClick={onNodeClick} />
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ── SPEECH SIDEBAR ─────────────────────────── */}
        <div
          className="flex-shrink-0 flex flex-col overflow-hidden w-[320px] border-l border-white/5 bg-slate-950/80 backdrop-blur-xl relative z-20"
        >
          <div className="flex-1 overflow-y-auto p-6 space-y-6">

            {/* Step info */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                {step.badge}
              </span>
              <h2 className="text-white font-black text-xl mt-1.5 leading-tight">{step.title}</h2>
              <p className="text-sm mt-1 text-slate-400">{step.titleSub}</p>
            </div>

            {/* Speech script */}
            <div
              className="rounded-2xl p-5 border border-indigo-500/20 bg-indigo-500/5 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs">🎙️</div>
                  <span className="text-xs font-bold text-indigo-300">প্রেজেন্টেশন স্ক্রিপ্ট</span>
                </div>
                <p className="text-base leading-relaxed text-slate-200 font-medium" key={step.id} style={{ animation: 'slide-up 0.4s ease-out' }}>
                  {step.speech}
                </p>
              </div>
            </div>

            {/* Stat Box */}
            <div className={`transition-all duration-500 ${step.stat ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
              {step.stat && (
                <div className="rounded-2xl p-4 border border-emerald-500/30 bg-emerald-500/10">
                  <p className="text-xs font-bold mb-1.5 text-emerald-400 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" /> মেট্রিক
                  </p>
                  <p className="text-lg font-bold leading-tight text-white">{step.stat}</p>
                </div>
              )}
            </div>

            {/* Hovered node details */}
            {hoveredNode && isActive(hoveredNode) && (
              <div
                className="rounded-2xl p-4 border border-slate-700 bg-slate-900/80 slide-up"
              >
                <p className="text-xs font-bold mb-2 text-slate-400 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-500" /> বিস্তারিত
                </p>
                <p className="text-sm font-bold text-white mb-1.5">{NODES[hoveredNode].label}</p>
                <p className="text-xs leading-relaxed text-slate-300">
                  {NODES[hoveredNode].tooltip}
                </p>
              </div>
            )}
            
            {/* CTA at end */}
            {stepIdx === STEPS.length - 1 && (
              <div className="pt-4 slide-up">
                <Link href="/" className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-black font-bold text-sm hover:bg-slate-200 transition-colors">
                  হোমে ফিরে যান <ArrowLeft className="w-4 h-4 rotate-180" />
                </Link>
              </div>
            )}
          </div>

          {/* ─ CONTROLS ─────────────────────────────── */}
          <div
            className="flex-shrink-0 p-5 border-t border-white/5 bg-slate-950"
          >
            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-2 text-slate-500">
                <span>প্রেজেন্টেশন অগ্রগতি</span>
                <span className="font-medium text-indigo-400">{progressPct}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400"
                  style={{
                    width: `${progressPct}%`,
                    transition: 'width 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />
              </div>
            </div>

            {/* Nav buttons */}
            <div className="flex gap-2">
              <button
                onClick={reset}
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="রিসেট"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={goPrev}
                disabled={stepIdx === 0}
                className="flex-1 h-10 rounded-xl flex items-center justify-center gap-1.5 text-sm font-medium border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-30 transition-colors"
              >
                <SkipBack className="w-4 h-4" /> পিছনে
              </button>

              <button
                onClick={() => setIsPlaying(p => !p)}
                className="flex-1 h-10 rounded-xl flex items-center justify-center gap-1.5 text-sm font-bold text-white shadow-lg transition-all"
                style={{
                  background: isPlaying ? '#334155' : 'linear-gradient(135deg, #4f46e5, #6366f1)',
                  border: isPlaying ? '1px solid #475569' : 'none',
                }}
              >
                {isPlaying
                  ? <><Pause className="w-4 h-4" /> পজ</>
                  : <><Play className="w-4 h-4" /> প্লে</>
                }
              </button>

              <button
                onClick={goNext}
                disabled={stepIdx === STEPS.length - 1}
                className="flex-1 h-10 rounded-xl flex items-center justify-center gap-1.5 text-sm font-medium border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-30 transition-colors"
              >
                সামনে <SkipForward className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
