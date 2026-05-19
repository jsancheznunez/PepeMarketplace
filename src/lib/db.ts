import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'marketplace.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    image TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    shipping_address TEXT NOT NULL,
    total_price REAL NOT NULL,
    payment_method TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price_at_time REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  );
`);

// Seed products if empty
const countStmt = db.prepare('SELECT COUNT(*) as count FROM products');
const row = countStmt.get() as { count: number };

if (row.count === 0) {
  const insertStmt = db.prepare(`
    INSERT INTO products (name, description, price, image)
    VALUES (?, ?, ?, ?)
  `);

  const initialProducts = [
    {
      name: 'Hida Homemade Fried Tomato Sauce, Gluten-Free, Vegan, 465g (16.4oz) Pack of 12',
      description: 'Authentic Spanish homemade fried tomato sauce. Gluten-free and vegan.',
      price: 6.99,
      image: '/images/MataPack12.jpg'
    },
    {
      name: 'El Maragato Asturian Fabada Dry Beans 2.2 lb (1 kilo) Pack of 10',
      description: 'Premium quality dry beans perfect for authentic Asturian Fabada.',
      price: 12.99,
      image: '/images/Fabada.png'
    },
    {
      name: 'El Maragato Mammoth Judion Beans 1.9 lb (900gr) Pack of 10',
      description: 'Giant, butter-soft white beans from Spain. Ideal for hearty stews.',
      price: 14.50,
      image: '/images/Judion.png'
    },
    {
      name: 'Cola Cao Original Chocolate Drink Mix (13.76 oz Each)',
      description: "Spain's favorite chocolate drink mix. Delicious hot or cold.",
      price: 8.99,
      image: '/images/product-4.png'
    },
    {
      name: 'Mata Fried Tomato Sauce with Olive Oil Gluten Free,No Preservatives 13oz (6-pack)',
      description: 'Classic fried tomato sauce made with extra virgin olive oil. 6-pack.',
      price: 24.99,
      image: '/images/product-5.png'
    },
    {
      name: 'Ferrer. Brava Sauce. 320g (11.29oz)',
      description: 'Spicy and tangy authentic Spanish Brava sauce for patatas bravas.',
      price: 5.99,
      image: '/images/product-6.png'
    }
  ];

  const insertMany = db.transaction((products) => {
    for (const p of products) {
      insertStmt.run(p.name, p.description, p.price, p.image);
    }
  });

  insertMany(initialProducts);
}

export default db;
