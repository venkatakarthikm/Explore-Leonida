import { useEffect, useId, useState } from 'react';
import type { CheatStatus, Dir } from '../../data/cheats';

/* ============================================================================
   Realistic PS5 (DualSense-style) button components. Pure SVG + Tailwind, no images.
   Save as: src/components/cheats/ControllerButtons.tsx
   ========================================================================== */

const GLOW = '#19e6d2';
const DIR_LABEL: Record<Dir, string> = { UP: 'Up', DOWN: 'Down', LEFT: 'Left', RIGHT: 'Right' };

const ARMS: Record<Dir, { x: number; y: number; w: number; h: number }> = {
  UP: { x: 22, y: 5, w: 20, h: 24 },
  DOWN: { x: 22, y: 35, w: 20, h: 24 },
  LEFT: { x: 5, y: 22, w: 24, h: 20 },
  RIGHT: { x: 35, y: 22, w: 24, h: 20 },
};
const TRI: Record<Dir, string> = {
  UP: '32,10 27,19 37,19',
  DOWN: '32,54 27,45 37,45',
  LEFT: '10,32 19,27 19,37',
  RIGHT: '54,32 45,27 45,37',
};

/* ---------- D-pad with ONE pressed arm ---------- */
export function DPadIcon({
  dir, size = 44, pressed = false, decorative = false,
}: { dir: Dir; size?: number; pressed?: boolean; decorative?: boolean }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg
      viewBox="0 0 64 64" width={size} height={size}
      role={decorative ? undefined : 'img'} aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : `D-pad ${DIR_LABEL[dir]}`}
      className={`shrink-0 transition-transform duration-150 ${pressed ? 'scale-110' : ''}`}
    >
      <defs>
        <radialGradient id={`${id}p`} cx="50%" cy="30%" r="80%">
          <stop offset="0" stopColor="#2c3046" /><stop offset="1" stopColor="#0b0c14" />
        </radialGradient>
        <linearGradient id={`${id}d`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4b4f69" /><stop offset="1" stopColor="#21233a" />
        </linearGradient>
        <linearGradient id={`${id}a`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#8ff0e6" />
        </linearGradient>
      </defs>
      {/* socket plate */}
      <circle cx="32" cy="32" r="31" fill={`url(#${id}p)`} stroke="rgba(255,255,255,.16)" />
      <circle cx="32" cy="32" r="28.5" fill="none" stroke="rgba(0,0,0,.6)" />
      {(Object.keys(ARMS) as Dir[]).map((d) => {
        const a = ARMS[d]; const on = d === dir;
        return (
          <g key={d}>
            <rect x={a.x} y={a.y} width={a.w} height={a.h} rx="6"
              fill={on ? `url(#${id}a)` : `url(#${id}d)`}
              stroke={on ? '#ffffff' : 'rgba(255,255,255,.12)'} strokeWidth="1"
              style={on ? { filter: `drop-shadow(0 0 ${pressed ? 9 : 5}px ${GLOW})` } : undefined} />
            <polygon points={TRI[d]} fill={on ? '#0b3a40' : 'rgba(255,255,255,.26)'} />
          </g>
        );
      })}
      <rect x="22" y="22" width="20" height="20" rx="3" fill={`url(#${id}d)`} />
      <circle cx="32" cy="32" r="3.2" fill="rgba(0,0,0,.4)" />
    </svg>
  );
}

/* ---------- PlayStation face buttons (for legends / diagram) ---------- */
export type Face = 'triangle' | 'circle' | 'cross' | 'square';
const FACE_COLOR: Record<Face, string> = { triangle: '#3ee0b0', circle: '#ff5b6e', cross: '#6f9bff', square: '#f08ad6' };

function FaceSymbol({ kind }: { kind: Face }) {
  const c = FACE_COLOR[kind];
  const p = { fill: 'none', stroke: c, strokeWidth: 2.2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  if (kind === 'triangle') return <path d="M12 6 L18.5 17.5 H5.5 Z" {...p} />;
  if (kind === 'circle') return <circle cx="12" cy="12" r="6.2" {...p} />;
  if (kind === 'cross') return <path d="M6.5 6.5 L17.5 17.5 M17.5 6.5 L6.5 17.5" {...p} />;
  return <rect x="6" y="6" width="12" height="12" rx="1.2" {...p} />;
}

export function FaceButton({ kind, size = 36 }: { kind: Face; size?: number }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} role="img" aria-label={kind} className="shrink-0">
      <defs>
        <radialGradient id={id} cx="50%" cy="30%" r="80%"><stop offset="0" stopColor="#3a3d55" /><stop offset="1" stopColor="#12131d" /></radialGradient>
      </defs>
      <circle cx="12" cy="12" r="11.2" fill={`url(#${id})`} stroke="rgba(255,255,255,.18)" strokeWidth=".6" />
      <ellipse cx="12" cy="6.5" rx="7" ry="3.2" fill="rgba(255,255,255,.09)" />
      <FaceSymbol kind={kind} />
    </svg>
  );
}

