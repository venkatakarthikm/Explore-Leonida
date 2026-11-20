import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUp, ArrowLeft, ArrowRight, Triangle, Circle, X as XIcon, Square } from 'lucide-react';
import { Head } from 'vite-react-ssg';
import { breadcrumb } from '../lib/seo';

export function QuickAnswer({ children }: { children: ReactNode }) {
  return (
    <aside className="glass p-5 mb-8" style={{ border: '1px solid rgba(255,255,255,0.12)' }} aria-label="Quick answer">
      <p className="font-head text-xs uppercase tracking-widest mb-1.5" style={{ color: 'var(--color-hot)', fontFamily: 'var(--font-head)' }}>Quick answer</p>
      <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6 }}>{children}</p>
    </aside>
  );
}

export function Crumbs({ items }: { items: { name: string; path: string }[] }) {
  const data = breadcrumb(items);
  return (
    <>
      <Head>
        <script type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      </Head>
      <nav aria-label="Breadcrumb" style={{ marginBottom: '16px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
        {items.map((it, i) => (
          <span key={it.path}>
            {i > 0 && <span style={{ margin: '0 6px' }}>/</span>}
            {i === items.length - 1
              ? <span style={{ color: 'rgba(255,255,255,0.8)' }}>{it.name}</span>
              : <Link to={it.path} style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-hot)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}>{it.name}</Link>}
          </span>
        ))}
      </nav>
    </>
  );
}

export function PageHead({ h1, sub, updated }: { h1: string; sub: string; updated: string }) {
  return (
    <header style={{ marginBottom: '24px' }}>
      <h1 className="gta-title" style={{ fontSize: 'clamp(1.8rem,5vw,3rem)', lineHeight: 1.1 }}>{h1}</h1>
      <p style={{ marginTop: '12px', maxWidth: '720px', color: '#cbd5e1', lineHeight: 1.6 }}>{sub}</p>
      <span className="chip" style={{ marginTop: '10px', color: 'var(--color-warn)', borderColor: 'rgba(255,176,32,0.4)', display: 'inline-flex' }}>
        Updated {updated}
      </span>
    </header>
  );
}

export function StatusBadge({ status }: { status: string }) {
  if (status === 'official' || status === 'tested')
    return <span className="chip glow-pulse" style={{ background: 'rgba(46,229,157,0.15)', color: 'var(--color-ok)', borderColor: 'rgba(46,229,157,0.5)' }}>✓ WORKING</span>;
  return <span className="chip" style={{ background: 'rgba(255,176,32,0.1)', color: 'var(--color-warn)', borderColor: 'rgba(255,176,32,0.5)' }}>⚠ Unverified</span>;
}

const GLYPHS: Record<string, ReactNode> = {
  UP: <ArrowUp size={12} />, DOWN: <ArrowDown size={12} />, LEFT: <ArrowLeft size={12} />, RIGHT: <ArrowRight size={12} />,
  TRIANGLE: <Triangle size={12} />, CIRCLE: <Circle size={12} />, CROSS: <XIcon size={12} />, SQUARE: <Square size={12} />,
};

export function Glyph({ b }: { b: string }) {
  return (
    <span
      style={{
        display: 'inline-flex', height: '28px', minWidth: '28px',
        alignItems: 'center', justifyContent: 'center',
        borderRadius: '6px', border: '1px solid rgba(255,255,255,0.25)',
        background: 'rgba(36,16,72,0.8)', padding: '0 4px',
        fontFamily: 'var(--font-mono)', fontSize: '10px',
        color: 'var(--color-aqua)',
      }}
      role="img" aria-label={b}
    >
      {GLYPHS[b] ?? b}
    </span>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ marginTop: '40px' }}>
      <h2 className="font-head" style={{ fontSize: '1.4rem', color: 'var(--color-sunset)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px', fontFamily: 'var(--font-head)' }}>{title}</h2>
      {children}
    </section>
  );
}

import SixStarLoader from './SixStarLoader';
export { SixStarLoader };

export function StarRating({ n = 6, size = 22 }: { n?: number; size?: number }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
      <SixStarLoader size={size} gap={8} />
    </div>
  );
}
