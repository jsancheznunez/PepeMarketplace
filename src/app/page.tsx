import Image from 'next/image';
import Link from 'next/link';
import db from '@/lib/db';

async function getFeaturedProducts() {
  const stmt = db.prepare('SELECT * FROM products LIMIT 6');
  return stmt.all() as any[];
}

export default async function Home() {
  const products = await getFeaturedProducts();

  return (
    <div>
      {/* Hero Section */}
      <section style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '80px 24px', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: '3.5rem', marginBottom: '16px', color: 'white', lineHeight: 1.1 }}>Welcome to Pepe Marketplace</h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.9, marginBottom: '32px' }}>Delicious food delivered to your door.</p>
          <div className="flex gap-4 justify-center" style={{ justifyContent: 'center' }}>
            <Link href="/products" className="btn btn-secondary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
              Order Now
            </Link>
            <Link href="/products" className="btn btn-outline" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', padding: '16px 32px', fontSize: '1.1rem' }}>
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mt-8 mb-8" style={{ padding: '60px 24px' }}>
        <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '40px' }}>Featured Items</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '32px' }}>
          {products.map((product) => (
            <div key={product.id} className="card flex-col" style={{ display: 'flex' }}>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', backgroundColor: '#f5f5f5' }}>
                <Image 
                  src={product.image} 
                  alt={product.name} 
                  fill 
                  style={{ objectFit: 'contain' }} 
                />
              </div>
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>{product.name}</h3>
                <p className="text-secondary" style={{ fontSize: '0.9rem', marginBottom: '16px', flex: 1 }}>{product.description}</p>
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)' }}>${product.price.toFixed(2)}</span>
                  <Link href={`/products/${product.id}`} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex mt-8" style={{ justifyContent: 'center', marginTop: '48px' }}>
          <Link href="/products" className="btn btn-primary" style={{ padding: '12px 32px' }}>View Full Menu</Link>
        </div>
      </section>
    </div>
  );
}
