'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="container text-center" style={{ padding: '100px 24px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '24px' }}>Your Cart is Empty</h1>
        <p className="text-secondary mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link href="/products" className="btn btn-primary">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '60px 24px' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '40px' }}>Shopping Cart</h1>
      
      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        <div style={{ flex: '2 1 600px' }}>
          {cart.map(item => (
            <div key={item.id} className="card flex items-center justify-between" style={{ padding: '24px', marginBottom: '16px' }}>
              <div className="flex items-center gap-4">
                <div style={{ width: '80px', height: '80px', position: 'relative', borderRadius: '8px', overflow: 'hidden' }}>
                  <Image src={item.image} alt={item.name} fill style={{ objectFit: 'contain' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{item.name}</h3>
                  <span className="text-primary font-bold">${item.price.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center border" style={{ borderRadius: 'var(--radius-sm)', borderColor: 'var(--color-border)', overflow: 'hidden' }}>
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ padding: '8px 12px', backgroundColor: 'var(--color-surface)' }}>-</button>
                  <div style={{ padding: '8px 16px', fontWeight: 600, borderLeft: '1px solid var(--color-border)', borderRight: '1px solid var(--color-border)' }}>{item.quantity}</div>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ padding: '8px 12px', backgroundColor: 'var(--color-surface)' }}>+</button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-primary font-bold ml-4" style={{ opacity: 0.8 }}>Remove</button>
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ flex: '1 1 300px' }}>
          <div className="card" style={{ padding: '32px', position: 'sticky', top: '100px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Order Summary</h2>
            <div className="flex justify-between mb-4">
              <span className="text-secondary">Subtotal</span>
              <span style={{ fontWeight: 600 }}>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="text-secondary">Shipping</span>
              <span style={{ fontWeight: 600 }}>Free</span>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '16px 0' }} />
            <div className="flex justify-between mb-8">
              <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>Total</span>
              <span className="text-primary" style={{ fontWeight: 700, fontSize: '1.5rem' }}>${cartTotal.toFixed(2)}</span>
            </div>
            
            <Link href="/checkout" className="btn btn-primary w-full" style={{ padding: '16px' }}>Proceed to Checkout</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
