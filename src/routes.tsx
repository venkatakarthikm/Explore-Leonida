import { RouteRecord } from 'vite-react-ssg';
import { Navigate } from 'react-router-dom';
import Layout from './components/Layout';
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

export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'cheats/ps5', element: <Cheats /> },
      { path: 'cheats', element: <Navigate to="/cheats/ps5" replace /> },
      { path: 'reviews', element: <Reviews /> },
      { path: 'compare', element: <Compare /> },
      { path: 'buy', element: <Buy /> },
      { path: 'preload', element: <Preload /> },
      { path: 'characters', element: <Characters /> },
      { path: 'weapons', element: <Weapons /> },
      { path: 'map', element: <Map /> },
      { path: 'guides', element: <Guides /> },
      { path: 'faq', element: <Faq /> },
      { path: 'site-index', element: <SiteIndex /> },
      { path: 'about', element: <Legal page="about" /> },
      { path: 'disclaimer', element: <Legal page="disclaimer" /> },
      { path: 'terms', element: <Legal page="terms" /> },
      { path: 'privacy', element: <Legal page="privacy" /> },
      { path: 'contact', element: <Legal page="contact" /> },
      { path: '404', element: <NotFound /> },
      { path: '*', element: <NotFound /> },
    ],
  },
];
