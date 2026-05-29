'use client';

import React, { useState, useEffect, useCallback, memo } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

/* ═══════════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════════════ */

type NodeId =
  | 'r1' | 'r2' | 'r3'
  | 'start' | 'hub' | 'traffic' | 'delivery' | 'buyer'
  | 'returnLoop' | 'fail';

type NodeType = 'cause' | 'action' | 'bottleneck' | 'receiver' | 'return' | 'fail';

interface NodeDef {
  label: string;
  sublabel: string;
  emoji: string;
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
  impact: string | null;
}

/* ═══════════════════════════════════════════════════════════
   DATA: NODE DEFINITIONS
══════════════════════════════════════════════════════════════ */

const NODES: Record<NodeId, NodeDef> = {
  r1: {
    label: 'ব্লাইন্ড মেশিন লার্নিং',
    sublabel: 'কোনো লোকাল কন্টেক্সট নেই',
    emoji: '🤖',
    type: 'cause',
    tooltip: 'জাতীয় ML মডেলগুলো স্থানীয় ঘটনা সম্পর্কে সম্পূর্ণ অজ্ঞ। ক্যাম্পাস ফেস্ট, ঈদের ভিড়, আঞ্চলিক ছুটি — সব কিছুই অজানা। এর ফলে ৮০% ক্ষেত্রে মজুতের ভুল পূর্বাভাস দেওয়া হয়।',
  },
  r2: {
    label: 'বিচ্ছিন্ন রিসেলার নেটওয়ার্ক',
    sublabel: 'নোডগুলোর মধ্যে সমন্বয়হীনতা',
    emoji: '🏪',
    type: 'cause',
    tooltip: 'হাজার হাজার রিসেলার বিচ্ছিন্নভাবে কাজ করছে। এক নোডে অতিরিক্ত স্টক আছে, অন্য নোডে শূন্য — আর কেউ তা জানে না। বর্তমান সিস্টেমে কোনো P2P সমন্বয় নেই।',
  },
  r3: {
    label: 'প্রতিক্রিয়াশীল লজিস্টিক্স',
    sublabel: 'সমস্যার পরে কাজ, আগে নয়',
    emoji: '⏰',
    type: 'cause',
    tooltip: 'সিস্টেমটি কেবল সমস্যা হওয়ার পরেই সাড়া দেয়। কোনো প্রিডিক্টিভ ইঞ্জিন নেই — কেবল আগুন নেভানোর চেষ্টা। যখন ব্যবস্থা নেওয়া হয়, ততক্ষণে লাভ কমে যায়।',
  },
  start: {
    label: 'গ্রাহকের অর্ডার প্লেস',
    sublabel: 'যাত্রা শুরু',
    emoji: '📦',
    type: 'action',
    tooltip: 'গ্রাহক দ্রুত ডেলিভারি আশা করেন। কিন্তু তারা অজান্তেই একটি ভাঙা সিস্টেমের দীর্ঘ, কষ্টকর যাত্রায় প্রবেশ করছেন।',
  },
  hub: {
    label: 'সেন্ট্রাল হাব — ঢাকা',
    sublabel: 'অযথা রাউটিং → ঢাকা হাব',
    emoji: '🏢',
    type: 'bottleneck',
    tooltip: 'এমনকি যখন স্থানীয় মজুত থাকে, প্রতিটি অর্ডার প্রথমে ঢাকায় পাঠানো হয়। বুড়িচং থেকে একটি অর্ডার অকারণে ১০০+ কিমি যাতায়াত করে। একটি সম্পূর্ণ অপ্রয়োজনীয় ধাপ।',
  },
  traffic: {
    label: 'ঢাকার যানজটে আটকে পড়া',
    sublabel: '৬.৪ কিমি/ঘণ্টা গড় গতি — ধীরগতির শহর',
    emoji: '🚗',
    type: 'bottleneck',
    tooltip: 'ঢাকার গড় গতি ৬.৪ কিমি/ঘণ্টা — বিশ্বের অন্যতম ধীরগতির শহর। শুধু এই একটি কারণেই প্রতিটি ডেলিভারিতে ৪-৮ ঘণ্টা নষ্ট হয় এবং কুরিয়ার খরচ বহুগুণ বেড়ে যায়।',
  },
  delivery: {
    label: 'যন্ত্রণাদায়ক ধীর ডেলিভারি',
    sublabel: '৩ থেকে ৭ দিন — ৪০-৬০% লভ্যাংশ নষ্ট',
    emoji: '😩',
    type: 'bottleneck',
    tooltip: 'ডেলিভারি হতে ৩-৭ দিন সময় লাগে। কুরিয়ার চার্জ আকাশচুম্বী। প্রতিটি ডেলিভারি বিক্রেতার ৪০-৬০% লভ্যাংশ নষ্ট করে দেয়। আর প্রতিদিন লক্ষ লক্ষ অর্ডারে এমনটি ঘটছে।',
  },
  buyer: {
    label: 'অবশেষে গ্রাহকের হাতে পৌঁছায়',
    sublabel: 'কয়েকদিনের অপেক্ষার পর',
    emoji: '👤',
    type: 'receiver',
    tooltip: 'কয়েকদিন অপেক্ষার পর, গ্রাহক অবশেষে পণ্যটি পান। কিন্তু যদি পণ্যে কোনো সমস্যা থাকে — তবে আসল দুঃস্বপ্ন শুরু হয়। ৩০-৪৫% অর্ডারে এমনটি ঘটে।',
  },
  returnLoop: {
    label: 'রিটার্ন প্রসেস → আবার হাব',
    sublabel: 'দুঃস্বপ্ন রিটার্ন: আরও ৭-১৪ দিন',
    emoji: '🔄',
    type: 'return',
    tooltip: 'রিটার্ন মানে আবার শুরু থেকে — আবার ঢাকা, আবার যানজট, আরও ৭-১৪ দিন। অনেক গ্রাহক কেবল রিটার্ন করার আশা ছেড়েই দেন। উভয় পক্ষেরই ক্ষতি।',
  },
  fail: {
    label: 'সম্পূর্ণ লভ্যাংশ ধ্বংস',
    sublabel: 'প্রতিদিন লক্ষ লক্ষ টাকার ক্ষতি — ৩০% বিক্রেতা বন্ধ',
    emoji: '💀',
    type: 'fail',
    tooltip: 'চূড়ান্ত ফলাফল: প্রতিদিন লক্ষ লক্ষ টাকার ক্ষতি। ৩০% ছোট বিক্রেতা এক বছরের মধ্যে তাদের ব্যবসা বন্ধ করতে বাধ্য হয়। এটাই কেন্দ্রীভূত মডেলের ব্যর্থতা।',
  },
};

