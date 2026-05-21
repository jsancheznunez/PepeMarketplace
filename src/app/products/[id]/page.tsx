import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import db from '@/lib/db';
import AddToCartSection from '@/components/AddToCartSection';

async function getProduct(id: string) {
  const stmt = db.prepare('SELECT * FROM products WHERE id = ?');
  return stmt.get(id) as any;
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  if (!product) return notFound();

  return (
    <div className="container" style={{ padding: '60px 24px' }}>
      <Link href="/products" className="text-secondary" style={{ display: 'inline-block', marginBottom: '24px', fontWeight: 600 }}>
        &larr; Back to Menu
      </Link>
      
      <div className="card flex" style={{ flexDirection: 'row', gap: '40px', padding: '40px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '300px', position: 'relative', aspectRatio: '1/1', backgroundColor: '#f5f5f5', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          <Image 
            src={product.image} 
            alt={product.name} 
            fill 
            style={{ objectFit: 'contain' }} 
          />
        </div>
        <div style={{ flex: 1, minWidth: '300px', padding: '24px 0' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{product.name}</h1>
          <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)', display: 'block', marginBottom: '24px' }}>
            ${product.price.toFixed(2)}
          </span>
          <p className="text-secondary" style={{ fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '32px' }}>
            {product.description}
          </p>
          
          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', marginBottom: '32px' }} />
          
          <AddToCartSection product={product} />
        </div>
      </div>
    </div>
  );
}
