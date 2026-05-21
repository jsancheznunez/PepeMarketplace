// src/app/products/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import db from '@/lib/db';

async function getProducts() {
  const stmt = db.prepare('SELECT * FROM products');
  return stmt.all() as any[];
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="container" style={{ padding: '60px 24px' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '40px', textAlign: 'center' }}>Our Full Menu</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '32px' }}>
        {products.map((product) => (
          <div key={product.id} className="card flex-col" style={{ display: 'flex', flexDirection: 'column' }}>
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
              <div className="flex items-center justify-between mt-auto">
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)' }}>${product.price.toFixed(2)}</span>
                <Link href={`/products/${product.id}`} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
