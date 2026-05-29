import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Solution — NodeonCommerce',
  description: 'How NodeonCommerce solves Bangladesh\'s logistics crisis with Hybrid AI, ACO routing, and hyperlocal P2P nodes.',
};

export default function SolutionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
