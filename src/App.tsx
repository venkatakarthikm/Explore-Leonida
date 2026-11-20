import { useEffect, useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import StarLoader from './components/StarLoader';
import Home from './pages/Home';
import Cheats from './pages/Cheats';
import Reviews from './pages/Reviews';
import Compare from './pages/Compare';
import Buy from './pages/Buy';
import Preload from './pages/Preload';
import Guides from './pages/Guides';
import Characters from './pages/Characters';
import Weapons from './pages/Weapons';
import Map from './pages/Map';
import Faq from './pages/Faq';
import SiteIndex from './pages/SiteIndex';
import Legal from './pages/Legal';
import NotFound from './pages/NotFound';
import { initConsentMode, getConsent, loadAnalytics, trackPageView } from './lib/analytics';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
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

export default function App() {
  const [loading, setLoading] = useState(() => {
    if (typeof window === 'undefined') return false;

    // URL override: ?intro=1 forces intro, ?intro=0 disables it
    const params = new URLSearchParams(window.location.search);
    if (params.get('intro') === '0') return false;
    if (params.get('intro') === '1' || params.has('intro')) return true;

    // In production, only play once per session on the home page '/'
    if (!import.meta.env.DEV) {
      if (sessionStorage.getItem('leonida_loaded')) return false;
      if (window.location.pathname !== '/') return false;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    }

    if (navigator.webdriver) return false;
    return true;
  });

  return (
    <>
      <div className="synth-bg" aria-hidden="true" />
      <div className="synth-grid" aria-hidden="true" />
      <Analytics />
      {loading && (
        <StarLoader
          onDone={() => {
            setLoading(false);
            sessionStorage.setItem('leonida_loaded', '1');
          }}
        />
      )}
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/cheats/ps5" element={<Cheats />} />
          <Route path="/cheats" element={<Navigate to="/cheats/ps5" replace />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/buy" element={<Buy />} />
          <Route path="/preload" element={<Preload />} />
          <Route path="/characters" element={<Characters />} />
          <Route path="/weapons" element={<Weapons />} />
          <Route path="/map" element={<Map />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/site-index" element={<SiteIndex />} />
          <Route path="/about" element={<Legal page="about" />} />
          <Route path="/disclaimer" element={<Legal page="disclaimer" />} />
          <Route path="/terms" element={<Legal page="terms" />} />
          <Route path="/privacy" element={<Legal page="privacy" />} />
          <Route path="/contact" element={<Legal page="contact" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
