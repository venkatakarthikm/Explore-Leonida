import { useState, useMemo, useRef } from 'react';
import {
  MapPin,
  Search,
  Compass,
  Crosshair,
  Home,
  Fuel,
  Hotel,
  Utensils,
  Wrench,
  TreePine,
  Landmark as LandmarkIcon,
  Building2,
  ExternalLink,
  ChevronDown,
  Navigation,
  Eye,
  Info,
  Waves,
  Shield,
  Layers,
  Sparkles,
  X,
  Car,
  ChevronRight,
  Maximize2,
  RotateCcw,
  Filter,
} from 'lucide-react';
import Seo, { faqPage } from '../lib/seo';
import { Crumbs, QuickAnswer } from '../components/ui';
import { track } from '../lib/analytics';
import {
  COUNTIES,
  MAP_LANDMARKS,
  MAP_FAQS,
  type Landmark,
  type CountyInfo,
} from '../data/mapData';

/* ----------------------------------------------------------- category helpers */
type CategoryKey = 'all' | Landmark['category'];

const CATEGORIES: { key: CategoryKey; label: string; icon: typeof MapPin; color: string }[] = [
  { key: 'all', label: 'All Landmarks', icon: Layers, color: '#ffffff' },
  { key: 'safehouse', label: 'Safehouses', icon: Home, color: '#ff2e93' },
  { key: 'guns', label: 'Guns & Ammo', icon: Crosshair, color: '#ff8a3d' },
  { key: 'transport', label: 'Gas & Transit', icon: Fuel, color: '#19e6d2' },
  { key: 'hotel', label: 'Hotels & Motels', icon: Hotel, color: '#ffd166' },
  { key: 'food', label: 'Dining & Clubs', icon: Utensils, color: '#ff5480' },
  { key: 'modshop', label: 'Garages & Mod', icon: Wrench, color: '#a78bfa' },
  { key: 'park', label: 'Parks & Nature', icon: TreePine, color: '#34d399' },
  { key: 'business', label: 'Banks & Retail', icon: Building2, color: '#60a5fa' },
  { key: 'landmark', label: 'Points of Interest', icon: LandmarkIcon, color: '#e879f9' },
];

function getCategoryIcon(cat: Landmark['category']) {
  switch (cat) {
    case 'safehouse': return Home;
    case 'guns': return Crosshair;
    case 'transport': return Fuel;
    case 'hotel': return Hotel;
    case 'food': return Utensils;
    case 'modshop': return Wrench;
    case 'park': return TreePine;
    case 'business': return Building2;
    case 'landmark': return LandmarkIcon;
    default: return MapPin;
  }
}

function getCategoryColor(cat: Landmark['category']): string {
  switch (cat) {
    case 'safehouse': return '#ff2e93'; // hot
    case 'guns': return '#ff8a3d'; // sunset
    case 'transport': return '#19e6d2'; // aqua
    case 'hotel': return '#ffd166'; // yellow
    case 'food': return '#ff5480';
    case 'modshop': return '#a78bfa'; // grape
    case 'park': return '#34d399'; // green
    case 'business': return '#60a5fa'; // blue
    case 'landmark': return '#e879f9'; // pink
    default: return '#ffffff';
  }
}

/* ------------------------------------------------------------ View Presets */
interface ViewPreset {
  id: string;
  label: string;
  sub: string;
  viewBox: { x: number; y: number; width: number; height: number };
  county?: string;
}

const VIEW_PRESETS: ViewPreset[] = [
  { id: 'all', label: 'State of Leonida', sub: 'Full overview (All 5 Counties)', viewBox: { x: 0, y: 0, width: 100, height: 100 } },
  { id: 'vice-city', label: 'Vice City Metro', sub: 'Downtown, Vice Beach & Airport', viewBox: { x: 50, y: 35, width: 50, height: 45 }, county: 'vice-dale' },
  { id: 'kelly-port', label: 'Kelly & Port Gellhorn', sub: 'Industrial shipyards & Ambrosia', viewBox: { x: 15, y: 25, width: 50, height: 40 }, county: 'kelly' },
  { id: 'the-keys', label: 'The Florida Keys', sub: 'Key Lento & Overseas Hwy', viewBox: { x: 25, y: 65, width: 55, height: 35 }, county: 'mariana' },
  { id: 'mount-kalaga', label: 'Mount Kalaga & North', sub: 'Lummox forest & Dawson Dam', viewBox: { x: 20, y: 5, width: 60, height: 35 }, county: 'lummox' },
];

