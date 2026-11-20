import { Link } from 'react-router-dom';
import Seo from '../lib/seo';
import { Crumbs, PageHead, Section } from '../components/ui';
import { PAGES } from '../data/pages';

export default function SiteIndex() {
  const groups = [...new Set(PAGES.map((p) => p.group))];
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Site Index',
    description: 'A human-readable index of every page on Explore Leonida.',
  };

  return (
    <>
      <Seo
        title="Site Index - Every Page on Explore Leonida"
        description="A human-readable index of every page on Explore Leonida: cheats, reviews, comparisons, buy, preload, FAQ and legal pages."
        path="/site-index"
        jsonLd={ld}
        ogImage="/og/home.png"
      />
      <Crumbs items={[{ name: 'Home', path: '/' }, { name: 'Site index', path: '/site-index' }]} />
      <PageHead h1="Site Index" sub="Every page on Explore Leonida, grouped. This page also powers our search and sitemap." updated="19 Nov 2026" />
      {groups.map((g) => (
        <Section key={g} title={g}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '12px' }}>
            {PAGES.filter((p) => p.group === g).map((p) => (
              <Link key={p.path} to={p.path} className="glass glass-hover" style={{ padding: '16px 20px', textDecoration: 'none', display: 'block' }}>
                <h2 className="font-head" style={{ color: 'white', fontSize: '1rem', textTransform: 'uppercase', fontFamily: 'var(--font-head)' }}>{p.title}</h2>
                <p style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.55)', marginTop: '6px', lineHeight: 1.5 }}>{p.desc}</p>
                <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', marginTop: '8px' }}>{p.path} · updated {p.updated}</p>
              </Link>
            ))}
          </div>
        </Section>
      ))}
    </>
  );
}
