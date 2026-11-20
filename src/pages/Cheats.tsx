import { useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Check, Copy, Info, Lock, Save, Search, Trophy } from 'lucide-react';
import Seo from '../lib/seo';
import { QuickAnswer, Crumbs, PageHead, Section } from '../components/ui';
import {
  CHEATS, CHEAT_COUNTS, CHEAT_SOURCES, CHEAT_STEPS, CHEAT_RULES, CHEAT_DISPUTES, CHEAT_FAQ,
  CHEAT_CATEGORIES, CHEAT_META, BEST_CHEATS, TOTAL_GUIDES, DATA_UPDATED, arrowText, wordText,
  type Cheat, type CheatCategory,
} from '../data/cheats';
import {
  ButtonSequence, ControllerDiagram, DPadIcon, ShoulderButton, PhoneIcon, StatusPill,
} from '../components/cheats/ControllerButtons';
import { track } from '../lib/analytics';

type CodeFilter = 'all' | 'code' | 'tbc';
const RULE_ICON: Record<string, ReactNode> = {
  story: <Lock size={18} />, saving: <Save size={18} />, trophies: <Trophy size={18} />,
  money: <Info size={18} />, pc: <Info size={18} />, unlock: <Lock size={18} />,
};
const byId = (id: string) => CHEATS.find((c) => c.id === id);

function CheatCard({ c, onCopy, copied }: { c: Cheat; onCopy: (c: Cheat) => void; copied: boolean }) {
  return (
    <article id={c.id} className="glass glass-hover scroll-mt-28 p-5">
      <div className="mb-3 flex flex-wrap items-start gap-3">
        <div className="min-w-[180px] flex-1">
          <h3 className="font-head text-lg text-white">{c.name}</h3>
          <p className="mt-0.5 text-sm text-white/55">{c.effect}</p>
        </div>
        <StatusPill status={c.status} />
      </div>

      {c.sequence ? (
        <div className="mb-3">
          <ButtonSequence sequence={c.sequence} />
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span className="font-mono2 text-xs tracking-wider text-white/60" aria-hidden="true">{arrowText(c.sequence)}</span>
            <button type="button" onClick={() => onCopy(c)} aria-label={`Copy ${c.name} code`}
              className="ghost-btn !px-3 !py-1 !text-xs">
              {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? 'Copied' : 'Copy code'}
            </button>
          </div>
          <p className="sr-only">{wordText(c.sequence)}</p>
        </div>
      ) : (
        <p className="mb-3 rounded-xl border border-dashed border-white/20 px-3 py-2 text-sm text-white/45">
          Code not published yet (TBC). The cheat exists in the game menu, but no guide has listed its D-pad sequence.
        </p>
      )}

      <dl className="grid gap-1 text-[13px] text-white/60 sm:grid-cols-[110px_1fr]">
        <dt className="font-head uppercase tracking-wider text-white/45">Unlock</dt>
        <dd>{c.unlock}</dd>
        <dt className="font-head uppercase tracking-wider text-white/45">Sources</dt>
        <dd>{c.source}</dd>
      </dl>
      {c.dispute && (
        <p className="mt-3 flex gap-2 rounded-xl border border-warn/30 bg-warn/5 px-3 py-2 text-[13px] text-warn/90">
          <AlertTriangle size={15} className="mt-0.5 shrink-0" /> <span><strong>Guides disagree:</strong> {c.dispute}</span>
        </p>
      )}
      {c.note && <p className="mt-2 text-[13px] text-white/50">{c.note}</p>}
    </article>
  );
}