/* ------------------------------------------------------------- main component */
export default function MapPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('all');
  const [selectedCounty, setSelectedCounty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPin, setSelectedPin] = useState<Landmark | null>(null);
  const [activePreset, setActivePreset] = useState<string>('all');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Filtered landmarks
  const filteredLandmarks = useMemo(() => {
    return MAP_LANDMARKS.filter((l) => {
      // Category filter
      if (selectedCategory !== 'all' && l.category !== selectedCategory) {
        return false;
      }
      // County filter
      if (selectedCounty !== 'all' && l.region !== selectedCounty) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = l.name.toLowerCase().includes(q);
        const matchLoc = l.locality.toLowerCase().includes(q);
        const matchReg = l.regionName.toLowerCase().includes(q);
        const matchTag = l.tags.some((t) => t.toLowerCase().includes(q));
        const matchDesc = l.description?.toLowerCase().includes(q) ?? false;
        return matchName || matchLoc || matchReg || matchTag || matchDesc;
      }
      return true;
    });
  }, [selectedCategory, selectedCounty, searchQuery]);

  // Current View preset box
  const currentPreset = VIEW_PRESETS.find((p) => p.id === activePreset) || VIEW_PRESETS[0];

  // Handler to locate on map from directory
  const handleLocateOnMap = (landmark: Landmark) => {
    setSelectedPin(landmark);
    track('map_pin_select', { landmark_id: landmark.id, name: landmark.name, category: landmark.category, locality: landmark.locality });
    // If landmark belongs to a specific preset region, optionally adapt
    if (landmark.region === 'vice-dale') setActivePreset('vice-city');
    else if (landmark.region === 'kelly') setActivePreset('kelly-port');
    else if (landmark.region === 'mariana') setActivePreset('the-keys');
    else if (landmark.region === 'lummox') setActivePreset('mount-kalaga');
    else setActivePreset('all');

    if (mapContainerRef.current) {
      mapContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedCounty('all');
    setSearchQuery('');
    setActivePreset('all');
    setSelectedPin(null);
  };

  const jsonLdData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Place',
      name: 'State of Leonida: Grand Theft Auto VI',
      description: 'The fictional state of Leonida in GTA 6 comprising Vice-Dale, Kelly, Mariana, Leonard, and Lummox counties.',
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '25.7617',
        longitude: '-80.1918',
      },
    },
    faqPage(MAP_FAQS),
  ];

  return (
    <div className="relative w-full overflow-x-clip text-white">
      <Seo
        title="GTA 6 Interactive Map: State of Leonida Atlas & Vice City Landmarks"
        description="Explore the complete interactive map of GTA 6's State of Leonida. Locate safehouses, gun stores, mod shops, gas stations, and 70+ confirmed landmarks across Vice-Dale, Kelly, Mariana, and Lummox."
        path="/map"
        ogImage="/og/map.png"
        jsonLd={jsonLdData}
      />

      {/* Header Container */}
      <div className="mx-auto box-border w-full max-w-[1240px] px-[clamp(20px,5vw,64px)] pt-6">
        <Crumbs
          items={[
            { name: 'Home', path: '/' },
            { name: 'Map', path: '/map' },
          ]}
        />

        <header className="py-[clamp(24px,5vh,54px)] pb-[clamp(12px,2vh,24px)]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-aqua/15 text-aqua border border-aqua/30 mb-3">
            <span className="w-2 h-2 rounded-full bg-aqua animate-pulse" />
            Leonida • Interactive Satellite Atlas
          </div>
          <h1 className="gta-title text-[clamp(2.4rem,6.8vw,4.5rem)] leading-[1.0] mb-3">
            GTA VI Interactive Map &amp; Atlas
          </h1>
          <p className="max-w-[820px] text-base sm:text-lg text-white/75 leading-relaxed font-sans">
            The confirmed cartography of the <strong>State of Leonida</strong>. Explore 5 counties, 70+ mapped landmarks,
            safehouses, Ammu-Nation armories, and secret Florida Keys hideouts synthesized from photogrammetric trailer
            analysis and community telemetry.
          </p>
        </header>

        {/* Quick Answer Snippet for SEO and immediate clarity */}
        <QuickAnswer>
          <strong>Map Scale &amp; Scope:</strong> Leonida is estimated at <strong>2.5× to 3× the landmass of GTA V's San Andreas</strong>,
          incorporating 5 distinct counties (Vice-Dale, Kelly, Mariana, Leonard, and Lummox). The world is completely seamless
          without loading screens, features fully navigable offshore barrier islands, and provides walk-in interiors for
          over 65% of commercial storefronts.
        </QuickAnswer>
      </div>

      {/* ========================================================= MAP WORKSPACE */}
      <section className="mx-auto box-border w-full max-w-[1340px] px-3 sm:px-6 py-4">
        {/* Top Control Bar: Search + Category Pills + County Selector */}
        <div className="glass rounded-2xl p-4 sm:p-5 border border-white/10 mb-5 shadow-2xl backdrop-blur-xl">
          {/* Row 1: Search & County Dropdown & Reset */}
          <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between pb-4 border-b border-white/10">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search 70+ landmarks, hotels, gun shops, safehouses, or localities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-black/40 border border-white/15 text-sm text-white placeholder-white/40 focus:outline-none focus:border-aqua transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  title="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* County Select */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-white/50 font-head flex items-center gap-1.5 pl-1">
                <Compass size={14} className="text-sunset" /> County:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedCounty('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide transition-all ${
                    selectedCounty === 'all'
                      ? 'bg-white/20 text-white border border-white/40 shadow-[0_0_12px_rgba(255,255,255,0.2)]'
                      : 'bg-white/5 text-white/60 hover:text-white border border-white/10'
                  }`}
                >
                  All Counties
                </button>
                {COUNTIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCounty(c.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide transition-all ${
                      selectedCounty === c.id
                        ? 'border shadow-[0_0_12px_rgba(255,46,147,0.3)]'
                        : 'bg-white/5 text-white/60 hover:text-white border border-white/10'
                    }`}
                    style={
                      selectedCounty === c.id
                        ? {
                            backgroundColor: `${c.color}25`,
                            borderColor: c.color,
                            color: c.color,
                          }
                        : {}
                    }
                  >
                    {c.name.split(' ')[0]}
                  </button>
                ))}
              </div>

              {(searchQuery || selectedCategory !== 'all' || selectedCounty !== 'all' || activePreset !== 'all') && (
                <button
                  onClick={handleResetFilters}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 inline-flex items-center gap-1 transition-colors ml-auto lg:ml-2"
                >
                  <RotateCcw size={12} /> Reset
                </button>
              )}
            </div>
          </div>

          {/* Row 2: Category Filters */}
          <div className="pt-3 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <span className="text-xs uppercase tracking-wider text-white/50 font-head shrink-0 mr-1 flex items-center gap-1">
              <Filter size={13} className="text-hot" /> Filter:
            </span>
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-hot/20 text-hot border border-hot/60 shadow-[0_0_10px_rgba(255,46,147,0.35)] font-semibold'
                      : 'bg-white/5 text-white/65 hover:text-white hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <Icon size={13} style={{ color: isActive ? '#ff2e93' : cat.color }} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Row 3: View Presets / Quick Zoom */}
          <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-white/40 uppercase tracking-wider font-head mr-1">Sector Zoom:</span>
              {VIEW_PRESETS.map((vp) => (
                <button
                  key={vp.id}
                  onClick={() => {
                    setActivePreset(vp.id);
                    if (vp.county) setSelectedCounty(vp.county);
                    else setSelectedCounty('all');
                  }}
                  className={`px-2.5 py-1 rounded text-xs transition-all ${
                    activePreset === vp.id
                      ? 'bg-aqua/20 text-aqua border border-aqua/40 font-semibold'
                      : 'bg-white/5 text-white/60 hover:text-white border border-transparent hover:border-white/10'
                  }`}
                >
                  {vp.label}
                </button>
              ))}
            </div>

            <div className="text-white/50 text-xs">
              Showing <span className="text-aqua font-bold">{filteredLandmarks.length}</span> of {MAP_LANDMARKS.length} landmarks
            </div>
          </div>
        </div>

        {/* Map Stage Grid: Interactive Canvas + Detail Panel */}
        <div
          ref={mapContainerRef}
          className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start"
        >
          {/* Interactive Map Canvas Container (8 or 9 cols on desktop) */}
          <div className="lg:col-span-8 xl:col-span-8 relative rounded-2xl overflow-hidden glass border border-white/15 shadow-2xl bg-[#070414]">
            {/* Map Canvas Header Strip */}
            <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
              <div className="pointer-events-auto px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/15 text-xs font-mono text-white/80 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>LEONIDA TELEMETRY GRID • 25.76°N, 80.19°W</span>
              </div>
              <div className="pointer-events-auto flex items-center gap-1.5 bg-black/70 backdrop-blur-md p-1 rounded-lg border border-white/15">
                <button
                  onClick={() => setActivePreset('all')}
                  className="px-2 py-1 rounded text-[11px] text-white/70 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1"
                  title="Reset View to Full State"
                >
                  <Maximize2 size={12} /> Full Map
                </button>
              </div>
            </div>

            {/* The Map Surface (16:10 or 4:3 responsive aspect ratio) */}
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] md:aspect-[16/10] overflow-hidden select-none">
              {/* Background Cartography SVG */}
              <svg
                viewBox={`${currentPreset.viewBox.x} ${currentPreset.viewBox.y} ${currentPreset.viewBox.width} ${currentPreset.viewBox.height}`}
                className="absolute inset-0 w-full h-full transition-all duration-700 ease-out"
                preserveAspectRatio="xMidYMid slice"
              >
                <defs>
                  {/* Subtle Grid Pattern */}
                  <pattern id="cartoGrid" width="5" height="5" patternUnits="userSpaceOnUse">
                    <path d="M 5 0 L 0 0 0 5" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="0.2" />
                  </pattern>

                  {/* Water Shimmer Gradients */}
                  <radialGradient id="oceanGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#0d112b" />
                    <stop offset="100%" stopColor="#060312" />
                  </radialGradient>

                  <linearGradient id="landMassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#14112e" />
                    <stop offset="50%" stopColor="#1a1338" />
                    <stop offset="100%" stopColor="#0e0a24" />
                  </linearGradient>

                  <linearGradient id="lakeWaterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#091b33" />
                    <stop offset="100%" stopColor="#061224" />
                  </linearGradient>

                  {/* County Border Glows */}
                  <filter id="neonGlowHot" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="0.8" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Ocean Background */}
                <rect x="0" y="0" width="100" height="100" fill="url(#oceanGlow)" />
                <rect x="0" y="0" width="100" height="100" fill="url(#cartoGrid)" />

                {/* Depth contour rings (Gulf & Atlantic) */}
                <path
                  d="M 5,95 Q 15,65 18,35 Q 22,15 45,8 Q 75,5 92,20 Q 98,45 95,85"
                  fill="none"
                  stroke="rgba(25, 230, 210, 0.08)"
                  strokeWidth="0.6"
                  strokeDasharray="1.5, 1"
                />
                <path
                  d="M 12,95 Q 22,60 25,32 Q 28,18 48,12 Q 72,10 88,25 Q 94,50 90,80"
                  fill="none"
                  stroke="rgba(25, 230, 210, 0.05)"
                  strokeWidth="0.4"
                />

                {/* MAIN LEONIDA LANDMASS (Stylized Florida-inspired peninsula) */}
                <path
                  d="
                    M 20,12 
                    C 30,8 60,6 78,10 
                    C 84,14 86,22 86,30
                    C 86,38 90,44 93,52
                    C 95,60 92,68 88,72
                    C 82,76 74,74 70,76
                    C 66,78 60,82 56,86
                    C 52,90 48,94 44,95
                    C 40,96 38,92 40,88
                    C 42,84 46,80 48,76
                    C 49,70 47,65 44,60
                    C 38,55 30,55 24,50
                    C 18,45 16,35 18,25
                    Z
                  "
                  fill="url(#landMassGrad)"
                  stroke="rgba(255, 255, 255, 0.2)"
                  strokeWidth="0.5"
                />

                {/* VICE BEACH BARRIER ISLAND (East Atlantic Coast) */}
                <path
                  d="
                    M 89,45 
                    C 92,48 94,56 94,64
                    C 94,68 91,72 88,74
                    C 87,71 89,64 88,58
                    C 87,52 86,48 89,45
                    Z
                  "
                  fill="#1f1842"
                  stroke="#ff2e93"
                  strokeWidth="0.4"
                  opacity="0.85"
                />

                {/* THE LOWER KEYS ARCHIPELAGO (South Mariana County) */}
                {/* Key Lento & Big Pine chain */}
                <ellipse cx="50" cy="89" rx="3.2" ry="1.6" fill="#1b1c3d" stroke="#19e6d2" strokeWidth="0.3" transform="rotate(-15 50 89)" />
                <ellipse cx="44" cy="92" rx="2.8" ry="1.4" fill="#1b1c3d" stroke="#19e6d2" strokeWidth="0.3" transform="rotate(-20 44 92)" />
                <ellipse cx="38" cy="94" rx="2.4" ry="1.2" fill="#1b1c3d" stroke="#19e6d2" strokeWidth="0.3" transform="rotate(-10 38 94)" />
                <ellipse cx="32" cy="95.5" rx="2" ry="1" fill="#1b1c3d" stroke="#19e6d2" strokeWidth="0.25" />

                {/* Biscayne Bay / Intercoastal Lagoon */}
                <path
                  d="M 86,48 Q 88,58 86,68 Q 83,62 84,52 Z"
                  fill="url(#lakeWaterGrad)"
                  stroke="rgba(25, 230, 210, 0.25)"
                  strokeWidth="0.3"
                />

                {/* LAKE LEONIDA (Central Inland Reservoir) */}
                <path
                  d="
                    M 62,32 
                    C 68,30 74,33 74,38 
                    C 74,42 70,44 65,43 
                    C 60,42 58,36 62,32 
                    Z
                  "
                  fill="url(#lakeWaterGrad)"
                  stroke="rgba(25, 230, 210, 0.4)"
                  strokeWidth="0.4"
                />

                {/* MOUNT KALAGA ELEVATION RINGS (Lummox North) */}
                <ellipse cx="46" cy="15.5" rx="6" ry="3.5" fill="none" stroke="rgba(139, 61, 255, 0.35)" strokeWidth="0.3" strokeDasharray="1, 0.5" />
                <ellipse cx="46" cy="15.5" rx="3.8" ry="2.2" fill="none" stroke="rgba(139, 61, 255, 0.5)" strokeWidth="0.3" />
                <ellipse cx="46" cy="15.5" rx="1.8" ry="1" fill="none" stroke="rgba(139, 61, 255, 0.7)" strokeWidth="0.35" />

                {/* MAJOR HIGHWAY NETWORK (Neon Routes) */}
                {/* Route 1: Vice City down to Lower Keys */}
                <path
                  d="M 80,60 Q 72,70 60,80 Q 52,86 38,94"
                  fill="none"
                  stroke="#ffd166"
                  strokeWidth="0.4"
                  strokeDasharray="2, 1"
                  opacity="0.65"
                />
                {/* Interstate I-97: Port Gellhorn to Vice City */}
                <path
                  d="M 26,45 Q 45,46 58,48 Q 70,52 82,54"
                  fill="none"
                  stroke="#ff8a3d"
                  strokeWidth="0.4"
                  opacity="0.5"
                />
                {/* Northern Highway: Ambrosia to Mount Kalaga & Dawson Dam */}
                <path
                  d="M 52,40 Q 48,28 44,16"
                  fill="none"
                  stroke="#8b3dff"
                  strokeWidth="0.35"
                  strokeDasharray="1.5, 0.8"
                  opacity="0.55"
                />

                {/* COUNTY BORDER DASHED LINES */}
                {/* Lummox / North Border */}
                <path d="M 22,23 Q 48,22 84,24" fill="none" stroke="#8b3dff" strokeWidth="0.4" strokeDasharray="1, 1" opacity="0.6" />
                {/* Kelly / West Border */}
                <path d="M 44,23 Q 46,45 48,60" fill="none" stroke="#ff8a3d" strokeWidth="0.4" strokeDasharray="1, 1" opacity="0.6" />
                {/* Leonard / Lake Border */}
                <path d="M 48,24 Q 65,24 82,24" fill="none" stroke="#ffd166" strokeWidth="0.3" strokeDasharray="1, 1" opacity="0.5" />
                {/* Mariana / Southern Keys Border */}
                <path d="M 46,75 Q 60,78 74,75" fill="none" stroke="#19e6d2" strokeWidth="0.4" strokeDasharray="1, 1" opacity="0.6" />

                {/* Cartographic Labels on Map Terrain */}
                <text x="78" y="52" fill="rgba(255, 46, 147, 0.45)" fontSize="2.8" fontFamily="var(--font-head)" letterSpacing="0.2">VICE CITY</text>
                <text x="88" y="60" fill="rgba(255, 46, 147, 0.35)" fontSize="1.8" fontFamily="var(--font-head)" letterSpacing="0.1">VICE BEACH</text>
                <text x="24" y="42" fill="rgba(255, 138, 61, 0.45)" fontSize="2.2" fontFamily="var(--font-head)" letterSpacing="0.15">PORT GELLHORN</text>
                <text x="50" y="38" fill="rgba(255, 138, 61, 0.35)" fontSize="1.6" fontFamily="var(--font-head)">AMBROSIA</text>
                <text x="64" y="38" fill="rgba(25, 230, 210, 0.35)" fontSize="1.8" fontFamily="var(--font-head)">LAKE LEONIDA</text>
                <text x="44" y="13" fill="rgba(139, 61, 255, 0.45)" fontSize="2.0" fontFamily="var(--font-head)">MT. KALAGA</text>
                <text x="36" y="91" fill="rgba(25, 230, 210, 0.4)" fontSize="2.0" fontFamily="var(--font-head)">LEONIDA KEYS</text>
                <text x="8" y="55" fill="rgba(255, 255, 255, 0.15)" fontSize="2.2" fontFamily="var(--font-mono)">GULF OF MEXICO</text>
                <text x="82" y="86" fill="rgba(255, 255, 255, 0.15)" fontSize="2.2" fontFamily="var(--font-mono)">ATLANTIC OCEAN</text>
              </svg>

              {/* HTML OVERLAY OF INTERACTIVE PINS */}
              {/* Uses transform coordinate mapping based on current viewBox */}
              <div className="absolute inset-0 pointer-events-none">
                {filteredLandmarks.map((pin) => {
                  const isSelected = selectedPin?.id === pin.id;
                  const color = getCategoryColor(pin.category);
                  const Icon = getCategoryIcon(pin.category);

                  // Calculate relative % within active preset viewBox
                  const vb = currentPreset.viewBox;
                  const relX = ((pin.x - vb.x) / vb.width) * 100;
                  const relY = ((pin.y - vb.y) / vb.height) * 100;

                  // Hide if outside the current viewport
                  if (relX < -2 || relX > 102 || relY < -2 || relY > 102) {
                    return null;
                  }

                  return (
                    <div
                      key={pin.id}
                      style={{
                        left: `${relX}%`,
                        top: `${relY}%`,
                      }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto transition-all duration-300 z-10 hover:z-30 group"
                    >
                      {/* Pin Button */}
                      <button
                        onClick={() => {
                          setSelectedPin(pin);
                          track('map_pin_select', { landmark_id: pin.id, name: pin.name, category: pin.category, region: pin.region });
                        }}
                        className={`relative flex items-center justify-center transition-all duration-300 focus:outline-none ${
                          isSelected ? 'scale-125 z-40' : 'group-hover:scale-125'
                        }`}
                        title={`${pin.name} (${pin.locality})`}
                        aria-label={pin.name}
                      >
                        {/* Ping / Ripple ring for safehouses and selected pins */}
                        {(isSelected || pin.category === 'safehouse') && (
                          <span
                            className="absolute -inset-1.5 rounded-full animate-ping opacity-75"
                            style={{ backgroundColor: color }}
                          />
                        )}

                        {/* Outer Glow Halo */}
                        <span
                          className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center border transition-all ${
                            isSelected
                              ? 'shadow-[0_0_16px_currentColor]'
                              : 'shadow-[0_0_8px_rgba(0,0,0,0.8)] group-hover:shadow-[0_0_12px_currentColor]'
                          }`}
                          style={{
                            backgroundColor: isSelected ? color : '#0f0a22',
                            borderColor: color,
                            color: isSelected ? '#ffffff' : color,
                          }}
                        >
                          <Icon size={12} className={isSelected ? 'text-white' : ''} />
                        </span>
                      </button>

                      {/* Hover / Active Tooltip */}
                      <div
                        className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-2 pointer-events-none transition-all duration-200 z-50 whitespace-nowrap ${
                          isSelected
                            ? 'opacity-100 scale-100'
                            : 'opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100'
                        }`}
                      >
                        <div className="glass px-2.5 py-1 rounded-md text-[11px] font-sans text-white border border-white/20 shadow-xl flex items-center gap-1.5 bg-black/85">
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: color }}
                          />
                          <span className="font-semibold">{pin.name}</span>
                          <span className="text-white/50 text-[10px]">({pin.locality})</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Compass Rose Watermark */}
              <div className="absolute bottom-3 right-3 pointer-events-none opacity-40 hover:opacity-80 transition-opacity">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-white/20 flex items-center justify-center relative">
                  <span className="absolute top-1 text-[9px] font-mono text-hot font-bold">N</span>
                  <span className="absolute bottom-1 text-[9px] font-mono text-white/50">S</span>
                  <span className="absolute left-1 text-[9px] font-mono text-white/50">W</span>
                  <span className="absolute right-1 text-[9px] font-mono text-white/50">E</span>
                  <Navigation size={18} className="text-aqua transform -rotate-45" />
                </div>
              </div>
            </div>

            {/* Bottom Map Legend Bar */}
            <div className="p-3 bg-black/60 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-white/60">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-head uppercase tracking-wider text-white/40">Legend:</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#ff2e93]" /> Safehouse</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#ff8a3d]" /> Guns &amp; Ammo</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#19e6d2]" /> Gas / Transit</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#ffd166]" /> Hotels</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#a78bfa]" /> Mod Shops</span>
              </div>
              <div className="font-mono text-[11px] text-white/40">
                Data: GTADB.ORG (CC BY 4.0)
              </div>
            </div>
          </div>

          {/* Right Column: Selected Landmark Inspector Drawer */}
          <div className="lg:col-span-4 xl:col-span-4 flex flex-col gap-4">
            {selectedPin ? (
              <div className="glass rounded-2xl p-5 sm:p-6 border border-white/15 shadow-2xl relative overflow-hidden animate-in fade-in duration-200">
                {/* Background colored glow header */}
                <div
                  className="absolute top-0 left-0 right-0 h-1.5"
                  style={{ backgroundColor: getCategoryColor(selectedPin.category) }}
                />

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider mb-2 border"
                      style={{
                        backgroundColor: `${getCategoryColor(selectedPin.category)}20`,
                        borderColor: `${getCategoryColor(selectedPin.category)}50`,
                        color: getCategoryColor(selectedPin.category),
                      }}
                    >
                      {selectedPin.category}
                    </span>
                    <h3 className="font-head text-2xl uppercase tracking-wide text-white leading-tight">
                      {selectedPin.name}
                    </h3>
                  </div>

                  <button
                    onClick={() => setSelectedPin(null)}
                    className="p-1.5 rounded-lg text-white/50 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                    title="Close details"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-white/60">
                  <MapPin size={13} className="text-sunset shrink-0" />
                  <span>{selectedPin.locality}</span>
                  <span className="text-white/20">•</span>
                  <span className="text-aqua font-medium">{selectedPin.regionName}</span>
                </div>

                {/* Telemetry Coordinate Box */}
                <div className="mt-4 p-3 rounded-xl bg-black/40 border border-white/10 font-mono text-xs space-y-1">
                  <div className="flex justify-between text-white/50">
                    <span>Atlas Grid Position:</span>
                    <span className="text-white">X: {selectedPin.x.toFixed(2)}% | Y: {selectedPin.y.toFixed(2)}%</span>
                  </div>
                  {selectedPin.sourcePosition && (
                    <div className="flex justify-between text-white/40 text-[11px]">
                      <span>GTADB Yanis v17:</span>
                      <span className="text-aqua">{selectedPin.sourcePosition.x.toFixed(1)}, {selectedPin.sourcePosition.y.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="mt-4 text-sm text-white/80 leading-relaxed font-sans border-t border-white/10 pt-3">
                  <p>{selectedPin.description || 'Confirmed Leonida landmark cataloged in trailer breakdowns and world coordinates.'}</p>
                </div>

                {/* Tags */}
                {selectedPin.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                    {selectedPin.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded text-[11px] bg-white/5 border border-white/10 text-white/70"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action buttons */}
                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                  {selectedPin.url && (
                    <a
                      href={selectedPin.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-aqua hover:underline font-medium"
                    >
                      <span>View on GTADB</span>
                      <ExternalLink size={12} />
                    </a>
                  )}

                  <button
                    onClick={() => {
                      if (selectedPin.region === 'vice-dale') setActivePreset('vice-city');
                      else if (selectedPin.region === 'kelly') setActivePreset('kelly-port');
                      else if (selectedPin.region === 'mariana') setActivePreset('the-keys');
                      else if (selectedPin.region === 'lummox') setActivePreset('mount-kalaga');
                    }}
                    className="ml-auto px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    Focus Region
                  </button>
                </div>
              </div>
            ) : (
              /* Empty state prompt */
              <div className="glass rounded-2xl p-6 border border-white/10 shadow-xl text-center flex flex-col items-center justify-center min-h-[260px]">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-aqua mb-3">
                  <MapPin size={22} />
                </div>
                <h3 className="font-head text-lg uppercase tracking-wide text-white">Select a Landmark</h3>
                <p className="mt-1 text-xs sm:text-sm text-white/60 max-w-[260px] leading-relaxed">
                  Click any glowing pin on the map or select a location from the directory below to view coordinates and details.
                </p>
                <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-hot/10 text-hot border border-hot/20">
                  <Sparkles size={12} />
                  <span>70+ Verified Sites</span>
                </div>
              </div>
            )}

            {/* Quick County Shortcuts Sidebar Card */}
            <div className="glass rounded-2xl p-5 border border-white/10 shadow-xl">
              <h4 className="font-head text-xs uppercase tracking-widest text-white/50 mb-3 flex items-center gap-1.5">
                <Compass size={13} className="text-sunset" /> Key Regions &amp; Hubs
              </h4>
              <div className="space-y-2">
                {COUNTIES.map((county) => (
                  <button
                    key={county.id}
                    onClick={() => {
                      setSelectedCounty(county.id);
                      if (county.id === 'vice-dale') setActivePreset('vice-city');
                      else if (county.id === 'kelly') setActivePreset('kelly-port');
                      else if (county.id === 'mariana') setActivePreset('the-keys');
                      else if (county.id === 'lummox') setActivePreset('mount-kalaga');
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-head uppercase tracking-wide text-white group-hover:text-aqua transition-colors">
                        {county.name}
                      </div>
                      <div className="text-[11px] text-white/50 truncate max-w-[200px]">
                        {county.majorHubs.slice(0, 3).join(', ')}...
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-white/30 group-hover:text-aqua group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= 5 COUNTIES SHOWCASE */}
      <section className="mx-auto box-border w-full max-w-[1240px] px-[clamp(20px,5vw,64px)] py-12">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-sunset/15 text-sunset border border-sunset/30 mb-2">
            <Compass size={12} />
            Territorial Division
          </div>
          <h2 className="gta-title text-[clamp(2rem,4.5vw,3.2rem)] uppercase font-black leading-tight mb-2">
            The Five Counties of Leonida
          </h2>
          <p className="text-white/70 text-sm sm:text-base max-w-[720px]">
            From the glittering skylines of Vice-Dale to the mist-shrouded wilderness of Mount Kalaga,
            each county boasts its own distinct architecture, law enforcement intensity, and criminal opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {COUNTIES.map((county) => (
            <div
              key={county.id}
              className="glass rounded-2xl p-6 border border-white/10 hover:border-white/25 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: county.color, boxShadow: `0 0 10px ${county.color}` }}
                  />
                  <span className="text-[11px] font-mono uppercase tracking-wider text-white/40">
                    County ID: #{county.id}
                  </span>
                </div>

                <h3 className="font-head text-2xl uppercase tracking-wide text-white group-hover:text-sunset transition-colors mb-1">
                  {county.name}
                </h3>
                <div className="text-xs font-medium text-hot mb-3">
                  {county.tagline}
                </div>

                <p className="text-sm text-white/75 leading-relaxed mb-4">
                  {county.description}
                </p>

                {/* Major Hubs Pills */}
                <div className="mb-4">
                  <span className="text-[11px] uppercase tracking-wider text-white/40 font-head block mb-1.5">
                    Notable Hubs:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {county.majorHubs.map((hub) => (
                      <span
                        key={hub}
                        className="px-2 py-0.5 rounded text-xs bg-white/5 border border-white/10 text-white/80"
                      >
                        {hub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedCounty(county.id);
                  if (county.id === 'vice-dale') setActivePreset('vice-city');
                  else if (county.id === 'kelly') setActivePreset('kelly-port');
                  else if (county.id === 'mariana') setActivePreset('the-keys');
                  else if (county.id === 'lummox') setActivePreset('mount-kalaga');
                  if (mapContainerRef.current) {
                    mapContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="w-full mt-2 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 text-white transition-all flex items-center justify-center gap-1.5"
              >
                <span>Filter Map to {county.name.split(' ')[0]}</span>
                <ChevronRight size={13} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= DIRECTORY TABLE */}
      <section className="mx-auto box-border w-full max-w-[1240px] px-[clamp(20px,5vw,64px)] py-8">
        <div className="glass rounded-2xl p-6 sm:p-8 border border-white/10 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-aqua font-head mb-1">
                <LandmarkIcon size={14} /> Full Catalogue
              </div>
              <h2 className="gta-title text-2xl sm:text-3xl uppercase font-black">
                Leonida Landmarks Directory
              </h2>
            </div>
            <div className="text-xs text-white/50">
              Showing {filteredLandmarks.length} confirmed locations
            </div>
          </div>

          {/* Responsive Table / Cards */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs font-head uppercase tracking-wider text-white/40">
                  <th className="pb-3 pl-2">Name</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Locality</th>
                  <th className="pb-3">County</th>
                  <th className="pb-3 text-right pr-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLandmarks.slice(0, 35).map((l) => {
                  const color = getCategoryColor(l.category);
                  const Icon = getCategoryIcon(l.category);
                  return (
                    <tr
                      key={l.id}
                      className="hover:bg-white/[0.04] transition-colors group"
                    >
                      <td className="py-3 pl-2 font-medium text-white group-hover:text-aqua transition-colors flex items-center gap-2">
                        <Icon size={14} style={{ color }} className="shrink-0" />
                        <span>{l.name}</span>
                      </td>
                      <td className="py-3">
                        <span
                          className="px-2 py-0.5 rounded text-[11px] uppercase tracking-wide font-medium border"
                          style={{
                            backgroundColor: `${color}15`,
                            borderColor: `${color}40`,
                            color,
                          }}
                        >
                          {l.category}
                        </span>
                      </td>
                      <td className="py-3 text-white/70 text-xs">{l.locality}</td>
                      <td className="py-3 text-white/60 text-xs">{l.regionName}</td>
                      <td className="py-3 text-right pr-2">
                        <button
                          onClick={() => handleLocateOnMap(l)}
                          className="px-2.5 py-1 rounded text-xs font-medium bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 text-white transition-colors inline-flex items-center gap-1"
                        >
                          <Eye size={12} className="text-aqua" />
                          <span>Pin</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredLandmarks.length > 35 && (
            <div className="mt-4 pt-3 border-t border-white/10 text-center text-xs text-white/50">
              Showing top 35 entries. Use the search bar above to narrow down specific landmarks across all 70+ locations.
            </div>
          )}
        </div>
      </section>

      {/* ========================================================= MAP FAQ ACCORDION */}
      <section className="mx-auto box-border w-full max-w-[1240px] px-[clamp(20px,5vw,64px)] py-12">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-grape/15 text-grape border border-grape/30 mb-2">
            <Info size={12} />
            Frequently Asked Questions
          </div>
          <h2 className="gta-title text-[clamp(2rem,4.5vw,3.2rem)] uppercase font-black leading-tight mb-2">
            GTA VI Map FAQ
          </h2>
          <p className="text-white/70 text-sm sm:text-base">
            Verified insights on map size, geography, fast travel, enterable buildings, and the world of Leonida.
          </p>
        </div>

        <div className="space-y-3.5">
          {MAP_FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="glass rounded-xl border border-white/10 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-head text-base sm:text-lg uppercase tracking-wide text-white hover:text-aqua transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-aqua shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-sm sm:text-base text-white/80 leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================= ATTRIBUTION & CREDITS */}
      <section className="mx-auto box-border w-full max-w-[1240px] px-[clamp(20px,5vw,64px)] pb-16">
        <div className="glass rounded-xl p-5 border border-white/10 text-xs text-white/60 space-y-2">
          <div className="font-head text-sm uppercase tracking-wide text-white flex items-center gap-2">
            <Shield size={14} className="text-hot" /> Cartography Attribution &amp; License
          </div>
          <p>
            Landmarks telemetry, coordinate estimates, and location identifiers adapted from{' '}
            <a
              href="https://map.gtadb.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-aqua hover:underline"
            >
              GTADB.ORG: GTA VI Landmarks Data
            </a>{' '}
            and the mapping community contributors under the{' '}
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-hot hover:underline"
            >
              Creative Commons Attribution 4.0 International (CC BY 4.0) License
            </a>.
          </p>
          <p className="text-white/40">
            Coordinates represent projected Yanis v17 telemetry calibrated to trailer photogrammetry and highway signposts.
            Explore Leonida is an independent fan project not affiliated with Rockstar Games or Take-Two Interactive.
          </p>
        </div>
      </section>
    </div>
  );
}
