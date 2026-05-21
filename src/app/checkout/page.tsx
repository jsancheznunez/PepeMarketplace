'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', payment: 'credit'
  });
  const [loading, setLoading] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="container text-center" style={{ padding: '100px 24px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '24px' }}>Checkout Unvailable</h1>
        <p className="text-secondary mb-8">Your cart is empty.</p>
        <button onClick={() => router.push('/products')} className="btn btn-primary">Go to Menu</button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate payment processing delay
    await new Promise(r => setTimeout(r, 1000));

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          shipping_address: formData.address,
          payment_method: formData.payment,
          items: cart.map(item => ({ product_id: item.id, quantity: item.quantity }))
        })
      });

      if (!res.ok) throw new Error('Failed to create order');
      
      clearCart();
      alert('Order placed successfully! Thank you for shopping with Pepe Marketplace.');
      router.push('/');
    } catch (error) {
      alert('There was an error processing your order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '60px 24px', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '40px' }}>Checkout</h1>
      
      <div className="card" style={{ padding: '40px' }}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          <div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Contact Information</h2>
            <div className="flex gap-4 mb-4" style={{ flexWrap: 'wrap' }}>
              <input required type="text" placeholder="Full Name" className="input-field" style={{ flex: '1 1 200px' }} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input required type="email" placeholder="Email Address" className="input-field" style={{ flex: '1 1 200px' }} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <input required type="tel" placeholder="Phone Number" className="input-field w-full" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)' }} />

          <div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Shipping Address</h2>
            <textarea required placeholder="Full Shipping Address" className="input-field w-full" rows={3} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)' }} />

          <div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Payment Method</h2>
            <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
              <label className="flex items-center gap-2 card" style={{ padding: '16px', flex: '1 1 150px', cursor: 'pointer', borderColor: formData.payment === 'credit' ? 'var(--color-primary)' : 'var(--color-border)' }}>
                <input type="radio" name="payment" value="credit" checked={formData.payment === 'credit'} onChange={e => setFormData({...formData, payment: e.target.value})} />
                Credit/Debit Card
              </label>
              <label className="flex items-center gap-2 card" style={{ padding: '16px', flex: '1 1 150px', cursor: 'pointer', borderColor: formData.payment === 'paypal' ? 'var(--color-primary)' : 'var(--color-border)' }}>
                <input type="radio" name="payment" value="paypal" checked={formData.payment === 'paypal'} onChange={e => setFormData({...formData, payment: e.target.value})} />
                PayPal
              </label>
              <label className="flex items-center gap-2 card" style={{ padding: '16px', flex: '1 1 150px', cursor: 'pointer', borderColor: formData.payment === 'square' ? 'var(--color-primary)' : 'var(--color-border)' }}>
                <input type="radio" name="payment" value="square" checked={formData.payment === 'square'} onChange={e => setFormData({...formData, payment: e.target.value})} />
                Square
              </label>
            </div>
            {formData.payment === 'credit' && (
              <div className="mt-4 flex gap-4" style={{ flexWrap: 'wrap' }}>
                <input required type="text" placeholder="Card Number" className="input-field" style={{ flex: '2 1 200px' }} />
                <input required type="text" placeholder="MM/YY" className="input-field" style={{ flex: '1 1 80px' }} />
                <input required type="text" placeholder="CVC" className="input-field" style={{ flex: '1 1 80px' }} />
              </div>
            )}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)' }} />

          <div>
            <div className="flex justify-between mb-8">
              <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>Total to Pay:</span>
              <span className="text-primary" style={{ fontSize: '1.5rem', fontWeight: 700 }}>${cartTotal.toFixed(2)}</span>
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary w-full" style={{ padding: '16px', fontSize: '1.1rem' }}>
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
