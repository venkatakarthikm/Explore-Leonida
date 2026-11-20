import { Link } from 'react-router-dom';
import Seo from '../lib/seo';
import { QuickAnswer, Crumbs, PageHead, Section } from '../components/ui';

export default function Preload() {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Preload and Install GTA 6 on PS5',
    description: 'Guide to pre-downloading and installing Grand Theft Auto VI before launch.',
  };

  return (
    <>
      <Seo
        title="GTA 6 Preload & Install Guide (PS5, Xbox) - Explore Leonida"
        description="GTA 6 pre-download started 10 November 2026 on PS5. Unlock times, storage tracker (TBC) and troubleshooting for launch night."
        path="/preload"
        jsonLd={ld}
        ogImage="/og/home.png"
      />
      <Crumbs items={[{ name: 'Home', path: '/' }, { name: 'Preload', path: '/preload' }]} />
      <PageHead h1="GTA 6 Preload & Install" sub="Everything confirmed about downloading Grand Theft Auto VI before launch, plus a tracker for install size that stays honest until numbers are verified." updated="20 Nov 2026" />
      <QuickAnswer>
        PlayStation pre-download for GTA 6 began 10 November 2026 (PlayStation Blog). The game unlocked at midnight local
        time on 19 November 2026. Install size: not yet verified: the tracker below fills in only with sourced figures.
      </QuickAnswer>

      <Section title="How to preload on PS5">
        <ol className="glass" style={{ padding: '20px 20px 20px 44px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '8px', margin: 0 }}>
          <li>Pre-order GTA 6 on the PlayStation Store (or redeem a code-in-box copy's code).</li>
          <li>From 10 Nov 2026, open your Library → Purchased, select GTA 6, and download.</li>
          <li>Leave the PS5 in Rest Mode for the fastest, most reliable download.</li>
          <li>The game unlocks at midnight local time on 19 November (some US zones the night before, per Forbes).</li>
        </ol>
      </Section>

      <Section title="Install size tracker">
        <div className="glass" style={{ padding: '20px' }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginBottom: '12px' }}>No verified install size has been published yet.</p>
          <table style={{ width: '100%', fontSize: '0.88rem', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.1)', fontFamily: 'var(--font-head)', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '8px 16px 8px 0' }}>Source</th>
                <th style={{ padding: '8px 16px 8px 0' }}>Date</th>
                <th style={{ padding: '8px 0' }}>Size</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={3} style={{ padding: '16px 0', color: 'rgba(255,255,255,0.4)', fontSize: '0.88rem' }}>No verified figure yet: do not trust "leaked" file sizes.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Troubleshooting">
        <div className="glass" style={{ padding: '20px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <p><strong style={{ color: 'white' }}>Download stuck:</strong> pause and resume, or cancel and re-download; check PSN service status.</p>
          <p><strong style={{ color: 'white' }}>Slow speeds:</strong> use a wired connection, pause other devices, try DNS 1.1.1.1 / 8.8.8.8.</p>
          <p><strong style={{ color: 'white' }}>Not unlocking at midnight:</strong> restore licences (Settings → Users → Account → Restore Licences) and restart the console.</p>
        </div>
      </Section>

      <div style={{ marginTop: '40px', fontSize: '0.88rem', color: 'rgba(255,255,255,0.6)', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
        <span>Related:</span>
        <Link to="/buy" style={{ color: 'var(--color-hot)', textDecoration: 'none' }}>Where to buy</Link>
        <Link to="/faq" style={{ color: 'var(--color-hot)', textDecoration: 'none' }}>FAQ</Link>
      </div>
    </>
  );
}
