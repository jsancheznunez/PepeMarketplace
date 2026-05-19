import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { price, description } = body;

    // Validate inputs
    if (price === undefined || typeof price !== 'number') {
      return NextResponse.json({ error: 'Invalid price' }, { status: 400 });
    }
    if (description === undefined || typeof description !== 'string') {
      return NextResponse.json({ error: 'Invalid description' }, { status: 400 });
    }

    const stmt = db.prepare('UPDATE products SET price = ?, description = ? WHERE id = ?');
    const result = stmt.run(price, description, id);

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}
