import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ExternalLink, Trophy } from 'lucide-react';
import Seo from '../lib/seo';
import { QuickAnswer, Crumbs, PageHead, Section, StarRating } from '../components/ui';
import { REVIEWS, METACRITIC } from '../data/reviews';
import { track } from '../lib/analytics';

const OUTLET_NOTES: Record<string, string> = {
  IGN: 'IGN is the largest games outlet in the world; a 10/10 "masterpiece" score is awarded only a handful of times per generation.',
  VGC: 'Video Games Chronicle covers the industry with a newsroom of ex-Computer And Video Games veterans.',
  Empire: 'Empire is a film magazine: its 5/5 signals GTA 6 storytelling recognized beyond gaming press.',
  Forbes: 'Forbes games coverage reaches a mainstream business and culture readership.',
  Eurogamer: 'Eurogamer is known for the strictest review standards among major UK outlets: a 5/5 is rare.',
  ComicBook: 'US pop-culture outlet covering games, comics and film.',
  'Digital Spy': 'UK entertainment giant; its perfect score underlines mainstream appeal.',
  TechRadar: 'Consumer-tech outlet whose gaming section benchmarks hardware-heavy releases.',
  GameSpot: 'One of the two historic 10-point US giants; its review is among the most-cited.',
  ScreenRant: 'Screen-entertainment network with a huge US readership.',
  Destructoid: 'Long-running independent-leaning outlet; 10/10 from Destructoid is famously uncommon.',
  'Push Square': 'The PlayStation-focused outlet: its 10/10 matters most for PS5 buyers.',
  CGMagazine: 'Canadian games and culture magazine.',
  GamesRadar: 'GamesRadar+ reaches tens of millions monthly readers.',
  DualShockers: 'US outlet with strong console-community reach.',
  'Game Informer': "GameStop's former flagship magazine, relaunched independently in 2024.",
  'EDGE Magazine': 'EDGE is the UK print institution famous for withholding perfect scores: a 10 is once-a-decade.',
};

