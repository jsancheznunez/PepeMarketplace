'use client';

import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('orders');
  
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      setProducts(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      setOrders(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const handleUpdateProduct = async (id: number, price: number, description: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price, description })
      });
      if (res.ok) {
        alert('Product updated!');
        fetchProducts();
      } else {
        alert('Failed to update.');
      }
    } catch (e) {
      alert('Error updating.');
    }
  };

  return (
    <div className="container" style={{ padding: '60px 24px' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '40px' }}>Admin Dashboard</h1>
      
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setActiveTab('orders')} 
          className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-outline'}`}>
          Orders
        </button>
        <button 
          onClick={() => setActiveTab('products')} 
          className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-outline'}`}>
          Products
        </button>
      </div>

      {activeTab === 'orders' && (
        <div className="flex flex-col gap-4">
          <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Recent Orders</h2>
          {orders.length === 0 ? <p className="text-secondary">No orders found.</p> : orders.map(order => (
            <div key={order.id} className="card" style={{ padding: '24px' }}>
              <div className="flex justify-between items-center mb-4">
                <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>Order #{order.id}</span>
                <span className="text-secondary">{new Date(order.created_at + 'Z').toLocaleString()}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <p><strong>Customer:</strong> {order.customer_name}</p>
                  <p><strong>Email:</strong> {order.customer_email}</p>
                  <p><strong>Phone:</strong> {order.customer_phone}</p>
                </div>
                <div>
                  <p><strong>Address:</strong> {order.shipping_address}</p>
                  <p><strong>Payment:</strong> {order.payment_method}</p>
                  <p><strong>Total:</strong> <span className="text-primary font-bold">${order.total_price.toFixed(2)}</span></p>
                </div>
              </div>
              <div style={{ backgroundColor: 'var(--color-background)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
                <strong>Order Items:</strong>
                <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                  {order.items && order.items.map((item: any, i: number) => (
                    <li key={i} style={{ marginBottom: '4px' }}>
                      {item.quantity}x {item.name} <span className="text-secondary">(@ ${parseFloat(item.price_at_time).toFixed(2)})</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'products' && (
        <div className="flex flex-col gap-4">
          <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Manage Products</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
            {products.map(product => (
              <ProductEditor key={product.id} product={product} onSave={handleUpdateProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ProductEditor({ product, onSave }: { product: any, onSave: any }) {
  const [price, setPrice] = useState(product.price);
  const [desc, setDesc] = useState(product.description);

  return (
    <div className="card" style={{ padding: '24px' }}>
      <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>{product.name}</h3>
      <div className="flex gap-4 items-center mb-4">
        <span style={{ fontWeight: 600 }}>$</span>
        <input 
          type="number" 
          step="0.01" 
          className="input-field" 
          value={price} 
          onChange={e => setPrice(parseFloat(e.target.value))} 
        />
      </div>
      <textarea 
        rows={4} 
        className="input-field w-full mb-4" 
        value={desc} 
        onChange={e => setDesc(e.target.value)}
      />
      <button 
        onClick={() => onSave(product.id, price, desc)}
        className="btn btn-secondary w-full">
        Save Changes
      </button>
    </div>
  );
}
