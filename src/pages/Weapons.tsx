import { useState, useMemo } from 'react';
import {
  Search,
  Crosshair,
  Shield,
  Zap,
  Target,
  Sparkles,
  ChevronDown,
  X,
  ExternalLink,
  Layers,
  Wrench,
  CheckCircle2,
} from 'lucide-react';
import Seo from '../lib/seo';
import { Crumbs, QuickAnswer } from '../components/ui';
import { track } from '../lib/analytics';
import {
  WEAPONS_DATABASE,
  REAL_LIFE_WEAPONS,
  CONFIRMED_EQUIPMENT,
  COMBAT_FEATURES,
  WEAPON_FAQS,
  AMMO_TYPES,
  type Weapon,
} from '../data/weapons';

/* ----------------------------------------------------------- weapon image */
function WeaponImage({ weapon }: { weapon: Weapon }) {
  const [activeImg, setActiveImg] = useState<string | undefined>(
    weapon.image || (weapon.gallery && weapon.gallery[0])
  );
  const [imgFailed, setImgFailed] = useState(false);

  const gradients = {
    hot: 'from-[#ff2e93]/25 via-[#8b3dff]/20 to-[#0a0418]',
    sunset: 'from-[#ff8a3d]/25 via-[#ff2e93]/15 to-[#0a0418]',
    grape: 'from-[#8b3dff]/25 via-[#19e6d2]/15 to-[#0a0418]',
    aqua: 'from-[#19e6d2]/25 via-[#8b3dff]/15 to-[#0a0418]',
  };

  const borders = {
    hot: 'border-[#ff2e93]/30 group-hover:border-[#ff2e93]/70',
    sunset: 'border-[#ff8a3d]/30 group-hover:border-[#ff8a3d]/70',
    grape: 'border-[#8b3dff]/30 group-hover:border-[#8b3dff]/70',
    aqua: 'border-[#19e6d2]/30 group-hover:border-[#19e6d2]/70',
  };

  return (
    <div
      className={`relative w-full aspect-[16/9] overflow-hidden rounded-xl bg-gradient-to-br ${gradients[weapon.accent]} border ${borders[weapon.accent]} transition-all duration-300 flex items-center justify-center p-3`}
    >
      {/* Background blueprint grid watermark */}
      <svg
        className="absolute inset-0 w-full h-full opacity-15 pointer-events-none"
        viewBox="0 0 320 180"
        preserveAspectRatio="none"
      >
        <line x1="0" y1="45" x2="320" y2="45" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
        <line x1="0" y1="90" x2="320" y2="90" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
        <line x1="0" y1="135" x2="320" y2="135" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
        <line x1="80" y1="0" x2="80" y2="180" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
        <line x1="160" y1="0" x2="160" y2="180" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
        <line x1="240" y1="0" x2="240" y2="180" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
      </svg>

      {activeImg && !imgFailed ? (
        <img
          src={activeImg}
          alt={`GTA 6 ${weapon.name} - ${weapon.type} weapon in Leonida`}
          onError={() => setImgFailed(true)}
          className="relative z-10 max-h-full max-w-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        /* Stylized GTA VI Arsenal Lockup Placeholder */
        <div className="relative z-10 flex flex-col items-center justify-center text-center p-2">
          <div className="w-12 h-12 rounded-xl glass border border-white/20 flex items-center justify-center mb-1 text-sunset drop-shadow-md">
            <Crosshair size={24} />
          </div>
          <span className="font-head text-sm tracking-wider uppercase text-white/90">
            {weapon.type}
          </span>
          <span className="text-[10px] uppercase font-mono tracking-widest text-white/50">
            {weapon.manufacturer || 'Leonida Ordnance'}
          </span>
        </div>
      )}

      {/* Top Left: Status Pill */}
      <div className="absolute top-2.5 left-2.5 z-20">
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase backdrop-blur-md border ${
            weapon.status.includes('Confirmed')
              ? 'bg-ok/20 text-ok border-ok/40'
              : 'bg-black/60 text-white/80 border-white/15'
          }`}
        >
          {weapon.status}
        </span>
      </div>

      {/* Top Right: Type Tag */}
      <div className="absolute top-2.5 right-2.5 z-20">
        <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-black/60 backdrop-blur-md text-white/70 border border-white/10">
          {weapon.type}
        </span>
      </div>

      {/* Bottom Gallery Thumbnails if available */}
      {weapon.gallery && weapon.gallery.length > 1 && (
        <div className="absolute bottom-2 right-2 z-20 flex gap-1 bg-black/60 backdrop-blur-sm p-1 rounded-lg border border-white/15">
          {weapon.gallery.map((thumb, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setActiveImg(thumb);
                setImgFailed(false);
              }}
              className={`w-5 h-5 rounded overflow-hidden border transition-all ${
                activeImg === thumb ? 'border-hot scale-110' : 'border-white/30 opacity-60 hover:opacity-100'
              }`}
            >
              <img src={thumb} alt={`GTA 6 ${weapon.name} variant`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------ weapon card */
function WeaponCard({ weapon }: { weapon: Weapon }) {
  const accentHover = {
    hot: 'hover:border-[#ff2e93]/50',
    sunset: 'hover:border-[#ff8a3d]/50',
    grape: 'hover:border-[#8b3dff]/50',
    aqua: 'hover:border-[#19e6d2]/50',
  };

  return (
    <article
      className={`group glass glass-hover p-4 sm:p-5 rounded-2xl border border-white/10 flex flex-col justify-between transition-all duration-300 ${accentHover[weapon.accent]}`}
    >
      <div>
        <WeaponImage weapon={weapon} />

        <div className="mt-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-head text-xl sm:text-2xl uppercase tracking-wide text-white group-hover:text-sunset transition-colors">
              {weapon.name}
            </h3>
          </div>

          {/* Real-Life Counterpart Pill */}
          {weapon.realLife && (
            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-white/5 border border-white/10 text-sunset">
              <span className="text-white/40">Real Life:</span>
              <span>{weapon.realLife}</span>
            </div>
          )}

          {/* Manufacturer & Ammo Info */}
          <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
            {weapon.manufacturer && (
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/70">
                {weapon.manufacturer}
              </span>
            )}
            {weapon.ammoType && (
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-aqua">
                {weapon.ammoType}
              </span>
            )}
            {weapon.editionVariant && (
              <span className="px-2 py-0.5 rounded bg-hot/15 border border-hot/30 text-hot font-medium">
                {weapon.editionVariant}
              </span>
            )}
          </div>

          <p className="mt-3 text-sm text-white/75 leading-relaxed">
            {weapon.description}
          </p>
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------- page */
export default function Weapons() {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'spotted'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filteredWeapons = useMemo(() => {
    return WEAPONS_DATABASE.filter((w) => {
      // Category filter
      if (categoryFilter !== 'all' && w.category !== categoryFilter) {
        return false;
      }
      // Status filter
      if (statusFilter === 'confirmed' && !w.status.includes('Confirmed')) {
        return false;
      }
      if (statusFilter === 'spotted' && !w.status.includes('Spotted')) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = w.name.toLowerCase().includes(q);
        const matchesType = w.type.toLowerCase().includes(q);
        const matchesMfg = w.manufacturer?.toLowerCase().includes(q);
        const matchesReal = w.realLife?.toLowerCase().includes(q);
        const matchesDesc = w.description.toLowerCase().includes(q);
        return matchesName || matchesType || matchesMfg || matchesReal || matchesDesc;
      }
      return true;
    });
  }, [categoryFilter, statusFilter, searchQuery]);

  return (
    <div className="relative w-full overflow-x-clip text-white">
      <Seo
        title="GTA 6 Weapons & Guns Database - Confirmed Firearms in Leonida"
        description="Comprehensive GTA 6 weapons database with over 40 confirmed firearms, revolvers, shotguns, and rifles. Real-life counterparts, vehicle trunk armory, and Ammu-Nation lockers."
        path="/weapons"
        ogImage="/og/weapons.png"
      />

      {/* Centered Page Header */}
      <div className="mx-auto box-border w-full max-w-[1240px] px-[clamp(20px,5vw,64px)] pt-6">
        <Crumbs
          items={[
            { name: 'Home', path: '/' },
            { name: 'Weapons', path: '/weapons' },
          ]}
        />

        <header className="py-[clamp(24px,5vh,54px)] pb-[clamp(12px,2vh,24px)]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-hot/15 text-hot border border-hot/30 mb-3">
            <span className="w-2 h-2 rounded-full bg-hot animate-pulse" />
            Leonida • Confirmed Arsenal &amp; Armory
          </div>
          <h1 className="gta-title text-[clamp(2.4rem,6.8vw,4.5rem)] leading-[1.0] mb-3">
            GTA VI Weapons Database
          </h1>
          <p className="m-0 max-w-[65ch] text-[clamp(1rem,1.7vw,1.15rem)] leading-[1.65] text-white/80">
            From classic Vice City revolvers and customized sidearms to high-caliber assault rifles,
            shotguns, and tactical breach tools. Explore every confirmed weapon, its real-life
            counterpart, and the brand-new physical trunk inventory system.
          </p>
        </header>

        <QuickAnswer>
          GTA 6 introduces over 40 confirmed weapons alongside realistic physical inventory limits.
          Players physically carry up to two concealed handguns and two visible long guns slung over
          their shoulders. Extra firearms and ammo are stored in vehicle trunks (functioning like RDR2's
          horse). Discarded weapons can be retrieved at any Ammu-Nation locker.
        </QuickAnswer>
      </div>

      {/* Main Interactive Arsenal Section */}
      <section className="relative mx-auto box-border max-w-[1240px] px-[clamp(20px,5vw,64px)] py-8">
        {/* Controls Bar: Filters & Search */}
        <div className="glass p-4 rounded-2xl border border-white/10 mb-8 flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            {[
              { id: 'all', label: `All (${WEAPONS_DATABASE.length})` },
              { id: 'handguns', label: 'Handguns & Revolvers' },
              { id: 'rifles', label: 'Assault & Rifles' },
              { id: 'shotguns', label: 'Shotguns' },
              { id: 'smgs', label: 'SMGs' },
              { id: 'heavy', label: 'Snipers & Heavy' },
              { id: 'melee', label: 'Melee' },
              { id: 'throwable', label: 'Throwables' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setCategoryFilter(tab.id);
                  track('weapon_filter', { category: tab.id });
                }}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-head uppercase tracking-wider transition-all ${
                  categoryFilter === tab.id
                    ? 'bg-gradient-to-r from-sunset to-hot text-white shadow-[0_0_15px_rgba(255,46,147,0.4)]'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search + Status Filter */}
          <div className="flex items-center gap-2.5 w-full lg:w-auto">
            {/* Status toggle */}
            <div className="flex items-center bg-white/5 rounded-xl p-1 border border-white/10 text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  statusFilter === 'all' ? 'bg-white/15 text-white font-medium' : 'text-white/60 hover:text-white'
                }`}
              >
                All Status
              </button>
              <button
                onClick={() => setStatusFilter('confirmed')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  statusFilter === 'confirmed' ? 'bg-ok/20 text-ok font-medium' : 'text-white/60 hover:text-white'
                }`}
              >
                Confirmed
              </button>
              <button
                onClick={() => setStatusFilter('spotted')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  statusFilter === 'spotted' ? 'bg-sunset/20 text-sunset font-medium' : 'text-white/60 hover:text-white'
                }`}
              >
                Spotted
              </button>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 lg:w-64">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search gun or real model..."
                className="w-full pl-9 pr-8 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 text-sm focus:outline-none focus:border-hot focus:ring-1 focus:ring-hot transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Weapons Grid */}
        {filteredWeapons.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWeapons.map((weapon) => (
              <WeaponCard key={weapon.id} weapon={weapon} />
            ))}
          </div>
        ) : (
          <div className="glass p-12 rounded-2xl text-center border border-white/10">
            <p className="text-white/60 text-lg mb-3">
              No weapons found matching "{searchQuery}"
            </p>
            <button
              onClick={() => {
                setCategoryFilter('all');
                setStatusFilter('all');
                setSearchQuery('');
              }}
              className="neon-btn text-xs py-2 px-4"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </section>

      {/* New Weapons & Combat Mechanics Highlights */}
      <section className="relative mx-auto box-border max-w-[1240px] px-[clamp(20px,5vw,64px)] py-14">
        <div className="text-center max-w-[760px] mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-sunset/15 text-sunset border border-sunset/30 mb-3">
            <Sparkles size={14} />
            <span>Gunplay &amp; Combat Revolution</span>
          </div>
          <h2 className="gta-title text-[clamp(2rem,4.5vw,3.2rem)] uppercase font-black leading-tight mb-3">
            New Combat &amp; Inventory Features
          </h2>
          <p className="text-white/75 text-sm sm:text-base leading-relaxed">
            Rockstar Games has fundamentally overhauled gunplay, moving away from infinite magic wheels
            to a grounded, tactical experience inspired by Red Dead Redemption 2.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {COMBAT_FEATURES.map((feat, idx) => (
            <div
              key={idx}
              className="glass glass-hover p-5 sm:p-6 rounded-2xl border border-white/10 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-sunset">
                    {feat.category}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-hot/15 text-hot border border-hot/30">
                    {feat.highlight}
                  </span>
                </div>
                <h3 className="font-head text-xl uppercase tracking-wide text-white mb-2">
                  {feat.title}
                </h3>
                <p className="text-sm text-white/75 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Real-Life Counterparts Reference Table */}
      <section className="relative mx-auto box-border max-w-[1240px] px-[clamp(20px,5vw,64px)] py-12">
        <div className="text-center max-w-[760px] mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-aqua/15 text-aqua border border-aqua/30 mb-3">
            <Target size={14} />
            <span>Authentic Firearm Identification</span>
          </div>
          <h2 className="gta-title text-[clamp(2rem,4.5vw,3.2rem)] uppercase font-black leading-tight mb-3">
            Real-Life Weapon Equivalents
          </h2>
          <p className="text-white/75 text-sm sm:text-base leading-relaxed">
            Every in-game firearm manufactured by fictional brands (Hawk &amp; Little, Shrewsbury,
            Girardi, Duke Arms, Vom Feuer) directly mirrors an iconic real-world counterpart.
          </p>
        </div>

        <div className="glass rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 border-b border-white/10 text-xs uppercase tracking-wider font-head text-sunset">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">GTA VI Weapon Name</th>
                  <th className="py-3.5 px-4 sm:px-6">In-Game Manufacturer</th>
                  <th className="py-3.5 px-4 sm:px-6">Class</th>
                  <th className="py-3.5 px-4 sm:px-6">Real-World Counterpart</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/80">
                {REAL_LIFE_WEAPONS.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="py-3 px-4 sm:px-6 font-semibold text-white">
                      {item.gameName}
                    </td>
                    <td className="py-3 px-4 sm:px-6 text-white/70">
                      {item.manufacturer}
                    </td>
                    <td className="py-3 px-4 sm:px-6">
                      <span className="px-2 py-0.5 rounded bg-white/5 text-xs text-aqua">
                        {item.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 sm:px-6 font-mono text-xs sm:text-sm text-sunset">
                      {item.realLifeModel}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Confirmed Ammo Types Showcase */}
      <section className="relative mx-auto box-border max-w-[1240px] px-[clamp(20px,5vw,64px)] py-10">
        <div className="mb-6">
          <h2 className="gta-title text-2xl sm:text-3xl uppercase font-black mb-2">
            Confirmed Calibers &amp; Ammunition Types
          </h2>
          <p className="text-white/70 text-sm">
            GTA 6 categorizes ammunition into distinct physical pools requiring deliberate loadout planning.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {AMMO_TYPES.map((ammo, idx) => (
            <div
              key={idx}
              className="glass p-4 rounded-xl border border-white/10 flex flex-col justify-between"
            >
              <div>
                <span className="font-head text-lg text-white uppercase block mb-1">
                  {ammo.name}
                </span>
                <span className="text-xs font-mono text-hot block mb-2">
                  {ammo.caliber}
                </span>
                <p className="text-xs text-white/70 leading-relaxed">
                  {ammo.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Confirmed Equipment Items List */}
      <section className="relative mx-auto box-border max-w-[1240px] px-[clamp(20px,5vw,64px)] py-12">
        <div className="text-center max-w-[760px] mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-grape/20 text-grape border border-grape/30 mb-3">
            <Wrench size={14} />
            <span>Tactical &amp; Heist Equipment</span>
          </div>
          <h2 className="gta-title text-[clamp(2rem,4.5vw,3.2rem)] uppercase font-black leading-tight mb-3">
            Confirmed Equipment &amp; Items
          </h2>
          <p className="text-white/75 text-sm sm:text-base leading-relaxed">
            Beyond standard firearms, GTA 6 arms players with specialized heist instruments,
            stealth equipment, and recovery items.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
          {CONFIRMED_EQUIPMENT.map((item, idx) => (
            <div
              key={idx}
              className="glass glass-hover p-3.5 rounded-xl border border-white/10 text-center flex flex-col items-center justify-between"
            >
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-sunset mb-2 shadow-inner">
                <CheckCircle2 size={18} />
              </div>
              <h4 className="font-head text-sm uppercase text-white tracking-wide mb-1">
                {item.name}
              </h4>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/50 uppercase font-mono">
                {item.category}
              </span>
              <p className="text-[11px] text-white/60 mt-2 line-clamp-2 leading-tight">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Weapons Frequently Asked Questions */}
      <section className="relative mx-auto box-border max-w-[980px] px-[clamp(20px,5vw,64px)] py-14 pb-24">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-sunset/15 text-sunset border border-sunset/30 mb-3">
            <Zap size={14} />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="gta-title text-[clamp(2rem,4.5vw,3.2rem)] uppercase font-black leading-tight mb-3">
            GTA VI Weapons FAQ
          </h2>
          <p className="text-white/70 text-sm sm:text-base">
            Everything you need to know about purchasing, carrying, modifying, and storing guns in Leonida.
          </p>
        </div>

        <div className="space-y-3.5">
          {WEAPON_FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="glass rounded-xl border border-white/10 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-head text-base sm:text-lg uppercase tracking-wide text-white hover:text-sunset transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    size={18}
                    className={`text-sunset shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-sm sm:text-base text-white/80 leading-relaxed border-t border-white/5 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