/* ---------- Shoulder bumper (L1 / R1) ---------- */
export function ShoulderButton({ label, hint, active = true }: { label: 'L1' | 'R1' | 'LB' | 'RB'; hint?: string; active?: boolean }) {
  const id = useId().replace(/:/g, '');
  return (
    <span className="inline-flex flex-col items-center gap-1">
      <svg viewBox="0 0 88 36" width="88" height="36" role="img" aria-label={`${label} button`}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f3f4fa" /><stop offset=".55" stopColor="#c9ccdc" /><stop offset="1" stopColor="#8a8ea6" />
          </linearGradient>
        </defs>
        <path d="M4 32 C4 12 18 5 44 5 C70 5 84 12 84 32 Z" fill={`url(#${id})`}
          stroke={active ? '#ff2e93' : 'rgba(255,255,255,.2)'} strokeWidth="1.6"
          style={active ? { filter: 'drop-shadow(0 0 7px rgba(255,46,147,.75))' } : undefined} />
        <path d="M12 26 C14 15 26 10 44 10 C62 10 74 15 76 26" fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="1.2" />
        <text x="44" y="27" textAnchor="middle" fontFamily="Anton, Impact, sans-serif" fontSize="15" fill="#161827" letterSpacing="1">{label}</text>
      </svg>
      {hint && <span className="font-head text-[10px] uppercase tracking-[.2em] text-white/55">{hint}</span>}
    </span>
  );
}

/* ---------- Phone ---------- */
export function PhoneIcon({ size = 44 }: { size?: number }) {
  return (
    <svg viewBox="0 0 40 64" width={size * 0.62} height={size} role="img" aria-label="In-game phone" className="shrink-0">
      <rect x="3" y="2" width="34" height="60" rx="8" fill="#14151f" stroke="rgba(255,255,255,.25)" strokeWidth="1.5" />
      <rect x="7" y="9" width="26" height="42" rx="3" fill="#2a1450" />
      <rect x="7" y="9" width="26" height="42" rx="3" fill="url(#phoneglow)" />
      <defs>
        <linearGradient id="phoneglow" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ff8a3d" stopOpacity=".55" /><stop offset="1" stopColor="#ff2e93" stopOpacity=".55" /></linearGradient>
      </defs>
      <rect x="14" y="55" width="12" height="3" rx="1.5" fill="rgba(255,255,255,.35)" />
      <rect x="15" y="4.5" width="10" height="2" rx="1" fill="rgba(255,255,255,.3)" />
    </svg>
  );
}

