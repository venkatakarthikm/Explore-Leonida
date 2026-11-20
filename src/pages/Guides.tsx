import { Link } from 'react-router-dom';
import Seo from '../lib/seo';
import { Crumbs, PageHead, Section } from '../components/ui';

const SOON = ['Map of Leonida', 'Characters (Jason & Lucia)', 'Vehicles', 'Weapons', 'Trophies', 'Walkthrough', 'Collectibles', 'Tips for beginners'];

export default function Guides() {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'GTA 6 Guides',
    description: 'Confirmed gameplay and mission guides for Grand Theft Auto VI.',
  };

  return (
    <>
      <Seo
        title="GTA 6 Guides - Explore Leonida"
        description="GTA 6 guides in progress: Leonida map, characters Jason and Lucia, vehicles, trophies and walkthroughs. Only confirmed info will be published."
        path="/guides"
        jsonLd={ld}
        ogImage="/og/home.png"
      />
      <Crumbs items={[{ name: 'Home', path: '/' }, { name: 'Guides', path: '/guides' }]} />
      <PageHead h1="GTA 6 Guides" sub="Our guides desk is building the next wave of pages. We publish only confirmed, sourced information: no leaked-map speculation." updated="20 Nov 2026" />
      <Section title="In production">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '12px' }}>
          {SOON.map((g) => (
            <div key={g} className="glass" style={{ padding: '20px', textAlign: 'center', opacity: 0.7 }}>
              <h2 className="font-head" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', textTransform: 'uppercase', fontFamily: 'var(--font-head)' }}>{g}</h2>
              <p style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--color-warn)' }}>Coming soon</p>
            </div>
          ))}
        </div>
      </Section>
      <div style={{ marginTop: '40px', fontSize: '0.88rem', color: 'rgba(255,255,255,0.6)', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
        <span>Meanwhile:</span>
        <Link to="/cheats/ps5" style={{ color: 'var(--color-hot)', textDecoration: 'none' }}>Cheats PS5</Link>
        <Link to="/reviews" style={{ color: 'var(--color-hot)', textDecoration: 'none' }}>Reviews</Link>
        <Link to="/faq" style={{ color: 'var(--color-hot)', textDecoration: 'none' }}>FAQ</Link>
      </div>
    </>
  );
}