/* ═══════════════════════════════════════════════════════════
   DATA: PRESENTATION STEPS
══════════════════════════════════════════════════════════════ */

const STEPS: Step[] = [
  {
    id: 'intro',
    active: [],
    badge: 'ভূমিকা',
    title: 'বাংলাদেশের লজিস্টিক্স সংকট',
    titleSub: 'ভাঙা সেন্ট্রালাইজড মডেলের একটি ইন্টারেক্টিভ সিমুলেশন',
    speech: "এখানে দেখুন কেন বর্তমান ই-কমার্স মডেলটি মূলত ভাঙা।", // ~2.5 sec
    impact: null,
  },
  {
    id: 'causes',
    active: ['r1', 'r2', 'r3'],
    badge: 'ধাপ ১ / ৭',
    title: 'তিনটি মূল কারণ',
    titleSub: 'সিস্টেমটি কেন মৌলিকভাবে ত্রুটিপূর্ণ',
    speech: "এটি ব্লাইন্ড এআই, অগোছালো নেটওয়ার্ক এবং প্রতিক্রিয়াশীল লজিস্টিক্সের ওপর নির্ভরশীল।", // ~3 sec
    impact: 'এই তিনটি কারণ মিলে পুরো সিস্টেমটিকে কাঠামোগতভাবে দুর্বল করে তোলে',
  },
  {
    id: 'order',
    active: ['r1', 'r2', 'r3', 'start'],
    badge: 'ধাপ ২ / ৭',
    title: 'গ্রাহকের অর্ডার প্লেস',
    titleSub: 'ভাঙা সিস্টেমে যাত্রা শুরু',
    speech: "যখন একজন স্থানীয় গ্রাহক অর্ডার করেন...", // ~1.5 sec
    impact: null,
  },
  {
    id: 'hub',
    active: ['r1', 'r2', 'r3', 'start', 'hub'],
    badge: 'ধাপ ৩ / ৭',
    title: 'ঢাকা হাবে অযথা রাউটিং',
    titleSub: '১০০+ কিমি অপ্রয়োজনীয় যাতায়াত',
    speech: "...এটি অকারণে ঢাকার একটি সেন্ট্রাল হাবে পাঠানো হয়।", // ~3 sec
    impact: 'প্রতিটি অর্ডারে ১০০+ কিমি অপ্রয়োজনীয় যাতায়াত যোগ করা হয়',
  },
  {
    id: 'traffic',
    active: ['r1', 'r2', 'r3', 'start', 'hub', 'traffic'],
    badge: 'ধাপ ৪ / ৭',
    title: "ঢাকার যানজটে আটকে পড়া",
    titleSub: '৪-৮ ঘণ্টা নষ্ট। কুরিয়ার খরচ ৩ গুণ বেশি।',
    speech: "যেখানে এটি শহরের যানজটে পুরোপুরি স্থবির হয়ে পড়ে।", // ~2.5 sec
    impact: 'গড় অতিরিক্ত বিলম্ব: ৪-৮ ঘণ্টা  •  কুরিয়ার খরচ: ৩ গুণ বৃদ্ধি',
  },
  {
    id: 'delivery',
    active: ['r1', 'r2', 'r3', 'start', 'hub', 'traffic', 'delivery'],
    badge: 'ধাপ ৫ / ৭',
    title: 'যন্ত্রণাদায়ক ধীর ডেলিভারি',
    titleSub: '৩-৭ দিন। লভ্যাংশ ৪০-৬০% কমে যায়।',
    speech: "ডেলিভারি হতে এক সপ্তাহ পর্যন্ত সময় লাগে, যা লাভের অংশ ধ্বংস করে দেয়।", // ~3 sec
    impact: 'ডেলিভারি সময়: ৩-৭ দিন  •  লভ্যাংশ ধ্বংস: ৪০-৬০% প্রতি অর্ডারে',
  },
  {
    id: 'buyer',
    active: ['r1', 'r2', 'r3', 'start', 'hub', 'traffic', 'delivery', 'buyer'],
    badge: 'ধাপ ৬ / ৭',
    title: 'প্যাকেজ অবশেষে গ্রাহকের কাছে পৌঁছায়',
    titleSub: 'অপেক্ষার কয়েক দিন — এবং কষ্টকর অভিজ্ঞতা হয়তো শেষ হয়নি',
    speech: "আর যদি পণ্যটি ক্ষতিগ্রস্ত হয়?", // ~1.5 sec
    impact: null,
  },
  {
    id: 'return',
    active: ['r1', 'r2', 'r3', 'start', 'hub', 'traffic', 'delivery', 'buyer', 'returnLoop'],
    badge: 'ধাপ ৭ / ৭',
    title: 'রিটার্ন করার দুঃস্বপ্ন',
    titleSub: 'আবার ঢাকা। আরও ৭-১৪ দিন। কোনো নিস্তার নেই।',
    speech: "দুঃস্বপ্নটির পুনরাবৃত্তি হয়। আরও দুই সপ্তাহের জন্য আবার ঢাকায়।", // ~3.5 sec
    impact: 'রিটার্ন হার: ৩০-৪৫%  •  অতিরিক্ত ৭-১৪ দিনের ব্যর্থতা',
  },
  {
    id: 'fail',
    active: ['r1', 'r2', 'r3', 'start', 'hub', 'traffic', 'delivery', 'buyer', 'returnLoop', 'fail'],
    badge: '💀 চূড়ান্ত ফলাফল',
    title: 'সম্পূর্ণ লভ্যাংশ ধ্বংস',
    titleSub: 'প্রতিদিন লক্ষ লক্ষ ক্ষতি। প্রতি বছর ৩০% বিক্রেতা বন্ধ হয়ে যায়।',
    speech: "ফলাফল? প্রতিদিন লক্ষ লক্ষ টাকার ক্ষতি এবং সম্পূর্ণ লভ্যাংশ ধ্বংস।", // ~3 sec
    impact: 'প্রতিদিন লক্ষ লক্ষ ক্ষতি  •  প্রতি বছর ৩০% বিক্রেতা ব্যবসা বন্ধ করতে বাধ্য',
  },
];
/* ═══════════════════════════════════════════════════════════
   STYLE HELPERS
══════════════════════════════════════════════════════════════ */

