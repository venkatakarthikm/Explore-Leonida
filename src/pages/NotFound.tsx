import { Link } from 'react-router-dom';
import Seo from '../lib/seo';
import { Star } from 'lucide-react';

export default function NotFound() {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Page Not Found',
    description: 'This page does not exist on Explore Leonida.',
  };

  return (
    <>
      <Seo
        title="Page Not Found - Explore Leonida"
        description="This page does not exist. Search Explore Leonida for cheats, reviews and guides."
        path="/404"
        noindex
        jsonLd={ld}
        ogImage="/og/home.png"
      />
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <Star size={64} style={{ margin: '0 auto', color: 'var(--color-hot)' }} fill="currentColor" />
        <h1 className="gta-title" style={{ fontSize: '3rem', marginTop: '24px' }}>404: wrong turn in Leonida</h1>
        <p style={{ marginTop: '12px', color: 'rgba(255,255,255,0.7)' }}>That page doesn't exist. Try the site index or search (Ctrl/Cmd + K).</p>
        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <Link to="/" className="neon-btn">Home</Link>
          <Link to="/site-index" className="ghost-btn">Site index</Link>
        </div>
      </div>
    </>
  );
}
