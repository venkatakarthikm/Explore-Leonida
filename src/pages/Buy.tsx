import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import Seo from '../lib/seo';
import { QuickAnswer, Crumbs, PageHead, Section } from '../components/ui';
import { STORES } from '../data/games';
import { track } from '../lib/analytics';

export default function Buy() {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Where to Buy GTA 6: PS5 & Xbox Prices',
    description: 'Official storefronts for Grand Theft Auto VI on PS5 and Xbox Series X|S.',
  };

  return (
    <>
      <Seo
        title="Where to Buy GTA 6: PS5 & Xbox Prices - Explore Leonida"
        description="Where to buy Grand Theft Auto VI: PlayStation Store, Xbox Store and Rockstar Store links, standard and Ultimate editions, price notes and disclosure."
        path="/buy"
        jsonLd={ld}
        ogImage="/og/home.png"
      />
      <Crumbs items={[{ name: 'Home', path: '/' }, { name: 'Buy', path: '/buy' }]} />
      <PageHead h1="Where to Buy GTA 6" sub="Official storefronts for Grand Theft Auto VI on PS5 and Xbox Series X|S. Prices move with regions and sales: always check the store for your country." updated="20 Nov 2026" />
      <QuickAnswer>
        GTA 6 is available digitally on PlayStation Store and Xbox Store (US standard edition $79.99; Ultimate Edition
        $99.99+), and via the Rockstar Store. Physical copies are reported to be code-in-box (no disc). No PC version at launch.
      </QuickAnswer>

      <Section title="Official stores">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '16px' }}>
          {STORES.map((s) => (
            <div key={s.name} className="glass glass-hover" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
              <h2 className="font-head" style={{ fontSize: '1.1rem', color: 'var(--color-sunset)', textTransform: 'uppercase', fontFamily: 'var(--font-head)', marginBottom: '8px' }}>{s.name}</h2>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', flex: 1, lineHeight: 1.5 }}>{s.price}</p>
              <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginTop: '6px' }}>{s.note}</p>
              <a href={s.url} target="_blank" rel="noopener sponsored nofollow"
                onClick={() => track('buy_click', { store: s.name })}
                className="neon-btn" style={{ marginTop: '16px', justifyContent: 'center', fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <ExternalLink size={14} /> Open Store
              </a>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Affiliate disclosure">
        <div className="glass" style={{ padding: '20px', fontSize: '0.88rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, border: '1px solid rgba(255,176,32,0.25)' }}>
          Purchase links may earn this site a commission at no extra cost to you. This never affects our scores or cheat
          verification: those are tracked independently. See our <Link to="/about" style={{ color: 'var(--color-hot)', textDecoration: 'none' }}>editorial policy</Link>.
        </div>
      </Section>

      <Section title="Editions (US listing: verify in your region)">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', fontSize: '0.88rem', minWidth: '480px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.1)', fontFamily: 'var(--font-head)', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '8px 16px 8px 0' }}>Edition</th>
                <th style={{ padding: '8px 16px 8px 0' }}>US price</th>
                <th style={{ padding: '8px 0' }}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Standard', '$79.99', 'Base game, digital'],
                ['Ultimate Edition', '$99.99+', 'Per Xbox/Rockstar Store listings: check contents in store'],
              ].map(([ed, price, note]) => (
                <tr key={ed} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px 16px 12px 0', fontWeight: 600, color: 'white' }}>{ed}</td>
                  <td style={{ padding: '12px 16px 12px 0', color: 'var(--color-gold)' }}>{price}</td>
                  <td style={{ padding: '12px 0', color: 'rgba(255,255,255,0.5)' }}>{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <div style={{ marginTop: '40px', fontSize: '0.88rem', color: 'rgba(255,255,255,0.6)', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
        <span>Related:</span>
        <Link to="/preload" style={{ color: 'var(--color-hot)', textDecoration: 'none' }}>Preload &amp; install</Link>
        <Link to="/reviews" style={{ color: 'var(--color-hot)', textDecoration: 'none' }}>Reviews</Link>
        <Link to="/faq" style={{ color: 'var(--color-hot)', textDecoration: 'none' }}>FAQ</Link>
      </div>
    </>
  );
}
