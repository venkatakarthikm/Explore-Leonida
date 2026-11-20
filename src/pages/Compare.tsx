import { Link } from 'react-router-dom';
import Seo from '../lib/seo';
import { QuickAnswer, Crumbs, PageHead, Section } from '../components/ui';
import { GAMES } from '../data/games';

export default function Compare() {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'GTA 6 vs GTA 5, RDR2, Cyberpunk and the GTA series Metacritic history',
    dateModified: '2026-11-19',
    author: { '@type': 'Organization', name: 'Explore Leonida' },
  };

  return (
    <>
      <Seo
        title="Compare GTA 6 vs GTA 5, RDR2, Cyberpunk (Metacritic) - Explore Leonida"
        description="Side-by-side comparison of GTA 6 with GTA 5, GTA IV, RDR2 and Cyberpunk 2077: Metacritic scores, settings, platforms and more."
        path="/compare"
        jsonLd={ld}
        ogImage="/og/home.png"
      />
      <Crumbs items={[{ name: 'Home', path: '/' }, { name: 'Compare', path: '/compare' }]} />
      <PageHead h1="Compare GTA Games" sub="GTA 6 against Rockstar history and the biggest open-world rivals. Only cited numbers: unknown values are marked TBC, never invented." updated="20 Nov 2026" />
      <QuickAnswer>
        GTA 6's Metacritic 99 puts it above GTA IV (98), GTA V (97) and RDR2 (97): the best-reviewed Rockstar game ever,
        as of 18 Nov 2026. Full table below.
      </QuickAnswer>
      <Section title="Head-to-head">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', fontSize: '0.88rem', minWidth: '640px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.1)', fontFamily: 'var(--font-head)', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '8px 16px 8px 0' }}>Game</th>
                <th style={{ padding: '8px 16px 8px 0' }}>Year</th>
                <th style={{ padding: '8px 16px 8px 0' }}>Metacritic</th>
                <th style={{ padding: '8px 16px 8px 0' }}>Setting</th>
                <th style={{ padding: '8px 16px 8px 0' }}>Platforms</th>
                <th style={{ padding: '8px 0' }}>Note</th>
              </tr>
            </thead>
            <tbody>
              {GAMES.map((g) => (
                <tr key={g.game} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: g.metacritic === 99 ? 'rgba(255,46,147,0.05)' : 'transparent' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                  onMouseLeave={e => (e.currentTarget.style.background = g.metacritic === 99 ? 'rgba(255,46,147,0.05)' : 'transparent')}
                >
                  <td style={{ padding: '12px 16px 12px 0', fontWeight: 600, color: 'white' }}>{g.game}</td>
                  <td style={{ padding: '12px 16px 12px 0', color: 'rgba(255,255,255,0.6)' }}>{g.year}</td>
                  <td style={{ padding: '12px 16px 12px 0' }}>
                    <span className="chip" style={{ color: g.metacritic === 99 ? 'var(--color-hot)' : 'var(--color-gold)', borderColor: g.metacritic === 99 ? 'rgba(255,46,147,0.6)' : 'rgba(255,209,102,0.5)' }}>
                      {g.metacritic}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px 12px 0', color: 'rgba(255,255,255,0.6)' }}>{g.setting}</td>
                  <td style={{ padding: '12px 16px 12px 0', color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem' }}>{g.platforms}</td>
                  <td style={{ padding: '12px 0', color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem' }}>{g.note ?? ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
      <Section title="GTA series Metacritic history">
        <div className="glass" style={{ padding: '20px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>
          <p>III 97 → Vice City 95 → San Andreas 95 → IV 98 → V 97 → <strong style={{ color: 'var(--color-hot)' }}>VI 99</strong> (Metacritic, as of 18 Nov 2026: verify before citing). Every mainline entry since 2001 has scored 95+, an unmatched run in open-world gaming.</p>
        </div>
      </Section>
      <Section title="Our take (opinion, clearly labelled)">
        <div className="glass" style={{ padding: '20px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, border: '1px solid rgba(139,61,255,0.3)' }}>
          <p>Numbers never tell the whole story: GTA IV's 98 came in a smaller press landscape, while GTA 6's 99 spans 145+ reviews at embargo. Either way, the gap between GTA 6 and the rest of the series is now the headline stat of this launch.</p>
        </div>
      </Section>
      <div style={{ marginTop: '40px', fontSize: '0.88rem', color: 'rgba(255,255,255,0.6)', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
        <span>Related:</span>
        <Link to="/reviews" style={{ color: 'var(--color-hot)', textDecoration: 'none' }}>Reviews</Link>
        <Link to="/buy" style={{ color: 'var(--color-hot)', textDecoration: 'none' }}>Buy</Link>
        <Link to="/faq" style={{ color: 'var(--color-hot)', textDecoration: 'none' }}>FAQ</Link>
      </div>
    </>
  );
}