export default function Cheats() {
  const [cat, setCat] = useState<CheatCategory | 'all'>('all');
  const [code, setCode] = useState<CodeFilter>('all');
  const [q, setQ] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return CHEATS.filter((c) =>
      (cat === 'all' || c.category === cat) &&
      (code === 'all' || (code === 'code' ? !!c.sequence : !c.sequence)) &&
      (!s || c.name.toLowerCase().includes(s) || c.effect.toLowerCase().includes(s) || c.unlock.toLowerCase().includes(s)));
  }, [cat, code, q]);

  const copy = (c: Cheat) => {
    if (!c.sequence) return;
    navigator.clipboard?.writeText(arrowText(c.sequence)).catch(() => { });
    setCopied(c.id);
    track('cheat_copy', { cheat_id: c.id });
    setTimeout(() => setCopied(null), 1500);
  };

  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ItemList',
        name: 'GTA 6 cheat codes (PS5 and Xbox Series X|S)',
        numberOfItems: CHEATS.length,
        itemListElement: CHEATS.map((c, i) => ({
          '@type': 'ListItem', position: i + 1, name: c.name,
          description: `${c.effect} Unlock: ${c.unlock}. ${c.sequence ? `D-pad code: ${wordText(c.sequence)}.` : 'Code not yet published (TBC).'}`,
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: CHEAT_FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
    ],
  };

  return (
    <>
      <Seo title={`${CHEAT_META.title} | Explore Leonida`} description={CHEAT_META.description} path="/cheats/ps5" jsonLd={ld} ogImage="/og/cheats.png" />
      <Crumbs items={[{ name: 'Home', path: '/' }, { name: 'Cheats PS5', path: '/cheats/ps5' }]} />
      <PageHead
        h1="GTA 6 Cheat Codes for PS5 (All 61 Cheats)"
        sub="Every cheat in Grand Theft Auto VI with its D-pad code, unlock requirement and a clear label for how well each code is confirmed. Same inputs on PS5 and Xbox."
        updated="19 Nov 2026"
      />

      <QuickAnswer>
        GTA 6 has <strong>{CHEAT_COUNTS.total} cheats</strong>. Finish the story, unlock the cheat, press <strong>Up on the D-pad</strong> to open the phone,
        hold <strong>L1</strong> and press <strong>R1</strong>, then enter the D-pad sequence. Using any cheat <strong>disables saving and trophies</strong> for that session.
        {' '}{CHEAT_COUNTS.withCode} codes are published so far; {CHEAT_COUNTS.tbc} are still TBC. We have not tested them on our own PS5 yet.
      </QuickAnswer>

      {/* stat strip */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          [String(CHEAT_COUNTS.total), 'Cheats in the game'],
          [String(CHEAT_COUNTS.withCode), 'Codes published'],
          [String(CHEAT_COUNTS.tbc), 'Codes still TBC'],
          [`${TOTAL_GUIDES}`, 'Guides cross-checked'],
        ].map(([n, l]) => (
          <div key={l} className="glass p-4 text-center">
            <div className="gta-title text-3xl">{n}</div>
            <div className="mt-1 font-head text-[11px] uppercase tracking-widest text-white/55">{l}</div>
          </div>
        ))}
      </div>

      {/* how to enter */}
      <Section title="How to enter cheats on PS5">
        <div className="glass grid gap-6 p-5 md:grid-cols-[1.05fr_1fr]">
          <ol className="flex flex-col gap-3">
            {CHEAT_STEPS.map((s, i) => (
              <li key={s.title} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sunset to-hot font-head text-sm text-white">{i + 1}</span>
                <div>
                  <h3 className="font-head text-white">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-white/65">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-white/10 bg-black/25 p-4">
            <ControllerDiagram highlight={['dpad', 'l1', 'r1']} />
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="flex items-center gap-2"><DPadIcon dir="UP" size={46} /><span className="text-white/50">→</span><PhoneIcon size={46} /></div>
              <span className="font-head text-white/40">THEN</span>
              <div className="flex items-center gap-2"><ShoulderButton label="L1" hint="Hold" /><span className="text-white/50">+</span><ShoulderButton label="R1" hint="Press" /></div>
            </div>
            <p className="text-center text-xs text-white/50">On Xbox Series X|S: hold LB and press RB. The D-pad directions are the same.</p>
          </div>
        </div>
        <p className="mt-3 text-sm text-white/55">Entry steps are as reported by the guides we cross-checked. We will update the exact timing of the shoulder buttons after testing on PS5.</p>
      </Section>

      {/* rules */}
      <Section title="Rules to know before you cheat">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CHEAT_RULES.map((r) => (
            <div key={r.id} className="glass p-4">
              <div className="mb-1.5 flex items-center gap-2 text-aqua">{RULE_ICON[r.id]}<h3 className="font-head text-white">{r.title}</h3></div>
              <p className="text-sm leading-relaxed text-white/65">{r.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* status legend */}
      <Section title="What the status labels mean">
        <div className="glass flex flex-col gap-3 p-5 text-sm text-white/70">
          <p className="flex flex-wrap items-center gap-2"><StatusPill status="tested" /> We entered the code on a PS5 and recorded it. None yet.</p>
          <p className="flex flex-wrap items-center gap-2"><StatusPill status="community-reported" /> The same code appears in 2 or 3 of the published guides. Not yet tested by us.</p>
          <p className="flex flex-wrap items-center gap-2"><StatusPill status="unverified" /> Only one guide lists the code. Treat it with caution.</p>
          <p className="flex flex-wrap items-center gap-2"><StatusPill status="tbc" /> The cheat exists but nobody has published its sequence. We never guess or reuse GTA V codes.</p>
        </div>
      </Section>

      {/* browser */}
      <Section title={`All GTA 6 cheats (${list.length} shown)`}>
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <button type="button" aria-pressed={cat === 'all'} onClick={() => setCat('all')}
            className={`chip ${cat === 'all' ? 'border-hot text-hot' : 'text-white/55'}`}>All ({CHEATS.length})</button>
          {CHEAT_CATEGORIES.map((c) => (
            <button key={c.id} type="button" aria-pressed={cat === c.id} onClick={() => { setCat(c.id); track('cheat_filter', { category: c.id }); }}
              className={`chip ${cat === c.id ? 'border-hot text-hot' : 'text-white/55'}`}>{c.label} ({c.count})</button>
          ))}
        </div>
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {([['all', 'Any code status'], ['code', 'Code published'], ['tbc', 'Code TBC']] as [CodeFilter, string][]).map(([k, l]) => (
            <button key={k} type="button" aria-pressed={code === k} onClick={() => setCode(k)}
              className={`chip ${code === k ? 'border-aqua text-aqua' : 'text-white/55'}`}>{l}</button>
          ))}
          <div className="relative ml-auto">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search cheats, effects, unlocks…" aria-label="Search cheats"
              className="min-w-[220px] rounded-full border border-white/15 bg-night/70 py-2 pl-9 pr-3 text-sm text-white outline-none focus:border-aqua" />
          </div>
        </div>

        {cat !== 'all' && (
          <p className="mb-4 text-sm text-white/55">{CHEAT_CATEGORIES.find((c) => c.id === cat)?.blurb}</p>
        )}

        {list.length === 0 ? (
          <div className="glass p-8 text-center text-white/60">No cheats match those filters. <button type="button" className="text-hot underline" onClick={() => { setCat('all'); setCode('all'); setQ(''); }}>Reset filters</button></div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {list.map((c) => <CheatCard key={c.id} c={c} onCopy={copy} copied={copied === c.id} />)}
          </div>
        )}
        <p className="mt-3 text-xs text-white/40">Tip: click any D-pad sequence to replay the button presses in order.</p>
      </Section>

      {/* best cheats */}
      <Section title="Best GTA 6 cheats">
        <div className="grid gap-4 md:grid-cols-2">
          {([['Most useful', BEST_CHEATS.useful], ['Most chaotic', BEST_CHEATS.chaos]] as [string, string[]][]).map(([label, ids]) => (
            <div key={label} className="glass p-5">
              <h3 className="mb-3 font-head uppercase tracking-wider text-hot">{label}</h3>
              <ul className="flex flex-col gap-2 text-sm text-white/70">
                {ids.map((id) => { const c = byId(id); if (!c) return null; return (
                  <li key={id} className="flex items-center justify-between gap-3 border-b border-white/5 pb-2">
                    <a href={`#${c.id}`} className="text-white hover:text-aqua">{c.name}</a>
                    <span className="text-right text-xs text-white/45">{c.unlock}</span>
                  </li>); })}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-white/50">Picks follow one guide's recommendations. The "chaos" cheats sit behind large challenge counts, so expect them to be a post-game goal.</p>
      </Section>

      {/* disputes + sources */}
      <Section title="Where the guides disagree">
        <div className="glass p-5">
          <ul className="flex flex-col gap-3 text-sm text-white/70">
            {CHEAT_DISPUTES.map((d) => (
              <li key={d.cheat} className="flex gap-3"><AlertTriangle size={16} className="mt-0.5 shrink-0 text-warn" /><span><strong className="text-white">{d.cheat}:</strong> {d.text}</span></li>
            ))}
          </ul>
        </div>
      </Section>

      <Section title="How we compiled this list">
        <div className="glass p-5 text-sm leading-relaxed text-white/70">
          <p>Data as of {DATA_UPDATED}. We cross-checked {TOTAL_GUIDES} guides published around launch and only call a code <em>Reported</em> when two or more match exactly. We have not entered these codes on a PS5 ourselves yet.</p>
          <ul className="mt-3 flex flex-col gap-2">
            {CHEAT_SOURCES.map((s) => (
              <li key={s.id} className="text-white/60">
                <strong className="text-white">{s.url ? <a href={s.url} rel="noopener nofollow" className="hover:text-aqua">{s.name}</a> : s.name}</strong>
                {s.published ? ` (${s.published})` : ''}: {s.note}
              </li>
            ))}
          </ul>
          <p className="mt-3">Be careful with posters and videos claiming "all working codes" with no proof. Some circulating lists reuse GTA V codes or contain obvious typos.</p>
          <p className="mt-2"><Link to="/about" className="text-hot">How we verify cheats</Link></p>
        </div>
      </Section>

      {/* FAQ */}
      <Section title="GTA 6 cheats FAQ">
        <div className="flex flex-col gap-2">
          {CHEAT_FAQ.map((f) => (
            <details key={f.q} className="glass group p-4">
              <summary className="cursor-pointer list-none select-none font-head text-white marker:content-none">{f.q}</summary>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>

      <div className="mt-10 flex flex-wrap items-center gap-4 text-sm text-white/60">
        <span>Related:</span>
        <Link to="/reviews" className="text-hot">Review scores</Link>
        <Link to="/compare" className="text-hot">Compare games</Link>
        <Link to="/faq" className="text-hot">FAQ</Link>
        <Link to="/buy" className="text-hot">Where to buy</Link>
      </div>
    </>
  );
}