import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'সমস্যা সিমুলেশন | নোডঅন-কমার্স — Logistics Crisis Flowchart',
  description: 'বাংলাদেশের কেন্দ্রীয়করণ-ভিত্তিক লজিস্টিক্স সিস্টেমের ব্যর্থতার ইন্টারেক্টিভ ফ্লোচার্ট সিমুলেশন।',
};

export default function ProblemsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
