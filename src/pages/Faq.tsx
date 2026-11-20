import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import Seo, { faqPage } from '../lib/seo';
import { Crumbs, PageHead, Section } from '../components/ui';
import { FAQS } from '../data/faq';
import { track } from '../lib/analytics';

const GROUPS = ['Release', 'Cheats', 'Reviews', 'Price & Buying', 'Gameplay', 'Technical'];

export default function Faq() {
  const [group, setGroup] = useState('all');
  const [q, setQ] = useState('');
  const list = useMemo(() => FAQS.filter(
    (f) => (group === 'all' || f.group === group) && (!q || (f.q + f.a).toLowerCase().includes(q.toLowerCase()))
  ), [group, q]);

  return (
    <>
      <Seo
        title="GTA 6 FAQ: Release, Cheats, Scores, Price - Explore Leonida"
        description="Factual GTA 6 answers: release date, weapons, characters, map, PS5 cheats status, Metacritic 99, price, platforms, and GTA Online: all sourced."
        path="/faq"
        jsonLd={faqPage(FAQS)}
        ogImage="/og/home.png"
      />
      <Crumbs items={[{ name: 'Home', path: '/' }, { name: 'FAQ', path: '/faq' }]} />
      <PageHead h1="GTA 6 - Frequently Asked Questions" sub="Short, sourced answers. Anything unconfirmed is labelled TBC rather than guessed." updated="20 Nov 2026" />

      {/* Filter bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px', alignItems: 'center' }}>
        {['all', ...GROUPS].map((g) => (
          <button key={g} onClick={() => setGroup(g)}
            className="chip"
            style={{ color: group === g ? 'var(--color-hot)' : 'rgba(255,255,255,0.5)', borderColor: group === g ? 'var(--color-hot)' : 'rgba(255,255,255,0.15)', cursor: 'pointer', textTransform: 'capitalize' }}>
            {g}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search questions…" aria-label="Search FAQ"
            style={{ borderRadius: '999px', background: 'rgba(10,4,24,0.7)', border: '1px solid rgba(255,255,255,0.15)', paddingLeft: '32px', paddingRight: '12px', paddingTop: '7px', paddingBottom: '7px', fontSize: '0.85rem', outline: 'none', color: 'white', minWidth: '180px' }}
          />
        </div>
      </div>

      <Section title={`${list.length} answers`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {list.map((f) => (
            <details key={f.q} className="glass" style={{ padding: '16px 20px' }}
              onToggle={(e) => (e.target as HTMLDetailsElement).open && track('faq_open', { question: f.q })}>
              <summary style={{ fontFamily: 'var(--font-head)', cursor: 'pointer', color: 'white', listStyle: 'none', userSelect: 'none', fontSize: '1rem' }}>
                {f.q}
              </summary>
              <p style={{ marginTop: '10px', fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>{f.a}</p>
              <span className="chip" style={{ marginTop: '8px', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', display: 'inline-flex' }}>{f.group}</span>
            </details>
          ))}
          {list.length === 0 && <p style={{ color: 'rgba(255,255,255,0.4)', padding: '20px 0' }}>No matching questions: try a different search term.</p>}
        </div>
      </Section>

      <div style={{ marginTop: '40px', fontSize: '0.88rem', color: 'rgba(255,255,255,0.6)', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
        <span>Related:</span>
        <Link to="/cheats/ps5" style={{ color: 'var(--color-hot)', textDecoration: 'none' }}>Cheats</Link>
        <Link to="/reviews" style={{ color: 'var(--color-hot)', textDecoration: 'none' }}>Reviews</Link>
        <Link to="/site-index" style={{ color: 'var(--color-hot)', textDecoration: 'none' }}>Site index</Link>
      </div>
    </>
  );
}
