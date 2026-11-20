import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Search, Menu, X, ChevronUp } from 'lucide-react';
import Fuse from 'fuse.js';
import { buildIndex } from '../lib/search';
import { track, getConsent, setConsent, initConsentMode, loadAnalytics, trackPageView } from '../lib/analytics';
import { SITE } from '../config/site';
import StarLoader from './StarLoader';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, [pathname]);
  return null;
}

function Analytics() {
  const location = useLocation();

  useEffect(() => {
    initConsentMode();
    if (getConsent() === 'granted') {
      loadAnalytics();
    }
  }, []);

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null;
}

const NAV = [
  { to: '/map', label: 'Map' },
  { to: '/weapons', label: 'Weapons' },
  { to: '/characters', label: 'Characters' },
  { to: '/cheats/ps5', label: 'Cheats' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/compare', label: 'Compare' },
  { to: '/buy', label: 'Buy' },
  { to: '/preload', label: 'Preload' },
  { to: '/guides', label: 'Guides' },
  { to: '/faq', label: 'FAQ' },
];

function SearchPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('');
  const index = useMemo(() => buildIndex(), []);
  const fuse = useMemo(() => new Fuse(index, { keys: ['title', 'sub'], threshold: 0.35 }), [index]);
  const results = q ? fuse.search(q).slice(0, 8).map((r) => r.item) : index.filter((i) => i.group === 'Pages').slice(0, 6);

  if (!open) return null;
  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '80px 16px 0' }}
      onClick={onClose}
    >
      <div className="glass" style={{ width: '100%', maxWidth: '560px', padding: '16px' }} onClick={(e) => e.stopPropagation()}>
        <input
          autoFocus value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Search cheats, reviews, FAQs…"
          style={{ width: '100%', borderRadius: '12px', background: 'rgba(10,4,24,0.8)', border: '1px solid rgba(255,255,255,0.15)', padding: '12px 16px', outline: 'none', color: 'white', fontSize: '1rem', boxSizing: 'border-box' }}
          onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
          aria-label="Search the site"
        />
        <ul style={{ marginTop: '12px', maxHeight: '320px', overflowY: 'auto', listStyle: 'none', padding: 0 }}>
          {results.map((r, i) => (
            <li key={i}>
              <Link to={r.path} onClick={() => { track('search', { search_term: q }); onClose(); }}
                style={{ display: 'block', borderRadius: '8px', padding: '10px 12px', textDecoration: 'none', color: 'white' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <span className="chip" style={{ color: 'var(--color-aqua)', borderColor: 'rgba(25,230,210,0.4)', marginRight: '8px', fontSize: '0.7rem' }}>{r.group}</span>
                <span style={{ fontWeight: 600 }}>{r.title}</span>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>{r.sub}</span>
              </Link>
            </li>
          ))}
          {results.length === 0 && <li style={{ padding: '16px 12px', color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>No results - try "cheats", "Metacritic", "price".</li>}
        </ul>
      </div>
    </div>
  );
}

function ConsentBanner({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  const decide = (v: 'granted' | 'denied') => {
    setConsent(v);
    onClose();
  };
  return (
    <div className="glass" style={{
      position: 'fixed', bottom: '16px', left: '16px', right: '16px', zIndex: 80,
      margin: '0 auto', maxWidth: '680px', padding: '16px 20px',
      display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center',
    }}>
      <p style={{ flex: 1, minWidth: '200px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)', margin: 0 }}>
        We use cookies for analytics (Google Analytics 4) to improve the site. You can accept or reject.
      </p>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={() => decide('denied')} className="ghost-btn" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>Reject</button>
        <button onClick={() => decide('granted')} className="neon-btn" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>Accept</button>
      </div>
    </div>
  );
}

export default function Layout() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showConsent, setShowConsent] = useState(() => {
    if (typeof window === 'undefined') return false;
    return getConsent() === null;
  });

  const [loading, setLoading] = useState(() => {
    if (typeof window === 'undefined') return false;

    // URL override: ?intro=1 forces intro, ?intro=0 skips it
    const params = new URLSearchParams(window.location.search);
    if (params.get('intro') === '0') return false;
    if (params.get('intro') === '1' || params.has('intro')) return true;

    // Display only once per session
    if (sessionStorage.getItem('leonida_loaded')) return false;
    if (window.location.pathname !== '/') return false;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;

    if (navigator.webdriver) return false;
    return true;
  });



  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearchOpen(true); }
    };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('keydown', onKey); };
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="synth-bg" aria-hidden="true" />
      <div className="synth-grid" aria-hidden="true" />
      <Analytics />
      <ScrollToTop />
      {loading && (
        <StarLoader
          onDone={() => {
            setLoading(false);
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('leonida_loaded', '1');
            }
          }}
        />
      )}

      <a href="#main" style={{ position: 'absolute', left: '-9999px' }} onFocus={e => { e.currentTarget.style.left = '16px'; e.currentTarget.style.top = '16px'; e.currentTarget.style.zIndex = '110'; e.currentTarget.style.background = 'var(--color-hot)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.padding = '8px 16px'; e.currentTarget.style.borderRadius = '8px'; }}>
        Skip to content
      </a>

      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        transition: 'all 0.3s',
        background: scrolled ? 'rgba(10,4,24,0.94)' : 'rgba(10,4,24,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <nav style={{ maxWidth: '1200px', margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px', width: '100%', boxSizing: 'border-box' }} aria-label="Main">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', flexShrink: 0 }} aria-label="Explore Leonida home">
            <svg width="26" height="26" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="logograd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B3DFF" />
                  <stop offset="50%" stopColor="#FF4F7A" />
                  <stop offset="100%" stopColor="#FF8A3D" />
                </linearGradient>
              </defs>
              <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="url(#logograd)" />
            </svg>
            <span className="gta-title" style={{ fontSize: 'clamp(1.05rem, 4vw, 1.3rem)' }}>Explore Leonida</span>
          </Link>

          <ul style={{ display: 'flex', alignItems: 'center', gap: '4px', listStyle: 'none', margin: 0, padding: 0, flexWrap: 'nowrap', overflow: 'hidden' }} className="hidden-mobile">
            {NAV.map((n) => (
              <li key={n.to}>
                <NavLink to={n.to} style={({ isActive }) => ({
                  padding: '6px 12px', borderRadius: '8px', textDecoration: 'none',
                  fontFamily: 'var(--font-head)', letterSpacing: '0.06em', textTransform: 'uppercase',
                  fontSize: '0.82rem', transition: 'color 0.2s',
                  color: isActive ? 'var(--color-hot)' : 'rgba(255,255,255,0.75)',
                  display: 'block', whiteSpace: 'nowrap',
                })}>{n.label}</NavLink>
              </li>
            ))}
          </ul>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            <button
              onClick={() => setSearchOpen(true)}
              className="ghost-btn"
              style={{ padding: '6px 10px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              aria-label="Open search (Ctrl+K)"
            >
              <Search size={14} />
              <span className="hidden sm:inline">Search</span>
            </button>
            <Link
              to="/buy"
              className="neon-btn"
              style={{ padding: '6px 12px', fontSize: '0.78rem' }}
            >
              Buy Now
            </Link>
            <button
              style={{ display: 'none', background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '6px' }}
              className="show-mobile"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>

        {menuOpen && (
          <div style={{ background: 'rgba(10,4,24,0.98)', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '16px' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '6px' }}>
              {NAV.map((n) => (
                <li key={n.to}>
                  <NavLink
                    to={n.to}
                    onClick={() => setMenuOpen(false)}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      fontFamily: 'var(--font-head)',
                      fontSize: '1.15rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: isActive ? 'var(--color-hot)' : 'rgba(255,255,255,0.85)',
                      background: isActive ? 'rgba(255, 46, 147, 0.14)' : 'transparent',
                      border: isActive ? '1px solid rgba(255, 46, 147, 0.45)' : '1px solid transparent',
                      boxShadow: isActive ? '0 0 16px rgba(255, 46, 147, 0.25)' : 'none',
                      transition: 'all 0.2s ease',
                    })}
                  >
                    {({ isActive }) => (
                      <>
                        <span>{n.label}</span>
                        {isActive && (
                          <span
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--color-hot)',
                              boxShadow: '0 0 10px var(--color-hot)',
                            }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      <main id="main" style={{
        flex: 1,
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
        padding: isHome ? '0 16px clamp(16px, 4vw, 32px)' : 'clamp(68px, 8vw, 84px) 16px clamp(16px, 4vw, 32px)',
      }}>
        <Outlet />
      </main>

      <footer
        style={{
          marginTop: '80px',
          position: 'relative',
          overflow: 'hidden',
          paddingBottom: 0,
          backgroundImage: "linear-gradient(180deg, rgba(10, 4, 24, 0.92) 0%, rgba(10, 4, 24, 0.72) 40%, rgba(10, 4, 24, 0.52) 70%, rgba(10, 4, 24, 0.85) 100%), url('/gta%206%20trees%20background.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 65%',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Top vibrant GTA 6 neon border line matching the reference image */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, #ff2e93 0%, #ff8a3d 50%, #8b3dff 100%)',
            boxShadow: '0 0 10px rgba(255, 46, 147, 0.6)',
          }}
          aria-hidden="true"
        />

        {/* Upper Content: Brand, Copyright & 4 Navigation Columns */}
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '56px 20px 0', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', justifyContent: 'space-between' }} className="lg:!flex-row lg:!items-start">

            {/* Left: Brand + Copyright + Disclaimer */}
            <div style={{ maxWidth: '340px' }}>
              <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }} aria-label="Explore Leonida home">
                <svg width="26" height="26" viewBox="0 0 100 100">
                  <polygon
                    points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35"
                    fill="#ff2e93"
                    style={{ filter: 'drop-shadow(0 0 8px rgba(255, 46, 147, 0.7))' }}
                  />
                </svg>
                <span
                  style={{
                    fontFamily: 'var(--font-head)',
                    fontSize: '1.45rem',
                    color: '#ff2e93',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    textShadow: '0 0 16px rgba(255, 46, 147, 0.65)',
                  }}
                >
                  Explore Leonida
                </span>
              </Link>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.84rem', marginTop: '16px', lineHeight: 1.6 }}>
                © {new Date().getFullYear()} Explore Leonida. All rights reserved.
              </p>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem', marginTop: '8px', lineHeight: 1.5 }}>
                Unofficial fan site. Not affiliated with Rockstar Games, Take-Two Interactive, Sony or Microsoft.
              </p>
            </div>

            {/* Right: 4 Columns matching reference image */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '32px 24px', flex: 1, maxWidth: '760px' }}>
              {/* Pages */}
              <div>
                <h3 style={{ fontFamily: 'var(--font-head)', color: '#ffffff', fontSize: '0.88rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '14px' }}>Pages</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {NAV.map((n) => (
                    <li key={n.to}>
                      <Link to={n.to} style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontSize: '0.88rem', transition: 'color 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#ff2e93')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
                      >{n.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h3 style={{ fontFamily: 'var(--font-head)', color: '#ffffff', fontSize: '0.88rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '14px' }}>Resources</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { label: 'Site Index', href: '/site-index' },
                    { label: 'Sitemap', href: '/sitemap.xml', external: true },
                    { label: 'llms.txt', href: '/llms.txt', external: true },
                    { label: 'Cheats JSON', href: '/data/cheats.json', external: true },
                  ].map((l) => (
                    <li key={l.href}>
                      {l.external ? (
                        <a
                          href={l.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontSize: '0.88rem', transition: 'color 0.2s' }}
                          onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-sunset)')}
                          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
                        >
                          {l.label}
                        </a>
                      ) : (
                        <Link
                          to={l.href}
                          style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontSize: '0.88rem', transition: 'color 0.2s' }}
                          onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-sunset)')}
                          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
                        >
                          {l.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h3 style={{ fontFamily: 'var(--font-head)', color: '#ffffff', fontSize: '0.88rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '14px' }}>Legal</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { label: 'Privacy Policy', href: '/privacy' },
                    { label: 'Terms of Service', href: '/terms' },
                    { label: 'Disclaimer', href: '/disclaimer' },
                    { label: 'Editorial Policy', href: '/about' },
                    { label: 'Contact Us', href: '/contact' },
                  ].map((l) => (
                    <li key={l.href}>
                      <Link to={l.href} style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontSize: '0.88rem', transition: 'color 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-grape)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
                      >{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Settings */}
              <div>
                <h3 style={{ fontFamily: 'var(--font-head)', color: '#ffffff', fontSize: '0.88rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '14px' }}>Settings</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <li>
                    <button
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          sessionStorage.removeItem('leonida_loaded');
                        }
                        setLoading(true);
                      }}
                      style={{ background: 'none', border: 'none', color: '#ff9e42', cursor: 'pointer', fontSize: '0.88rem', padding: 0, textAlign: 'left', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      className="hover:underline"
                      title="Replay intro star animation"
                    >
                      ✨ Replay Intro
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setShowConsent(true)}
                      style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.65)', cursor: 'pointer', fontSize: '0.88rem', padding: 0, textAlign: 'left' }}
                      className="hover:text-white transition-colors"
                    >
                      Cookie Preferences
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => { if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.65)', cursor: 'pointer', fontSize: '0.88rem', padding: 0, textAlign: 'left', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      className="hover:text-white transition-colors"
                    >
                      <ChevronUp size={14} /> Back to Top
                    </button>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Watermark: "EXPLORE LEONIDA" - Translucent, lighter theme, no border, no star pattern */}
        <div style={{ width: '100%', overflow: 'hidden', userSelect: 'none', pointerEvents: 'none', marginTop: '36px', marginBottom: 0, paddingBottom: 0, lineHeight: 0, display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 10 }}>
          <svg
            viewBox="0 0 1600 240"
            style={{ width: '100%', height: 'auto', maxHeight: '360px', minHeight: '140px', display: 'block', marginBottom: '-6px' }}
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            <defs>
              {/* Lighter translucent gradient allowing the palm trees background to show through cleanly */}
              <linearGradient id="footerTranslucentGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.24" />
                <stop offset="55%" stopColor="#ff79b0" stopOpacity="0.16" />
                <stop offset="100%" stopColor="#b347eb" stopOpacity="0.10" />
              </linearGradient>
            </defs>

            {/* Giant Watermark Text - Light, translucent, borderless */}
            <text
              x="50%"
              y="205"
              textAnchor="middle"
              fontFamily="var(--font-display)"
              fontSize="190"
              fontWeight="900"
              textLength="1520"
              lengthAdjust="spacingAndGlyphs"
              fill="url(#footerTranslucentGrad)"
            >
              EXPLORE LEONIDA
            </text>
          </svg>
        </div>
      </footer>

      <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
      <ConsentBanner open={showConsent} onClose={() => setShowConsent(false)} />

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .hidden-mobile { display: flex !important; }
          .show-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
}
