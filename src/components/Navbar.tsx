'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const { cartCount } = useCart();

  return (
    <header style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="container flex items-center justify-between" style={{ height: '80px' }}>
        <Link href="/" className="text-primary" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
          Pepe Marketplace 🛒
        </Link>
        
        <nav className="flex gap-6 items-center">
          <Link href="/products" style={{ fontWeight: 600 }}>Menu</Link>
          <Link href="/cart" className="btn btn-primary">
            Cart ({cartCount})
          </Link>
        </nav>
      </div>
    </header>
  );
}
