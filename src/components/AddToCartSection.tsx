'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function AddToCartSection({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart(product, quantity);
    alert(`Added ${quantity} to cart!`);
  };

  return (
    <div className="flex items-center gap-4 mt-8">
      <div className="flex items-center border" style={{ borderRadius: 'var(--radius-sm)', borderColor: 'var(--color-border)', overflow: 'hidden' }}>
        <button 
          onClick={() => setQuantity(q => Math.max(1, q - 1))}
          style={{ padding: '12px 16px', backgroundColor: 'var(--color-surface)' }}>-</button>
        <div style={{ padding: '12px 24px', fontWeight: 600, borderLeft: '1px solid var(--color-border)', borderRight: '1px solid var(--color-border)' }}>{quantity}</div>
        <button 
          onClick={() => setQuantity(q => q + 1)}
          style={{ padding: '12px 16px', backgroundColor: 'var(--color-surface)' }}>+</button>
      </div>
      <button onClick={handleAdd} className="btn btn-primary" style={{ flex: 1 }}>
        Add to Cart - ${(product.price * quantity).toFixed(2)}
      </button>
    </div>
  );
}
