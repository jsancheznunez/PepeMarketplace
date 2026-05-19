export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#2b2d42', color: 'white', padding: '40px 0', marginTop: 'auto' }}>
      <div className="container flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 style={{ color: 'var(--color-secondary)' }}>Pepe Marketplace</h3>
            <p style={{ opacity: 0.8, fontSize: '0.9rem', marginTop: '8px' }}>Delicious food delivered to your door.</p>
          </div>
          <div className="flex gap-4">
            <span style={{ opacity: 0.8 }}>support@pepemarketplace.com</span>
            <a href="#" style={{ color: 'var(--color-secondary)' }}>Instagram</a>
            <a href="#" style={{ color: 'var(--color-secondary)' }}>Facebook</a>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', textAlign: 'center', opacity: 0.6, fontSize: '0.8rem' }}>
          &copy; {new Date().getFullYear()} Pepe Marketplace. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
