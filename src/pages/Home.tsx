import { Link } from 'react-router-dom';
import { Trophy, CalendarClock, ShieldCheck, Star } from 'lucide-react';
import Seo from '../lib/seo';
import { QuickAnswer, StarRating } from '../components/ui';
import GtaHero from '../components/GtaHero';
import { METACRITIC, REVIEWS } from '../data/reviews';
import { CHEATS, CHEAT_COUNTS } from '../data/cheats';
import { SITE } from '../config/site';

export default function Home() {
  const ld = {
    '@context': 'https://schema.org', '@type': 'VideoGame',
    name: 'Grand Theft Auto VI', publisher: 'Rockstar Games',
    platform: ['PlayStation 5', 'Xbox Series X|S'], datePublished: '2026-11-19',
    genre: 'Open-world action-adventure',
  };
  return (
    <>
      <Seo
        title="GTA 6 Cheats (PS5), Reviews, Metacritic Score & Guides - Explore Leonida"
        description="Unofficial GTA 6 guide: PS5 cheat codes with verification status, Metacritic 99 review roundup, comparisons, where to buy and preload guides."
        path="/"
        jsonLd={ld}
        ogImage="/og/home.png"
      />

      {/* Hero */}
      <GtaHero />

      {/* Stats strip */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '40px', width: '100%', boxSizing: 'border-box' }}>
        {[
          { icon: Trophy, big: String(METACRITIC.score), label: `Metacritic (as of ${METACRITIC.asOf})` },
          { icon: CalendarClock, big: '19 Nov 2026', label: 'PS5 & Xbox Series X|S' },
          { icon: ShieldCheck, big: `${CHEAT_COUNTS.official + CHEAT_COUNTS.tested}/${CHEATS.length}`, label: 'Cheats verified (honest count)' },
          { icon: Star, big: `${REVIEWS.length}`, label: 'Outlets tracked' },
        ].map((s, i) => (
          <div key={i} className="glass glass-hover" style={{ padding: '20px', textAlign: 'center' }}>
            <s.icon size={22} style={{ margin: '0 auto', color: 'var(--color-hot)' }} />
            <p className="gta-title" style={{ fontSize: '1.6rem', marginTop: '8px' }}>{s.big}</p>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>{s.label}</p>
          </div>
        ))}
      </section>

      {/* Score marquee */}
      <section style={{ marginBottom: '40px' }}>
        <StarRating n={6} />
        <div style={{ overflow: 'hidden', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(20,10,46,0.6)', padding: '12px 0' }}>
          <div className="marquee-track" style={{ gap: '32px', paddingLeft: '32px' }}>
            {[...REVIEWS, ...REVIEWS].map((r, i) => (
              <span key={i} style={{ whiteSpace: 'nowrap', color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-head)', fontSize: '1rem' }}>
                {r.outlet} <span style={{ color: 'var(--color-gold)' }}>{r.score}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      <QuickAnswer>
        GTA VI launched 19 Nov 2026 on PS5 and Xbox Series X|S (digital-first; physical copies are reported code-in-box).
        Rockstar has not published an official cheat list: every code on this site is clearly marked verified or unverified.
        Critics: Metacritic 99 with perfect scores from IGN, GameSpot, Eurogamer and more.
      </QuickAnswer>

      {/* Feature cards */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '16px', marginTop: '32px' }}>
        {[
          { to: '/map', t: 'Interactive Map', d: 'State of Leonida atlas: 5 counties, 70+ landmarks, safehouses, and gun shops.' },
          { to: '/weapons', t: 'Weapons Database', d: 'Over 40 confirmed firearms, real-life counterparts, and vehicle trunk armory.' },
          { to: '/characters', t: 'Characters & Cast', d: 'Jason Duval, Lucia Caminos, and 50+ confirmed Leonida cast and voice actors.' },
          { to: '/cheats/ps5', t: 'Cheat Codes PS5', d: 'Every reported code with status badges. Learn how to spot fake viral lists.' },
          { to: '/reviews', t: 'Review Scores', d: `Metacritic ${METACRITIC.score}, IGN 10/10, GameSpot 10/10: all 17 outlets with sources.` },
          { to: '/compare', t: 'Compare Games', d: 'GTA 6 vs GTA 5, RDR2, Cyberpunk 2077: scores, settings, platforms.' },
          { to: '/preload', t: 'Preload & Install', d: 'Pre-download dates, midnight unlock times, storage tracker (TBC).' },
          { to: '/faq', t: 'FAQ', d: 'Release, cheats, price, trophies, GTA Online: quick factual answers.' },
          { to: '/site-index', t: 'Site Index', d: `All ${SITE.name} pages in one place.` },
        ].map((c) => (
          <Link key={c.to} to={c.to} className="glass glass-hover" style={{ padding: '20px', textDecoration: 'none', display: 'block' }}>
            <h2 className="font-head" style={{ fontSize: '1.1rem', color: 'var(--color-sunset)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-head)' }}>{c.t}</h2>
            <p style={{ marginTop: '8px', fontSize: '0.88rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>{c.d}</p>
          </Link>
        ))}
      </section>
    </>
  );
}