export default function Reviews() {
  const [sortDesc, setSortDesc] = useState(false);
  const sorted = [...REVIEWS].sort((a, b) => sortDesc ? a.normalized - b.normalized : b.normalized - a.normalized);

  const reviewLd = {
    '@context': 'https://schema.org', '@type': 'ItemList',
    name: 'GTA 6 critic review scores roundup',
    itemListElement: REVIEWS.map((r, i) => ({
      '@type': 'ListItem', position: i + 1,
      item: {
        '@type': 'Review',
        author: { '@type': 'Organization', name: r.outlet },
        reviewRating: { '@type': 'Rating', ratingValue: r.normalized, bestRating: 100 },
        reviewBody: `${r.outlet} scored Grand Theft Auto VI ${r.score}.`,
      },
    })),
  };

  return (
    <>
      <Seo
        title="GTA 6 Review Scores: Metacritic 99 + IGN, GameSpot & More - Explore Leonida"
        description="Every major GTA 6 review score in one table: IGN 10/10, GameSpot 10/10, Metacritic 99. Compare with GTA 5, RDR2 and more."
        path="/reviews"
        jsonLd={reviewLd}
        ogImage="/og/reviews.png"
      />
      <Crumbs items={[{ name: 'Home', path: '/' }, { name: 'Reviews', path: '/reviews' }]} />
      <PageHead
        h1="GTA 6 Review Scores Roundup"
        sub="Every launch-window critic score for Grand Theft Auto VI, normalized and sourced. The review embargo lifted 18 November 2026, 6 am ET."
        updated="18 Nov 2026"
      />

      {/* Score ring hero */}
      <section className="glass" style={{ padding: '32px', marginBottom: '32px', textAlign: 'center' }}>
        <StarRating n={6} />
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }} role="img" aria-label={`Metacritic score ${METACRITIC.score}`}>
          <div style={{ position: 'relative', width: '144px', height: '144px' }}>
            <svg viewBox="0 0 120 120" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
              <circle cx="60" cy="60" r="52" fill="none" stroke="url(#scoreGrad)" strokeWidth="10" strokeLinecap="round"
                strokeDasharray={`${(METACRITIC.score / 100) * 327} 327`} />
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B3DFF" />
                  <stop offset="50%" stopColor="#FF4F7A" />
                  <stop offset="100%" stopColor="#FF8A3D" />
                </linearGradient>
              </defs>
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="gta-title" style={{ fontSize: '3rem' }}>{METACRITIC.score}</span>
            </div>
          </div>
          <p style={{ marginTop: '8px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
            Metacritic as of {METACRITIC.asOf} ·{' '}
            <a href={METACRITIC.url} target="_blank" rel="noopener nofollow" style={{ color: 'var(--color-aqua)', textDecoration: 'none' }}
              onClick={() => track('review_outbound', { outlet: 'Metacritic' })}>
              Source <ExternalLink size={11} style={{ display: 'inline' }} />
            </a>
          </p>
        </div>
        <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
          <span className="chip" style={{ color: 'var(--color-hot)', borderColor: 'rgba(255,46,147,0.5)' }}>{REVIEWS.length} outlets listed</span>
          <span className="chip" style={{ color: 'var(--color-gold)', borderColor: 'rgba(255,209,102,0.5)' }}>All perfect or near-perfect</span>
          <span className="chip" style={{ color: 'var(--color-warn)', borderColor: 'rgba(255,176,32,0.5)' }}>Lowest: 9/10 (per Kotaku, 18 Nov)</span>
        </div>
      </section>

      <QuickAnswer>
        GTA 6 holds a Metacritic score of 99 (as of {METACRITIC.asOf}) with perfect scores from IGN, GameSpot, Eurogamer,
        GamesRadar and 13 more outlets. The full table below normalizes every 10-point and 5-point score for comparison.
      </QuickAnswer>

      <Section title="All scores (sortable)">
        <button onClick={() => setSortDesc(!sortDesc)} className="ghost-btn" style={{ padding: '6px 14px', fontSize: '0.8rem', marginBottom: '12px' }}>
          Sort: {sortDesc ? 'lowest first' : 'highest first'}
        </button>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', fontSize: '0.88rem', minWidth: '560px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.1)', fontFamily: 'var(--font-head)', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '8px 16px 8px 0' }}>Outlet</th>
                <th style={{ padding: '8px 16px 8px 0' }}>Score</th>
                <th style={{ padding: '8px 16px 8px 0' }}>Normalized</th>
                <th style={{ padding: '8px 16px 8px 0' }}>Date</th>
                <th style={{ padding: '8px 0' }}>Review</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((r) => (
                <tr key={r.outlet} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '12px 16px 12px 0', fontWeight: 600, color: 'white' }}>{r.outlet}</td>
                  <td style={{ padding: '12px 16px 12px 0' }}>
                    <span className="chip" style={{ color: 'var(--color-gold)', borderColor: 'rgba(255,209,102,0.5)' }}>{r.score}</span>
                  </td>
                  <td style={{ padding: '12px 16px 12px 0', width: '140px' }}>
                    <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden', marginBottom: '4px' }}>
                      <div style={{ height: '100%', borderRadius: '3px', width: `${r.normalized}%`, background: 'linear-gradient(90deg,#ff8a3d,#ff2e93)' }} />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{r.normalized}/100</span>
                  </td>
                  <td style={{ padding: '12px 16px 12px 0', color: 'rgba(255,255,255,0.4)' }}>{r.publishedAt}</td>
                  <td style={{ padding: '12px 0' }}>
                    {r.verified && r.url
                      ? <a href={r.url} target="_blank" rel="noopener nofollow" style={{ color: 'var(--color-aqua)', textDecoration: 'none' }}
                        onClick={() => track('review_outbound', { outlet: r.outlet })}>
                        Read <ExternalLink size={11} style={{ display: 'inline' }} />
                      </a>
                      : <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem' }}>source link pending</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ marginTop: '8px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>
          Method: 10/10 → 100, 5/5 → 100. Rows marked "source link pending" have not been individually re-checked against the outlet's own page: we never invent review prose.
        </p>
      </Section>

      <Section title="What each score means">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '12px' }}>
          {REVIEWS.map((r) => (
            <div key={r.outlet} className="glass glass-hover" style={{ padding: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-head)', color: 'white', margin: '0 0 6px' }}>
                {r.outlet}: <span style={{ color: 'var(--color-gold)' }}>{r.score}</span>
              </h3>
              <p style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, margin: 0 }}>{OUTLET_NOTES[r.outlet]}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Is GTA 6 worth buying?">
        <div className="glass" style={{ padding: '20px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>
          <p style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <Trophy size={16} style={{ color: 'var(--color-gold)', marginTop: '3px', flexShrink: 0 }} />
            With a Metacritic 99 and near-universal perfect scores, the critical consensus is that GTA 6 is an era-defining
            release. If you own a PS5 or Xbox Series X|S and enjoy open-world games, the review picture is about as strong as it gets.
          </p>
          <p style={{ marginTop: '10px' }}>
            <strong>Caveats:</strong> no PC version at launch; physical copies are reported to be code-in-box; online mode
            details are still emerging. See our <Link to="/buy" style={{ color: 'var(--color-hot)', textDecoration: 'none' }}>where to buy</Link> page.
          </p>
        </div>
      </Section>

      <div style={{ marginTop: '40px', fontSize: '0.88rem', color: 'rgba(255,255,255,0.6)', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
        <span>Related:</span>
        <Link to="/compare" style={{ color: 'var(--color-hot)', textDecoration: 'none' }}>Compare with GTA 5 &amp; RDR2</Link>
        <Link to="/buy" style={{ color: 'var(--color-hot)', textDecoration: 'none' }}>Where to buy</Link>
        <Link to="/faq" style={{ color: 'var(--color-hot)', textDecoration: 'none' }}>FAQ</Link>
      </div>
    </>
  );
}
