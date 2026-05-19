import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const stmt = db.prepare('SELECT * FROM products');
    const products = stmt.all();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
