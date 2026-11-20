import Seo from '../lib/seo';
import { Crumbs, PageHead } from '../components/ui';
import { SITE } from '../config/site';

const CONTENT: Record<string, { title: string; body: React.ReactNode }> = {
  about: {
    title: 'About & Editorial Policy',
    body: (
      <div className="glass" style={{ padding: '24px', fontSize: '0.92rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <p>Explore Leonida ({SITE.name}) is an independent enthusiast database and fan publication dedicated to Grand Theft Auto VI. Our core editorial guideline is absolute transparency: <strong>never publish an unverified rumor as confirmed fact.</strong></p>
        <h2 className="font-head" style={{ color: 'var(--color-sunset)', textTransform: 'uppercase', fontFamily: 'var(--font-head)', margin: '12px 0 0', fontSize: '1.2rem' }}>Cheat Code Verification Standard</h2>
        <p>A button cheat or phone dial sequence is only labelled <strong>tested</strong> after our team enters it on a physical retail PlayStation 5 or Xbox Series X console and captures uncut video documentation with the date and system software version logged. All community-submitted or circulating codes remain marked <strong>unverified</strong> with conspicuous cautionary badges.</p>
        <h2 className="font-head" style={{ color: 'var(--color-sunset)', textTransform: 'uppercase', fontFamily: 'var(--font-head)', margin: '12px 0 0', fontSize: '1.2rem' }}>Review Aggregation & Source Citation</h2>
        <p>Review scores are curated directly from authorized publications and verified Metacritic records with direct outbound citations. Summaries are editorial syntheses, and no critical quotes or numerical ratings are ever fabricated.</p>
        <h2 className="font-head" style={{ color: 'var(--color-sunset)', textTransform: 'uppercase', fontFamily: 'var(--font-head)', margin: '12px 0 0', fontSize: '1.2rem' }}>Corrections & Transparency</h2>
        <p>If you identify an inaccurate coordinate, weapon statistic, or cheat status, please submit a correction via our contact portal. Corrections are reviewed within 24 hours.</p>
      </div>
    ),
  },
  disclaimer: {
    title: 'Disclaimer',
    body: (
      <div className="glass" style={{ padding: '24px', fontSize: '0.92rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <p>Explore Leonida is an <strong>unofficial, non-commercial fan resource</strong> created for informational, educational, and commentary purposes. This website is not endorsed by, directly affiliated with, maintained, authorized, or sponsored by Rockstar Games, Take-Two Interactive Software Inc., Sony Interactive Entertainment, or Microsoft Corporation.</p>
        <p>Grand Theft Auto, GTA VI, GTA 6, Vice City, and all associated logos, characters, maps, artwork, and trademarks are the intellectual property of Take-Two Interactive Software, Inc. and Rockstar Games. All trademarks and registered trademarks belong to their respective holders.</p>
        <p>Cheat codes flagged as unverified are sourced from third-party submissions and may fail to execute or inadvertently corrupt unsaved progress. Players are strongly encouraged to maintain independent manual saves before attempting any cheat inputs.</p>
        <p>All map coordinate models represent community-derived photogrammetric projections based on public promotional materials and do not represent official architectural plans from Rockstar Games.</p>
      </div>
    ),
  },
  terms: {
    title: 'Terms of Use',
    body: (
      <div className="glass" style={{ padding: '24px', fontSize: '0.92rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <p>By accessing Explore Leonida, you acknowledge and agree to comply with these Terms of Use. The materials and web services on this site are provided on an "as is" and "as available" basis without warranties of any kind.</p>
        <p><strong>Permitted Use:</strong> You may freely browse, bookmark, and share links to our guides, weapons databases, and interactive maps for personal non-commercial gaming reference. Automated mass-scraping, denial-of-service crawling, or rehosting of our synthesized datasets without express attribution is strictly prohibited.</p>
        <p><strong>Content Integrity:</strong> We reserve the right to modify site features, datasets, and editorial documentation at any time without prior notice. Continued use of the website following amendments constitutes acceptance of updated terms.</p>
        <p>These terms are governed by standard internet publication practices and informational fair-use doctrine.</p>
      </div>
    ),
  },
  privacy: {
    title: 'Privacy Policy',
    body: (
      <div className="glass" style={{ padding: '24px', fontSize: '0.92rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <p>Explore Leonida is committed to user privacy. We do not require user accounts, user logins, or credit card collection.</p>
        <p><strong>Consent-Based Analytics:</strong> We implement Google Analytics 4 strictly under Consent Mode v2. Analytical telemetry (such as anonymous page impressions and search term frequencies) is only transmitted after explicit consent is granted via our cookie banner. Users may reject cookies at any time with zero impact on site functionality.</p>
        <p><strong>Local Storage:</strong> We utilize client-side localStorage and sessionStorage solely to record your consent preference and prevent repeated intro animations.</p>
        <p><strong>External Links:</strong> Our guides may include outbound hyperlinks to official retail storefronts (such as the PlayStation Store and Xbox Store). Clicking outbound links subjects your browsing session to the destination website's independent privacy policies.</p>
        <p><strong>User Rights:</strong> In accordance with GDPR and applicable digital personal data protection principles, users may clear cookies or signal Global Privacy Control (GPC) via their browser at any time.</p>
      </div>
    ),
  },
  contact: {
    title: 'Contact',
    body: (
      <div className="glass" style={{ padding: '24px', fontSize: '0.92rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <p>To contact the editorial team, report an erratum, or provide verified console gameplay footage of an unverified cheat, email us at: <a style={{ color: 'var(--color-hot)', textDecoration: 'none' }} href="mailto:contact@exploreleonida.pages.dev">contact@exploreleonida.pages.dev</a>.</p>
        <p><strong>Cheat Submissions:</strong> When submitting newly discovered button combinations, please include: platform (PS5 / Xbox Series X), cheat effect, exact button sequence, and a link to unedited video proof showing the game hud response.</p>
        <p><strong>Intellectual Property &amp; DMCA:</strong> If you believe content hosted on Explore Leonida infringes your intellectual property, send notice with subject line "DMCA Notice" to ensure expedited processing within 2 business days.</p>
      </div>
    ),
  },
};

export default function Legal({ page }: { page: string }) {
  const c = CONTENT[page] ?? CONTENT.about;
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: c.title,
    description: `${c.title} for Explore Leonida.`,
  };

  return (
    <>
      <Seo
        title={`${c.title} - Explore Leonida`}
        description={`${c.title} for Explore Leonida, the unofficial Grand Theft Auto VI fan site.`}
        path={`/${page}`}
        jsonLd={ld}
        ogImage="/og/home.png"
      />
      <Crumbs items={[{ name: 'Home', path: '/' }, { name: c.title, path: `/${page}` }]} />
      <PageHead h1={c.title} sub="Plain-English policy. Last reviewed 20 Nov 2026." updated="20 Nov 2026" />
      {c.body}
    </>
  );
}