const NODE_COLORS: Record<NodeType, { border: string; bg: string; glow: string; label: string; sub: string }> = {
  cause: { border: '#f87171', bg: 'rgba(153,27,27,0.45)', glow: '0 0 24px rgba(248,113,113,0.35)', label: '#fca5a5', sub: 'rgba(252,165,165,0.55)' },
  action: { border: '#fb923c', bg: 'rgba(124,45,18,0.45)', glow: '0 0 24px rgba(251,146,60,0.3)', label: '#fdba74', sub: 'rgba(253,186,116,0.5)' },
  bottleneck: { border: '#ef4444', bg: 'rgba(127,29,29,0.55)', glow: '0 0 28px rgba(239,68,68,0.35)', label: '#fca5a5', sub: 'rgba(252,165,165,0.5)' },
  receiver: { border: '#94a3b8', bg: 'rgba(30,41,59,0.55)', glow: '0 0 20px rgba(148,163,184,0.2)', label: '#e2e8f0', sub: 'rgba(226,232,240,0.5)' },
  return: { border: '#fb7185', bg: 'rgba(136,19,55,0.45)', glow: '0 0 24px rgba(251,113,133,0.3)', label: '#fda4af', sub: 'rgba(253,164,175,0.5)' },
  fail: { border: '#ef4444', bg: 'rgba(127,29,29,0.65)', glow: '0 0 40px rgba(239,68,68,0.45)', label: '#fecaca', sub: 'rgba(254,202,202,0.6)' },
};

