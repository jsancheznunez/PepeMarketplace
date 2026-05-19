import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const stmt = db.prepare(`
      SELECT o.*, json_group_array(json_object(
        'product_id', oi.product_id,
        'quantity', oi.quantity,
        'price_at_time', oi.price_at_time,
        'name', p.name
      )) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `);
    
    const orders = stmt.all().map((order: any) => ({
      ...order,
      items: JSON.parse(order.items)
    }));
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      customer_name, 
      customer_email, 
      customer_phone, 
      shipping_address, 
      payment_method, 
      items 
    } = body;

    if (!items || !items.length) {
      return NextResponse.json({ error: 'Order must contain items' }, { status: 400 });
    }

    // Calculate total price based on current DB prices to be safe
    const ids = items.map((item: any) => item.product_id).join(',');
    const productStmt = db.prepare(`SELECT id, price FROM products WHERE id IN (${ids})`);
    const dbProducts = productStmt.all() as { id: number, price: number }[];
    
    let total_price = 0;
    const finalItems = items.map((item: any) => {
      const dbProduct = dbProducts.find(p => p.id === item.product_id);
      if (!dbProduct) throw new Error(`Product ${item.product_id} not found`);
      total_price += dbProduct.price * item.quantity;
      return {
        ...item,
        price_at_time: dbProduct.price
      };
    });

    const insertOrder = db.prepare(`
      INSERT INTO orders (customer_name, customer_email, customer_phone, shipping_address, total_price, payment_method)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const insertOrderItem = db.prepare(`
      INSERT INTO order_items (order_id, product_id, quantity, price_at_time)
      VALUES (?, ?, ?, ?)
    `);

    db.transaction(() => {
      const orderResult = insertOrder.run(
        customer_name, 
        customer_email, 
        customer_phone, 
        shipping_address, 
        total_price, 
        payment_method
      );
      
      for (const item of finalItems) {
        insertOrderItem.run(orderResult.lastInsertRowid, item.product_id, item.quantity, item.price_at_time);
      }
    })();

    return NextResponse.json({ success: true, message: 'Order created successfully' }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create order:', error);
    return NextResponse.json({ error: error.message || 'Failed to create order' }, { status: 500 });
  }
}
