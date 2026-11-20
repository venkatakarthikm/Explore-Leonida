import { useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Search, Users, Sparkles, Clapperboard, X } from 'lucide-react';
import Seo from '../lib/seo';
import { Crumbs, QuickAnswer } from '../components/ui';
import {
  MAJOR_CHARACTERS,
  STRANGERS_AND_FREAKS,
  SUPPORTING_CHARACTERS,
  ALL_ROSTER,
  type Character,
} from '../data/characters';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const REDUCED = '(prefers-reduced-motion: reduce)';

/* ------------------------------------------------------------------ types */
type Shot = { src: string; alt: string; shape: 'tall' | 'wide' };

type VideoBlock = {
  src: string;
  name: string;
  note: string;
  /** CSS object-position, e.g. "50% 40%" or "center top" */
  objectPosition?: string;
  /** Extra zoom (1 = none). Useful with object-position */
  scale?: number;
};

type CharacterBlock = {
  name: string;
  quote: string;
  bio: string;
  bio2?: string;
  shots: Shot[];
  flip?: boolean;
};

type DualScrubProps = {
  first: VideoBlock;
  second: VideoBlock;
};

/* Global look for scrub videos */
const VIDEO_BRIGHTNESS = 1.22;
const VIDEO_CONTRAST = 1.04;

/* -------------------------------------------------------------- helpers */
function unlockVideo(el: HTMLVideoElement | null) {
  if (!el) return;
  el.play()
    .then(() => el.pause())
    .catch(() => {});
  el.currentTime = 0;
  ScrollTrigger.refresh();
}

function videoStyle(pos = '50% 42%', scale = 1): React.CSSProperties {
  return {
    objectPosition: pos,
    filter: `brightness(${VIDEO_BRIGHTNESS}) contrast(${VIDEO_CONTRAST})`,
    transform: scale !== 1 ? `scale(${scale})` : undefined,
    transformOrigin: 'center center',
  };
}