const INACTIVE = { border: 'rgba(127,29,29,0.25)', bg: 'rgba(8,0,0,0.3)', label: 'rgba(71,85,105,0.35)', sub: 'rgba(71,85,105,0.2)' };

/* ═══════════════════════════════════════════════════════════
   SUB-COMPONENTS
══════════════════════════════════════════════════════════════ */

const FlowNode = memo(function FlowNode({
  id, active, hovered, onHover, onClick, diamond = false, className = '',
}: {
  id: NodeId; active: boolean; hovered: boolean;
  onHover: (id: NodeId | null) => void;
  onClick: (id: NodeId) => void;
  diamond?: boolean; className?: string;
}) {
  const cfg = NODES[id];
  const c = active ? NODE_COLORS[cfg.type] : INACTIVE;
  const lift = hovered && active;

  return (
    <div
      className={`relative border-2 rounded-2xl px-4 py-3 cursor-pointer select-none ${className}`}
      style={{
        borderColor: c.border,
        background: c.bg,
        boxShadow: lift ? NODE_COLORS[cfg.type].glow : (active ? '0 2px 12px rgba(0,0,0,0.5)' : 'none'),
        opacity: active ? 1 : 0.2,
        transform: lift ? 'scale(1.04) translateY(-1px)' : 'scale(1)',
        transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
        clipPath: diamond
          ? 'polygon(16px 0%, calc(100% - 16px) 0%, 100% 50%, calc(100% - 16px) 100%, 16px 100%, 0% 50%)'
          : undefined,
      }}
      onMouseEnter={() => active && onHover(id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(id)}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl flex-shrink-0" style={{ transform: lift ? 'scale(1.25)' : 'scale(1)', transition: 'transform 0.3s ease', display: 'block' }}>
          {cfg.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-sm leading-tight" style={{ color: c.label, transition: 'color 0.4s' }}>
            {cfg.label}
          </p>
          <p className="text-xs mt-0.5 leading-tight" style={{ color: c.sub, transition: 'color 0.4s' }}>
            {cfg.sublabel}
          </p>
        </div>
      </div>

      {/* Hover tooltip */}
      {hovered && active && (
        <div
          className="absolute z-50 bottom-full left-0 mb-2 w-64 p-3 rounded-xl text-xs leading-relaxed pointer-events-none"
          style={{ background: '#0f172a', border: '1px solid rgba(51,65,85,0.7)', boxShadow: '0 16px 48px rgba(0,0,0,0.8)', color: '#cbd5e1' }}
        >
          {cfg.tooltip}
          <div style={{
            position: 'absolute', top: '100%', left: '1.25rem', width: 0, height: 0,
            borderLeft: '6px solid transparent', borderRight: '6px solid transparent',
            borderTop: '6px solid rgba(51,65,85,0.7)'
          }} />
        </div>
      )}
    </div>
  );
});

function FlowArrow({ show, label, dashed = false }: { show: boolean; label?: string; dashed?: boolean }) {
  return (
    <div className="flex flex-col items-center my-0.5" style={{ opacity: show ? 0.8 : 0.08, transition: 'opacity 0.5s' }}>
      {label && <span className="text-xs mb-1 font-medium" style={{ color: 'rgba(239,68,68,0.65)' }}>{label}</span>}
      {dashed
        ? <div style={{ width: 0, height: 28, borderLeft: '2px dashed rgba(239,68,68,0.55)' }} />
        : <div style={{ width: 2, height: 28, background: 'linear-gradient(to bottom, rgba(220,38,38,0.75), rgba(185,28,28,0.4))' }} />
      }
      <div style={{
        width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent',
        borderTop: `6px solid ${dashed ? 'rgba(239,68,68,0.5)' : 'rgba(220,38,38,0.75)'}`
      }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════ */

export default function ProblemsPage() {
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
    const t = setTimeout(goNext, 6500);
    return () => clearTimeout(t);
  }, [isPlaying, stepIdx, goNext]);

  const progressPct = Math.round((stepIdx / (STEPS.length - 1)) * 100);

  return (
    <div
      className="h-screen flex flex-col overflow-hidden font-sans"
      style={{ background: 'linear-gradient(160deg, #070000 0%, #110000 50%, #090000 100%)' }}
    >
      {/* Subtle red grid overlay */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(220,38,38,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.025) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      {/* ══ HEADER ══════════════════════════════════════ */}
      <header
        className="relative z-10 flex-shrink-0 flex items-center justify-between px-6 py-3"
        style={{ borderBottom: '1px solid rgba(127,29,29,0.4)', background: 'rgba(7,0,0,0.9)', backdropFilter: 'blur(16px)' }}
      >
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs transition-colors"
            style={{ color: 'rgba(153,27,27,0.65)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#f87171'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(153,27,27,0.65)'; }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            নোডঅন-কমার্স
          </Link>
          <div style={{ width: 1, height: 18, background: 'rgba(127,29,29,0.5)' }} />
          <div>
            <p className="text-white font-bold text-sm leading-none">সমস্যা সিমুলেশন</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(153,27,27,0.55)' }}>
              লজিস্টিক্স ক্রাইসিস — ইন্টারেক্টিভ প্রেজেন্টেশন
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
                  transition: 'all 0.3s',
                  background: i === stepIdx ? '#dc2626' : i < stepIdx ? 'rgba(185,28,28,0.7)' : 'rgba(127,29,29,0.25)',
                  border: i > stepIdx ? '1px solid rgba(127,29,29,0.4)' : 'none',
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>
          <span className="text-xs tabular-nums" style={{ color: 'rgba(153,27,27,0.55)' }}>
            {stepIdx + 1} / {STEPS.length}
          </span>
          <kbd
            className="hidden md:inline text-xs px-2 py-0.5 rounded"
            style={{ background: 'rgba(127,29,29,0.15)', border: '1px solid rgba(127,29,29,0.3)', color: 'rgba(153,27,27,0.5)' }}
          >
            F11 = ফুলস্ক্রিন
          </kbd>
        </div>
      </header>

      {/* ══ MAIN ════════════════════════════════════════ */}
      <div className="relative z-10 flex-1 flex overflow-hidden min-h-0">

        {/* ── FLOWCHART AREA ─────────────────────────── */}
        <div className="flex-1 overflow-y-auto py-5 px-8 flex flex-col items-center">

          {/* Current step label */}
          <div className="w-full max-w-2xl mb-4 self-start flex items-start gap-3">
            <div
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold flex-shrink-0 mt-0.5"
              style={{ background: 'rgba(127,29,29,0.25)', border: '1px solid rgba(127,29,29,0.45)', color: '#f87171' }}
            >
              {isPlaying && (
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block pulse-dot" />
              )}
              {step.badge}
            </div>
            <div>
              <h2 className="text-white font-black text-lg leading-none">{step.title}</h2>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(153,27,27,0.5)' }}>{step.titleSub}</p>
            </div>
          </div>

          {/* ── CAUSE CARDS ── */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-2xl">
            {(['r1', 'r2', 'r3'] as NodeId[]).map(id => (
              <FlowNode key={id} id={id} active={isActive(id)} hovered={isHovered(id)} onHover={onHover} onClick={onNodeClick} />
            ))}
          </div>

          {/* Converging arrows (causes → order) */}
          <div className="w-full max-w-2xl" style={{ opacity: isActive('start') ? 0.75 : 0.07, transition: 'opacity 0.5s' }}>
            <svg width="100%" height="34" viewBox="0 0 600 34" preserveAspectRatio="none">
              <path d="M 100 0 C 100 17 300 17 300 34" stroke="#dc2626" strokeWidth="1.5" fill="none" strokeOpacity="0.9" />
              <path d="M 300 0 L 300 34" stroke="#dc2626" strokeWidth="1.5" fill="none" strokeOpacity="0.9" />
              <path d="M 500 0 C 500 17 300 17 300 34" stroke="#dc2626" strokeWidth="1.5" fill="none" strokeOpacity="0.9" />
              <polygon points="295,30 305,30 300,34" fill="#dc2626" fillOpacity="0.9" />
            </svg>
          </div>

          {/* ── ORDER ── */}
          <div className="w-full max-w-md">
            <FlowNode id="start" active={isActive('start')} hovered={isHovered('start')} onHover={onHover} onClick={onNodeClick} />
          </div>
          <FlowArrow show={isActive('hub')} label="→ অযথা রাউটিং" />

          {/* ── HUB ── */}
          <div className="w-full max-w-md">
            <FlowNode id="hub" active={isActive('hub')} hovered={isHovered('hub')} onHover={onHover} onClick={onNodeClick} />
          </div>
          <FlowArrow show={isActive('traffic')} />

          {/* ── TRAFFIC (diamond) ── */}
          <div className="w-full max-w-lg">
            <FlowNode id="traffic" active={isActive('traffic')} hovered={isHovered('traffic')} onHover={onHover} onClick={onNodeClick} diamond className="py-4 justify-center" />
          </div>
          <FlowArrow show={isActive('delivery')} label="কুরিয়ার খরচ আকাশচুম্বী" />

          {/* ── DELIVERY ── */}
          <div className="w-full max-w-md">
            <FlowNode id="delivery" active={isActive('delivery')} hovered={isHovered('delivery')} onHover={onHover} onClick={onNodeClick} />
          </div>
          <FlowArrow show={isActive('buyer')} />

          {/* ── BUYER + RETURN SIDE BRANCH ── */}
          <div className="w-full max-w-2xl flex items-start gap-3">
            <div className="flex-1">
              <FlowNode id="buyer" active={isActive('buyer')} hovered={isHovered('buyer')} onHover={onHover} onClick={onNodeClick} />
            </div>

            {/* Return loop branch */}
            <div
              className="flex-shrink-0 flex flex-col items-center"
              style={{ width: 200, opacity: isActive('returnLoop') ? 1 : 0.08, transition: 'opacity 0.6s' }}
            >
              <div className="self-start flex items-center gap-1 mb-1.5 ml-1">
                <div style={{ width: 44, height: 0, borderTop: '2px dashed rgba(251,113,133,0.6)' }} />
                <div style={{ width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '6px solid rgba(251,113,133,0.6)' }} />
                <span className="text-xs" style={{ color: 'rgba(251,113,133,0.55)', whiteSpace: 'nowrap' }}>রিটার্ন</span>
              </div>

              <FlowNode
                id="returnLoop"
                active={isActive('returnLoop')}
                hovered={isHovered('returnLoop')}
                onHover={onHover}
                onClick={onNodeClick}
                className="w-full"
              />

              <div className="flex flex-col items-center mt-2" style={{ opacity: 0.65 }}>
                <div style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderBottom: '6px solid rgba(239,68,68,0.55)' }} />
                <div style={{ width: 0, height: 32, borderLeft: '2px dashed rgba(239,68,68,0.4)' }} />
                <span className="text-xs text-center" style={{ color: 'rgba(239,68,68,0.4)' }}>আবার হাবে ↑</span>
              </div>
            </div>
          </div>

          {/* Converging arrows → FAIL */}
          <div
            className="w-full max-w-2xl my-1.5 flex justify-center"
            style={{ opacity: isActive('fail') ? 0.85 : 0.07, transition: 'opacity 0.6s' }}
          >
            <svg width="520" height="44" viewBox="0 0 520 44" preserveAspectRatio="none">
              <path d="M 110 2 L 110 22 L 260 42" stroke="#dc2626" strokeWidth="2.5" fill="none" strokeOpacity="0.85" />
              <path d="M 260 2 L 260 42" stroke="#dc2626" strokeWidth="3" fill="none" strokeOpacity="0.9" />
              <path d="M 410 2 L 410 22 L 260 42" stroke="#dc2626" strokeWidth="2.5" fill="none" strokeOpacity="0.85" />
              <polygon points="254,39 266,39 260,44" fill="#dc2626" fillOpacity="0.95" />
              {[
                { x: 60, label: 'যানজট' },
                { x: 220, label: 'ডেলিভারি' },
                { x: 375, label: 'রিটার্ন' },
              ].map((t, i) => (
                <text key={i} x={t.x} y="14" fill="#dc2626" fillOpacity="0.55" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                  {t.label}
                </text>
              ))}
            </svg>
          </div>

          {/* ── FAIL BANNER ── */}
          <div
            className="w-full max-w-2xl mb-10"
            style={{
              opacity: isActive('fail') ? 1 : 0.1,
              transform: isActive('fail') ? 'scale(1)' : 'scale(0.96)',
              transition: 'all 0.7s cubic-bezier(0.4,0,0.2,1)',
            }}
          >
            <div
              className="relative border-2 rounded-2xl overflow-hidden cursor-pointer"
              style={{
                borderColor: isActive('fail') ? '#ef4444' : '#450a0a',
                background: 'linear-gradient(135deg, #3b0000 0%, #7f1d1d 35%, #4c0519 65%, #3b0000 100%)',
                boxShadow: isActive('fail') ? '0 0 60px rgba(239,68,68,0.35), 0 0 120px rgba(239,68,68,0.12)' : 'none',
                transition: 'all 0.7s',
              }}
              onClick={() => onNodeClick('fail')}
              onMouseEnter={() => isActive('fail') && onHover('fail')}
              onMouseLeave={() => onHover(null)}
            >
              {/* Scan lines */}
              <div className="absolute inset-0 pointer-events-none" style={{
                background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(239,68,68,0.04) 3px, rgba(239,68,68,0.04) 4px)',
              }} />
              {isActive('fail') && (
                <div className="absolute inset-0 pointer-events-none pulse-dot" style={{
                  background: 'radial-gradient(ellipse at 50% 50%, rgba(239,68,68,0.15), transparent 70%)',
                }} />
              )}
              <div className="relative z-10 p-6 text-center">
                <div className="text-5xl mb-2 float-anim">💀</div>
                <h3 className="font-black text-xl mb-1" style={{ color: '#fecaca' }}>সম্পূর্ণ লভ্যাংশ ধ্বংস</h3>
                <p className="text-sm mb-4" style={{ color: 'rgba(252,165,165,0.6)' }}>
                  প্রতিদিন লক্ষ লক্ষ ক্ষতি এবং প্রতি বছর ৩০% বিক্রেতা বন্ধ
                </p>
                <div
                  className="grid grid-cols-3 gap-4 pt-3"
                  style={{ borderTop: '1px solid rgba(127,29,29,0.6)' }}
                >
                  {[
                    { val: 'লক্ষ লক্ষ ৳', sub: 'প্রতিদিন ক্ষতি' },
                    { val: '৩০%', sub: 'বিক্রেতা বন্ধ' },
                    { val: '৩-৭ দিন', sub: 'গড় ডেলিভারি' },
                  ].map((s, i) => (
                    <div key={i}>
                      <p className="font-bold text-lg" style={{ color: '#fca5a5' }}>{s.val}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'rgba(248,113,113,0.5)' }}>{s.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── SPEECH SIDEBAR ─────────────────────────── */}
        <div
          className="flex-shrink-0 flex flex-col overflow-hidden"
          style={{ width: 300, borderLeft: '1px solid rgba(127,29,29,0.35)', background: 'rgba(6,0,0,0.8)' }}
        >
          <div className="flex-1 overflow-y-auto p-5 space-y-4">

            {/* Step info */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'rgba(239,68,68,0.6)' }}>
                {step.badge}
              </span>
              <h2 className="text-white font-black text-base mt-1 leading-tight">{step.title}</h2>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(153,27,27,0.5)' }}>{step.titleSub}</p>
            </div>

            {/* Speech script */}
            <div
              className="rounded-2xl p-4 glass"
              style={{ background: 'rgba(127,29,29,0.15)', border: '1px solid rgba(127,29,29,0.4)' }}
            >
              <div className="flex items-center gap-2 mb-2.5">
                <span>🎙️</span>
                <span className="text-xs font-bold" style={{ color: 'rgba(239,68,68,0.6)' }}>প্রেজেন্টেশন স্ক্রিপ্ট</span>
              </div>
              <p className="text-sm leading-relaxed font-medium" style={{ color: '#cbd5e1' }}>{step.speech}</p>
            </div>

            {/* Impact stat */}
            {step.impact && (
              <div
                className="rounded-xl p-3 glass"
                style={{ background: 'rgba(120,53,15,0.2)', border: '1px solid rgba(180,83,9,0.38)' }}
              >
                <p className="text-xs font-bold mb-1" style={{ color: '#f59e0b' }}>📊 প্রভাব</p>
                <p className="text-sm font-semibold leading-relaxed" style={{ color: '#fcd34d' }}>{step.impact}</p>
              </div>
            )}

            {/* Hovered node details */}
            {hoveredNode && isActive(hoveredNode) && (
              <div
                className="rounded-xl p-3 glass"
                style={{ background: 'rgba(15,23,42,0.75)', border: '1px solid rgba(51,65,85,0.55)' }}
              >
                <p className="text-xs font-bold mb-1.5" style={{ color: 'rgba(100,116,139,0.8)' }}>ℹ️ নোডের বিবরণ</p>
                <p className="text-sm font-bold text-white">{NODES[hoveredNode].label}</p>
                <p className="text-xs mt-1.5 leading-relaxed" style={{ color: '#94a3b8' }}>
                  {NODES[hoveredNode].tooltip}
                </p>
              </div>
            )}

            {/* Keyboard guide */}
            <div
              className="rounded-xl p-3 grid grid-cols-2 gap-2 glass"
              style={{ background: 'rgba(127,29,29,0.08)', border: '1px solid rgba(127,29,29,0.2)' }}
            >
              <p className="col-span-2 text-xs font-bold mb-0.5" style={{ color: 'rgba(239,68,68,0.45)' }}>⌨️ কীবোর্ড শর্টকাট</p>
              {[
                ['← →', 'ন্যাভিগেট'],
                ['Space', 'পরবর্তী'],
                ['Esc', 'পজ'],
                ['Click', 'ধাপে যান'],
              ].map(([key, desc]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <kbd className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(127,29,29,0.2)', border: '1px solid rgba(127,29,29,0.35)', color: '#f87171' }}>
                    {key}
                  </kbd>
                  <span className="text-xs" style={{ color: 'rgba(148,163,184,0.6)' }}>{desc}</span>
                </div>
              ))}
            </div>

            {/* Solution teaser on final step */}
            {stepIdx === STEPS.length - 1 && (
              <div
                className="rounded-xl p-4 glass slide-up"
                style={{ background: 'linear-gradient(135deg, rgba(30,27,75,0.45), rgba(49,46,129,0.2))', border: '1px solid rgba(99,102,241,0.35)' }}
              >
                <p className="text-xs font-bold mb-1.5" style={{ color: '#818cf8' }}>✨ সমাধান রয়েছে</p>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(165,180,252,0.85)' }}>
                  নোডঅন-কমার্স লোকাল নোড, P2P মেশ নেটওয়ার্ক এবং এজ এআই ব্যবহার করে এই সমস্যাগুলোর সমাধান করে।
                </p>
                <Link
                  href="/solutions"
                  className="inline-flex items-center gap-1 mt-2.5 text-xs font-semibold transition-colors hover:underline"
                  style={{ color: '#818cf8' }}
                >
                  সমাধানটি দেখুন →
                </Link>
              </div>
            )}
          </div>

          {/* ─ CONTROLS ─────────────────────────────── */}
          <div
            className="flex-shrink-0 p-4 space-y-3"
            style={{ borderTop: '1px solid rgba(127,29,29,0.35)' }}
          >
            {/* Progress bar */}
            <div>
              <div className="flex justify-between text-xs mb-1.5" style={{ color: 'rgba(153,27,27,0.6)' }}>
                <span>অগ্রগতি</span>
                <span>{progressPct}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(127,29,29,0.25)' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${progressPct}%`,
                    background: 'linear-gradient(90deg, #991b1b, #ef4444)',
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>
            </div>

            {isPlaying && (
              <div
                className="rounded-xl px-3 py-2 flex items-center gap-2 text-xs glass"
                style={{ background: 'rgba(127,29,29,0.2)', border: '1px solid rgba(127,29,29,0.4)' }}
              >
                <div
                  className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 pulse-dot"
                />
                <div className="flex-1">
                  <div className="h-1 rounded-full bg-red-900/40 overflow-hidden">
                    <div
                      className="h-full bg-red-500/70 rounded-full"
                      style={{ animation: 'progress-step 6.5s linear forwards', width: '100%', transformOrigin: 'left' }}
                    />
                  </div>
                </div>
                <span style={{ color: 'rgba(239,68,68,0.6)' }}>অটো-প্লে</span>
              </div>
            )}

            {/* Nav buttons */}
            <div className="flex gap-2">
              <button
                onClick={reset}
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 metric-card"
                style={{ background: 'rgba(127,29,29,0.18)', border: '1px solid rgba(127,29,29,0.4)' }}
                title="রিসেট"
              >
                <RotateCcw className="w-3.5 h-3.5" style={{ color: 'rgba(239,68,68,0.6)' }} />
              </button>

              <button
                onClick={goPrev}
                disabled={stepIdx === 0}
                className="flex-1 h-9 rounded-xl flex items-center justify-center gap-1.5 text-sm font-medium disabled:opacity-20 metric-card"
                style={{ background: 'rgba(127,29,29,0.18)', border: '1px solid rgba(127,29,29,0.4)', color: 'rgba(252,165,165,0.75)' }}
              >
                <SkipBack className="w-3.5 h-3.5" /> পিছনে
              </button>

              <button
                onClick={() => setIsPlaying(p => !p)}
                className="flex-1 h-9 rounded-xl flex items-center justify-center gap-1.5 text-sm font-bold btn-primary"
                style={{
                  background: isPlaying
                    ? 'rgba(127,29,29,0.4)'
                    : 'linear-gradient(135deg, #991b1b, #dc2626)',
                  border: `1px solid ${isPlaying ? 'rgba(239,68,68,0.5)' : 'transparent'}`,
                  color: 'white',
                  transition: 'all 0.25s',
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
                className="flex-1 h-9 rounded-xl flex items-center justify-center gap-1.5 text-sm font-medium disabled:opacity-20 metric-card"
                style={{ background: 'rgba(127,29,29,0.18)', border: '1px solid rgba(127,29,29,0.4)', color: 'rgba(252,165,165,0.75)' }}
              >
                সামনে <SkipForward className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-center text-xs" style={{ color: 'rgba(127,29,29,0.4)' }}>
              ← → অ্যারো &nbsp;•&nbsp; Space = সামনে &nbsp;•&nbsp; Esc = পজ
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes progress-step {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }
      `}</style>
    </div>
  );
}