/* ---------- Simplified top-view DualSense with highlighted parts ---------- */
export function ControllerDiagram({ highlight = [] as ('dpad' | 'l1' | 'r1')[], className = '' }: { highlight?: ('dpad' | 'l1' | 'r1')[]; className?: string }) {
  const id = useId().replace(/:/g, '');
  const on = (k: 'dpad' | 'l1' | 'r1') => highlight.includes(k);
  const hl = { stroke: '#ff2e93', strokeWidth: 2.2, style: { filter: 'drop-shadow(0 0 8px rgba(255,46,147,.9))' } };
  const dpad = { stroke: GLOW, strokeWidth: 2.2, style: { filter: `drop-shadow(0 0 8px ${GLOW})` } };
  return (
    <svg viewBox="0 0 400 250" className={`w-full max-w-[460px] ${className}`} role="img" aria-label="DualSense controller: D-pad, L1 and R1 highlighted">
      <defs>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f6f7fb" /><stop offset="1" stopColor="#b9bdd0" /></linearGradient>
        <radialGradient id={`${id}k`} cx="50%" cy="35%" r="75%"><stop offset="0" stopColor="#3b3e57" /><stop offset="1" stopColor="#10111a" /></radialGradient>
      </defs>
      {/* shoulder bumpers */}
      <rect x="72" y="18" width="84" height="18" rx="9" fill={`url(#${id}s)`} {...(on('l1') ? hl : { stroke: 'rgba(255,255,255,.25)' })} className={on('l1') ? 'animate-pulse' : ''} />
      <rect x="244" y="18" width="84" height="18" rx="9" fill={`url(#${id}s)`} {...(on('r1') ? hl : { stroke: 'rgba(255,255,255,.25)' })} className={on('r1') ? 'animate-pulse' : ''} />
      <text x="114" y="12" textAnchor="middle" fontFamily="Anton, Impact, sans-serif" fontSize="13" fill={on('l1') ? '#ff2e93' : 'rgba(255,255,255,.55)'}>L1</text>
      <text x="286" y="12" textAnchor="middle" fontFamily="Anton, Impact, sans-serif" fontSize="13" fill={on('r1') ? '#ff2e93' : 'rgba(255,255,255,.55)'}>R1</text>
      {/* shell */}
      <path d="M78 58 C96 42 150 36 200 36 C250 36 304 42 322 58 C352 84 384 152 374 206 C369 234 340 240 320 218 C300 196 286 180 264 180 L136 180 C114 180 100 196 80 218 C60 240 31 234 26 206 C16 152 48 84 78 58 Z"
        fill={`url(#${id}s)`} stroke="rgba(0,0,0,.25)" strokeWidth="1.5" />
      {/* black centre */}
      <path d="M150 42 H250 C256 42 260 46 259 52 L246 160 C245 170 238 176 228 176 H172 C162 176 155 170 154 160 L141 52 C140 46 144 42 150 42 Z" fill="#171824" />
      <rect x="168" y="50" width="64" height="38" rx="10" fill="#2a2c40" />
      <circle cx="200" cy="124" r="7" fill="#3a3d56" />
      {/* sticks */}
      {[162, 238].map((cx) => (
        <g key={cx}><circle cx={cx} cy="154" r="20" fill="#0b0c13" /><circle cx={cx} cy="154" r="14" fill={`url(#${id}k)`} stroke="rgba(255,255,255,.15)" /></g>
      ))}
      {/* D-pad */}
      <g {...(on('dpad') ? { className: 'animate-pulse' } : {})}>
        <circle cx="104" cy="96" r="30" fill="#0f1019" {...(on('dpad') ? dpad : { stroke: 'rgba(0,0,0,.3)' })} />
        <path d="M95 76 h18 v14 h14 v18 h-14 v14 h-18 v-14 h-14 v-18 h14 z" fill={on('dpad') ? '#e9fffc' : '#2b2e45'} />
        <polygon points="104,80 99,88 109,88" fill={on('dpad') ? '#0b3a40' : 'rgba(255,255,255,.3)'} />
      </g>
      {/* face buttons */}
      {([['triangle', 296, 70], ['square', 270, 96], ['circle', 322, 96], ['cross', 296, 122]] as [Face, number, number][]).map(([k, x, y]) => (
        <g key={k} transform={`translate(${x - 14} ${y - 14})`}>
          <svg viewBox="0 0 24 24" width="28" height="28"><circle cx="12" cy="12" r="11.2" fill="#1b1c2a" stroke="rgba(0,0,0,.35)" strokeWidth=".6" /><FaceSymbol kind={k} /></svg>
        </g>
      ))}
    </svg>
  );
}

/* ---------- Full cheat sequence: realistic D-pad icons, click to replay the press animation ---------- */
const titleCase = (d: Dir) => DIR_LABEL[d];

export function ButtonSequence({ sequence, size = 42, autoplayOnMount = false }: { sequence: Dir[]; size?: number; autoplayOnMount?: boolean }) {
  const [step, setStep] = useState(autoplayOnMount ? 0 : -1);

  useEffect(() => {
    if (step < 0) return;
    const t = setTimeout(() => setStep((s) => (s + 1 >= sequence.length ? -1 : s + 1)), 320);
    return () => clearTimeout(t);
  }, [step, sequence.length]);

  return (
    <button
      type="button"
      onClick={() => setStep(0)}
      title="Click to replay the button presses"
      aria-label={`D-pad sequence: ${sequence.map(titleCase).join(', ')}. Click to replay.`}
      className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-black/35 p-2.5 text-left transition hover:border-aqua/60 focus-visible:border-aqua focus-visible:outline-none"
    >
      {sequence.map((d, i) => (
        <span key={i} className={`relative transition ${step === i ? '-translate-y-0.5' : ''} ${step >= 0 && step !== i ? 'opacity-60' : ''}`}>
          <DPadIcon dir={d} size={size} pressed={step === i} decorative />
          <span className="absolute -left-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-night px-1 font-mono2 text-[9px] text-white/70 ring-1 ring-white/20">{i + 1}</span>
        </span>
      ))}
    </button>
  );
}

/* ---------- Status pill ---------- */
const PILL: Record<CheatStatus, { label: string; cls: string }> = {
  official: { label: 'Official', cls: 'border-ok/60 bg-ok/15 text-ok' },
  tested: { label: 'Tested on PS5', cls: 'border-ok/60 bg-ok/15 text-ok' },
  'community-reported': { label: 'Reported', cls: 'border-aqua/60 bg-aqua/10 text-aqua' },
  unverified: { label: 'Single source', cls: 'border-warn/60 bg-warn/10 text-warn' },
  tbc: { label: 'Code unknown', cls: 'border-white/20 bg-white/5 text-white/55' },
};
export function StatusPill({ status }: { status: CheatStatus }) {
  const p = PILL[status];
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-head text-[11px] uppercase tracking-wider ${p.cls}`}>{p.label}</span>;
}