/* ------------------------------------------------------ dual video 1 → 2 */
function DualScrubVideo({ first, second }: DualScrubProps) {
  const wrap = useRef<HTMLElement | null>(null);
  const v1 = useRef<HTMLVideoElement | null>(null);
  const v2 = useRef<HTMLVideoElement | null>(null);

  useGSAP(() => {
    const section = wrap.current;
    const a = v1.current;
    const b = v2.current;
    if (!section || !a || !b) return;
    if (window.matchMedia(REDUCED).matches) return;

    gsap.set(a, { opacity: 1 });
    gsap.set(b, { opacity: 0 });
    gsap.set('[data-label-1]', { opacity: 1 });
    gsap.set('[data-label-2]', { opacity: 0 });

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=320%',
        scrub: 0.65,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // phase 1 - scrub Jason
    tl.fromTo(
      a,
      { currentTime: 0 },
      {
        currentTime: () => Math.max((a.duration || 1) - 0.04, 0),
        duration: 0.42,
      },
      0
    );

    tl.fromTo(
      '[data-label-1] > *',
      { y: 20, opacity: 0.25 },
      { y: 0, opacity: 1, stagger: 0.06, duration: 0.12, ease: 'power2.out' },
      0
    );

    // phase 2 - crossfade to Lucia
    tl.to(a, { opacity: 0, duration: 0.1 }, 0.42);
    tl.to(b, { opacity: 1, duration: 0.1 }, 0.42);
    tl.to('[data-label-1]', { opacity: 0, duration: 0.08 }, 0.42);
    tl.to('[data-label-2]', { opacity: 1, duration: 0.08 }, 0.44);
    tl.set(b, { currentTime: 0 }, 0.42);

    // phase 3 - scrub Lucia
    tl.fromTo(
      b,
      { currentTime: 0 },
      {
        currentTime: () => Math.max((b.duration || 1) - 0.04, 0),
        duration: 0.48,
      },
      0.52
    );

    tl.fromTo(
      '[data-label-2] > *',
      { y: 16, opacity: 0.3 },
      { y: 0, opacity: 1, stagger: 0.06, duration: 0.12, ease: 'power2.out' },
      0.52
    );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  });

  return (
    <section
      ref={wrap}
      aria-label={`${first.name} / ${second.name}`}
      className="relative h-[100svh] min-h-[480px] w-screen overflow-hidden bg-[#0a0418]/95 ml-[calc(50%-50vw)] border-y border-white/10"
    >
      <video
        ref={v1}
        src={first.src}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover will-change-transform"
        style={videoStyle(first.objectPosition ?? '50% -200%', first.scale ?? 1.05)}
        onLoadedMetadata={(e) => unlockVideo(e.currentTarget)}
      />
      <video
        ref={v2}
        src={second.src}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover will-change-transform"
        style={videoStyle(second.objectPosition ?? '90% -140%', second.scale ?? 1.05)}
        onLoadedMetadata={(e) => unlockVideo(e.currentTarget)}
      />

      {/* lighter shade so brighter video still reads */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(10,4,24,0.85)] via-[rgba(10,4,24,0.12)] to-[rgba(10,4,24,0.4)]" />

      {/* Jason - left lower */}
      <div
        data-label-1
        className="absolute bottom-[12%] left-[clamp(20px,5vw,64px)] max-w-[min(90vw,24rem)] md:max-w-[30rem] glass p-5 md:p-6 rounded-2xl border border-white/15 backdrop-blur-md shadow-2xl"
      >
        <span className="inline-block px-2.5 py-0.5 mb-2 text-xs uppercase tracking-widest font-semibold rounded-full bg-sunset/20 text-sunset border border-sunset/40">
          {first.note}
        </span>
        <h2 className="m-0 text-[clamp(2.2rem,6vw,3.8rem)] font-head uppercase leading-[0.95] text-white drop-shadow-md">
          {first.name}
        </h2>
      </div>

      {/* Lucia - right upper */}
      <div
        data-label-2
        className="absolute top-[18%] right-[clamp(20px,5vw,64px)] max-w-[min(90vw,24rem)] text-right md:max-w-[30rem] glass p-5 md:p-6 rounded-2xl border border-white/15 backdrop-blur-md shadow-2xl"
      >
        <span className="inline-block px-2.5 py-0.5 mb-2 text-xs uppercase tracking-widest font-semibold rounded-full bg-hot/20 text-hot border border-hot/40">
          {second.note}
        </span>
        <h2 className="m-0 text-[clamp(2.2rem,6vw,3.8rem)] font-head uppercase leading-[0.95] text-white drop-shadow-md">
          {second.name}
        </h2>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- single video */
function ScrubVideo({
  src,
  name,
  note,
  objectPosition = '50% 42%',
  scale = 1.05,
}: VideoBlock) {
  const wrap = useRef<HTMLElement | null>(null);
  const video = useRef<HTMLVideoElement | null>(null);

  useGSAP(() => {
    const section = wrap.current;
    const el = video.current;
    if (!section || !el) return;
    if (window.matchMedia(REDUCED).matches) return;

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=160%',
        scrub: 0.6,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    tl.fromTo(
      el,
      { currentTime: 0 },
      {
        currentTime: () => Math.max((el.duration || 1) - 0.04, 0),
        duration: 1,
      },
      0
    );

    tl.fromTo(
      section.querySelectorAll('[data-vid-label] > *'),
      { y: 24, opacity: 0.2 },
      { y: 0, opacity: 1, stagger: 0.08, duration: 0.3, ease: 'power2.out' },
      0
    );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  });

  return (
    <section
      ref={wrap}
      aria-label={name}
      className="relative h-[100svh] min-h-[480px] w-screen overflow-hidden bg-[#0a0418]/95 ml-[calc(50%-50vw)] border-y border-white/10"
    >
      <video
        ref={video}
        src={src}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover will-change-transform"
        style={videoStyle(objectPosition, scale)}
        onLoadedMetadata={(e) => unlockVideo(e.currentTarget)}
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(10,4,24,0.85)] via-[rgba(10,4,24,0.12)] to-[rgba(10,4,24,0.4)]" />

      <div
        data-vid-label
        className="absolute bottom-[14%] left-[clamp(20px,5vw,64px)] max-w-[min(90vw,24rem)] md:max-w-[30rem] glass p-5 md:p-6 rounded-2xl border border-white/15 backdrop-blur-md shadow-2xl"
      >
        <span className="inline-block px-2.5 py-0.5 mb-2 text-xs uppercase tracking-widest font-semibold rounded-full bg-aqua/20 text-aqua border border-aqua/40">
          {note}
        </span>
        <h2 className="m-0 text-[clamp(2.2rem,6vw,3.8rem)] font-head uppercase leading-[0.95] text-white drop-shadow-md">
          {name}
        </h2>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- character */
function CharBlock({ name, quote, bio, bio2, shots, flip }: CharacterBlock) {
  return (
    <section
      className={`relative mx-auto grid max-w-[1300px] gap-[clamp(26px,4vw,54px)] px-[clamp(20px,5vw,64px)] py-[clamp(56px,8vw,110px)] lg:grid-cols-[1.02fr_0.98fr] lg:items-start ${
        flip ? '[&_.char-text]:lg:order-2' : ''
      }`}
    >
      <div className="char-text max-w-[60ch] glass p-[clamp(24px,4vw,40px)] rounded-3xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-hot/20 via-grape/10 to-transparent blur-3xl pointer-events-none" />
        <span className="inline-block px-3 py-1 mb-3 text-xs uppercase tracking-wider font-semibold rounded-full bg-hot/15 text-hot border border-hot/30">
          Protagonist
        </span>
        <h2 className="mb-3 gta-title text-[clamp(2.4rem,7vw,4.8rem)] font-black uppercase leading-[0.94]">
          {name}
        </h2>
        <p className="mb-4 text-[clamp(1.15rem,2.4vw,1.5rem)] leading-[1.35] text-sunset font-medium italic">
          "{quote}"
        </p>
        <p className="mb-3 text-[clamp(0.95rem,1.7vw,1.08rem)] leading-[1.7] text-white/80">
          {bio}
        </p>
        {bio2 ? (
          <p className="mb-3 text-[clamp(0.95rem,1.7vw,1.08rem)] leading-[1.7] text-white/70">
            {bio2}
          </p>
        ) : null}
      </div>

      <div className="char-stack grid gap-[clamp(14px,2vw,22px)] will-change-transform">
        {shots.map((shot) => (
          <figure
            key={shot.src}
            className={`m-0 overflow-hidden rounded-2xl glass border border-white/10 transition-all duration-300 hover:border-hot/50 ${
              shot.shape === 'tall' ? 'aspect-[4/5]' : 'aspect-[16/10]'
            }`}
          >
            <img
              src={shot.src}
              alt={shot.alt}
              loading="lazy"
              className="block h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:scale-[1.03]"
            />
          </figure>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------- character portrait avatar */
function CharacterPortrait({ char }: { char: Character }) {
  const [imgFailed, setImgFailed] = useState(false);
  const initials = char.name
    .split(' ')
    .filter((n) => !n.startsWith('(') && !n.startsWith('“') && !n.startsWith('\''))
    .slice(0, 2)
    .map((n) => n[0])
    .join('');

  const gradients = {
    hot: 'from-[#ff2e93]/35 via-[#8b3dff]/25 to-[#0a0418]',
    sunset: 'from-[#ff8a3d]/35 via-[#ff2e93]/20 to-[#0a0418]',
    grape: 'from-[#8b3dff]/35 via-[#19e6d2]/20 to-[#0a0418]',
    aqua: 'from-[#19e6d2]/35 via-[#8b3dff]/20 to-[#0a0418]',
  };

  const borderColors = {
    hot: 'border-[#ff2e93]/25 group-hover:border-[#ff2e93]/60',
    sunset: 'border-[#ff8a3d]/25 group-hover:border-[#ff8a3d]/60',
    grape: 'border-[#8b3dff]/25 group-hover:border-[#8b3dff]/60',
    aqua: 'border-[#19e6d2]/25 group-hover:border-[#19e6d2]/60',
  };

  const badgeGlow = {
    hot: 'text-[#ff2e93] drop-shadow-[0_0_12px_rgba(255,46,147,0.5)]',
    sunset: 'text-[#ff8a3d] drop-shadow-[0_0_12px_rgba(255,138,61,0.5)]',
    grape: 'text-[#8b3dff] drop-shadow-[0_0_12px_rgba(139,61,255,0.5)]',
    aqua: 'text-[#19e6d2] drop-shadow-[0_0_12px_rgba(25,230,210,0.5)]',
  };

  return (
    <div
      className={`relative w-full aspect-[16/10] overflow-hidden rounded-xl bg-gradient-to-br ${gradients[char.accent]} border ${borderColors[char.accent]} transition-all duration-300 flex items-center justify-center`}
    >
      {/* Background stylized synthwave grid overlay */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
        viewBox="0 0 400 250"
        preserveAspectRatio="none"
      >
        <line x1="0" y1="180" x2="400" y2="180" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <line x1="0" y1="210" x2="400" y2="210" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <line x1="0" y1="230" x2="400" y2="230" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <line x1="80" y1="160" x2="40" y2="250" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <line x1="160" y1="160" x2="140" y2="250" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <line x1="240" y1="160" x2="260" y2="250" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <line x1="320" y1="160" x2="360" y2="250" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      </svg>

      {/* Palm leaf silhouette in corner */}
      <div className="absolute -bottom-3 -right-3 opacity-15 pointer-events-none text-white">
        <svg width="110" height="110" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C11 5 8 7 4 8c4 1 6 3 7 7 1-4 3-6 7-7-4-1-6-3-7-6zm-1 8v12h2V10h-2z" />
        </svg>
      </div>

      {char.image && !imgFailed ? (
        <img
          src={char.image}
          alt={`GTA 6 character ${char.name} - ${char.role}`}
          onError={() => setImgFailed(true)}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        /* GTA Leonida stylized character dossier badge */
        <div className="relative z-10 flex flex-col items-center justify-center p-4 text-center">
          <div className="w-14 h-14 rounded-2xl glass border border-white/20 flex items-center justify-center mb-1.5 shadow-xl group-hover:scale-105 transition-transform duration-300">
            <span className={`font-head text-2xl tracking-wider ${badgeGlow[char.accent]}`}>
              {initials || 'GTA'}
            </span>
          </div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-white/50">
            Leonida Dossier
          </span>
        </div>
      )}

      {/* Category Pill on top-left of photo */}
      <div className="absolute top-2.5 left-2.5 z-20">
        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-black/60 backdrop-blur-md text-white/90 border border-white/15">
          {char.category === 'major'
            ? 'Major Lead'
            : char.category === 'strangers'
            ? 'Strangers & Freaks'
            : 'Supporting'}
        </span>
      </div>

      {/* Role tag on bottom-left */}
      {char.role && (
        <div className="absolute bottom-2.5 left-2.5 z-20">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-black/70 backdrop-blur-md text-white/80 border border-white/10">
            {char.role}
          </span>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------- character card */
function CharacterCard({ char }: { char: Character }) {
  const accentBorder = {
    hot: 'hover:border-[#ff2e93]/50',
    sunset: 'hover:border-[#ff8a3d]/50',
    grape: 'hover:border-[#8b3dff]/50',
    aqua: 'hover:border-[#19e6d2]/50',
  };

  return (
    <article
      className={`group glass glass-hover p-4 sm:p-5 rounded-2xl border border-white/10 flex flex-col justify-between transition-all duration-300 ${accentBorder[char.accent]}`}
    >
      <div>
        <CharacterPortrait char={char} />

        <div className="mt-4">
          <h3 className="font-head text-xl sm:text-2xl uppercase tracking-wide text-white group-hover:text-sunset transition-colors">
            {char.name}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            {char.actor && char.actor !== 'n/a' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-sunset/15 text-sunset border border-sunset/30">
                <Clapperboard size={13} />
                <span>{char.actor}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-white/5 text-white/40 border border-white/10">
                <Users size={13} />
                <span>Actor unconfirmed</span>
              </span>
            )}
          </div>

          <p className="mt-3 text-sm text-white/75 leading-relaxed">
            {char.description}
          </p>
        </div>
      </div>
    </article>
  );
}

/* ----------------------------------------- character roster directory */
function CharacterRosterSection() {
  const [activeTab, setActiveTab] = useState<'all' | 'major' | 'strangers' | 'supporting'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    let list = ALL_ROSTER;
    if (activeTab === 'major') list = MAJOR_CHARACTERS;
    else if (activeTab === 'strangers') list = STRANGERS_AND_FREAKS;
    else if (activeTab === 'supporting') list = SUPPORTING_CHARACTERS;

    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase().trim();
    return list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.actor && c.actor.toLowerCase().includes(q)) ||
        c.description.toLowerCase().includes(q) ||
        (c.role && c.role.toLowerCase().includes(q))
    );
  }, [activeTab, searchQuery]);

  return (
    <section className="relative mx-auto box-border max-w-[1300px] px-[clamp(20px,5vw,64px)] py-[clamp(48px,8vw,96px)] pb-[clamp(72px,12vw,140px)]">
      {/* Section Header */}
      <div className="text-center max-w-[820px] mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-sunset/15 text-sunset border border-sunset/30 mb-3">
          <Sparkles size={14} />
          <span>Full Leonida Character Directory</span>
        </div>
        <h2 className="gta-title text-[clamp(2.2rem,5vw,3.6rem)] uppercase font-black leading-tight mb-3">
          The Residents of Leonida
        </h2>
        <p className="text-white/75 text-[clamp(0.95rem,1.6vw,1.1rem)] leading-relaxed">
          From Vice City kingpins and record label moguls to Everglades hunters, crop-duster pilots, and bank heist crews.
          Browse all confirmed residents, quest givers, and actors across Leonida.
        </p>
      </div>

      {/* Filter Tabs + Search Controls */}
      <div className="glass p-3 sm:p-4 rounded-2xl border border-white/10 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-head uppercase tracking-wider transition-all ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-sunset to-hot text-white shadow-[0_0_15px_rgba(255,46,147,0.4)]'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            All Cast ({ALL_ROSTER.length})
          </button>
          <button
            onClick={() => setActiveTab('major')}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-head uppercase tracking-wider transition-all ${
              activeTab === 'major'
                ? 'bg-gradient-to-r from-sunset to-hot text-white shadow-[0_0_15px_rgba(255,46,147,0.4)]'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            Major ({MAJOR_CHARACTERS.length})
          </button>
          <button
            onClick={() => setActiveTab('strangers')}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-head uppercase tracking-wider transition-all ${
              activeTab === 'strangers'
                ? 'bg-gradient-to-r from-sunset to-hot text-white shadow-[0_0_15px_rgba(255,46,147,0.4)]'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            Strangers &amp; Freaks ({STRANGERS_AND_FREAKS.length})
          </button>
          <button
            onClick={() => setActiveTab('supporting')}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-head uppercase tracking-wider transition-all ${
              activeTab === 'supporting'
                ? 'bg-gradient-to-r from-sunset to-hot text-white shadow-[0_0_15px_rgba(255,46,147,0.4)]'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            Supporting ({SUPPORTING_CHARACTERS.length})
          </button>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search characters or actors..."
            className="w-full pl-10 pr-9 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 text-sm focus:outline-none focus:border-hot focus:ring-1 focus:ring-hot transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Character Cards Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((char) => (
            <CharacterCard key={char.id} char={char} />
          ))}
        </div>
      ) : (
        <div className="glass p-12 rounded-2xl text-center border border-white/10">
          <p className="text-white/60 text-lg mb-3">No characters found matching "{searchQuery}"</p>
          <button
            onClick={() => setSearchQuery('')}
            className="neon-btn text-xs py-2 px-4"
          >
            Clear Search
          </button>
        </div>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------- page */
export default function Characters() {
  const page = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (window.matchMedia(REDUCED).matches) return;

      gsap.utils.toArray<HTMLElement>('.char-stack').forEach((stack) => {
        gsap.fromTo(
          stack,
          { y: 70 },
          {
            y: -70,
            ease: 'none',
            scrollTrigger: {
              trigger: stack,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          }
        );
      });
    },
    { scope: page }
  );

  return (
    <div ref={page} className="relative w-full overflow-x-clip text-white">
      <Seo
        title="GTA 6 Characters & Cast - Jason, Lucia & Full Leonida Roster"
        description="Meet GTA 6's two leads Jason Duval and Lucia Caminos, alongside over 50 confirmed major characters, actors, strangers & freaks, and supporting cast across Leonida."
        path="/characters"
        ogImage="/og/characters.png"
      />

      {/* Centered intro */}
      <div className="mx-auto box-border w-full max-w-[1200px] px-[clamp(20px,5vw,64px)] pt-6">
        <Crumbs
          items={[
            { name: 'Home', path: '/' },
            { name: 'Characters', path: '/characters' },
          ]}
        />

        <header className="py-[clamp(24px,5vh,54px)] pb-[clamp(12px,2vh,24px)]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-hot/15 text-hot border border-hot/30 mb-3">
            <span className="w-2 h-2 rounded-full bg-hot animate-pulse" />
            Leonida • Confirmed Cast &amp; Dossiers
          </div>
          <h1 className="gta-title text-[clamp(2.4rem,6.8vw,4.5rem)] leading-[1.0] mb-3">
            Jason &amp; Lucia: The Two Leads
          </h1>
          <p className="m-0 max-w-[65ch] text-[clamp(1rem,1.7vw,1.15rem)] leading-[1.65] text-white/80">
            A parolee who wants an easy life and a woman who has already decided she is done
            waiting: the first GTA story told through a duo. Scroll through cinematics frame by frame,
            then explore the complete Leonida cast below.
          </p>
        </header>

        <QuickAnswer>
          Jason Duval and Lucia Caminos are the two playable protagonists of GTA VI. Lucia is the
          first female lead in a mainline GTA; the pair meet in Leonida and their botched score sets
          the story in motion. Explore the pair above, and scroll down for the complete roster of over 50
          confirmed major characters, strangers &amp; freaks, and supporting cast across Leonida.
        </QuickAnswer>
      </div>

      {/* Scrub Video 1 & 2 */}
      <DualScrubVideo
        first={{
          src: '/videos/output1.mp4',
          name: 'Jason Duval',
          note: 'Meet Jason: Leonida Keys',
          objectPosition: '48% 28%',
          scale: 1.08,
        }}
        second={{
          src: '/videos/output2.mp4',
          name: 'Lucia Caminos',
          note: 'Only smart moves',
          objectPosition: '55% 32%',
          scale: 1.08,
        }}
      />

      <CharBlock
        name="Jason Duval"
        quote="Jason wants an easy life, but things just keep getting harder."
        bio="Jason grew up around grifters and crooks. After a stint in the Army trying to shake off his troubled teens, he found himself in the Keys doing what he knows best: working for local drug runners."
        bio2="It might be time to try something new."
        shots={[
          {
            src: '/images/jason-1.webp',
            alt: 'GTA 6 protagonist Jason Duval on a neon-lit Leonida street',
            shape: 'tall',
          },
          { src: '/images/jason-2.webp', alt: 'GTA 6 Jason Duval official character portrait', shape: 'wide' },
          {
            src: '/images/jason-3.webp',
            alt: 'GTA 6 Jason Duval on the Leonida coast near Key Lento',
            shape: 'tall',
          },
        ]}
      />

      <CharBlock
        name="Lucia Caminos"
        quote="Lucia's father taught her to fight as soon as she could walk."
        bio="Life has been coming at her swinging ever since. Fighting for her family landed her in the Leonida Penitentiary - sheer luck got her out. Lucia has learned her lesson: only smart moves from here."
        bio2="More than anything, Lucia wants the good life her mom dreamed of since their days in Liberty City - and she is prepared to take matters into her own hands."
        flip
        shots={[
          {
            src: '/images/lucia-1.webp',
            alt: 'GTA 6 protagonist Lucia Caminos under neon nightclub lights in Vice City',
            shape: 'tall',
          },
          { src: '/images/lucia-2.webp', alt: 'GTA 6 Lucia Caminos official character portrait', shape: 'wide' },
          {
            src: '/images/lucia-3.webp',
            alt: 'GTA 6 Lucia Caminos beside a getaway pickup truck in Leonida',
            shape: 'tall',
          },
        ]}
      />

      {/* Scrub Video 3 */}
      <ScrubVideo
        src="/videos/output3.mp4"
        name="Jason & Lucia"
        note="Ride or die"
        objectPosition="50% 40%"
        scale={1.06}
      />

      {/* Character Roster Section (All 52+ Characters after 3rd video) */}
      <CharacterRosterSection />
    </div>
  );
}
