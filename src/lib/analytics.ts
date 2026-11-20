import { SITE } from '../config/site';

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export type ConsentValue = 'granted' | 'denied';

const CONSENT_KEY = 'leonida_consent';

export function getConsent(): ConsentValue | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CONSENT_KEY) as ConsentValue | null;
}

export function setConsent(value: ConsentValue) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CONSENT_KEY, value);

  if (window.gtag) {
    // Full Google Consent Mode v2 (March 2024 EU & Global standard)
    window.gtag('consent', 'update', {
      analytics_storage: value === 'granted' ? 'granted' : 'denied',
      ad_storage: value === 'granted' ? 'granted' : 'denied',
      ad_user_data: value === 'granted' ? 'granted' : 'denied',
      ad_personalization: value === 'granted' ? 'granted' : 'denied',
    });
  }

  if (value === 'granted') {
    loadAnalytics();
  }
}

export function initConsentMode() {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };

  const stored = getConsent();
  const isGranted = stored === 'granted';

  // Full Consent Mode v2 Defaults
  window.gtag('consent', 'default', {
    analytics_storage: isGranted ? 'granted' : 'denied',
    ad_storage: isGranted ? 'granted' : 'denied',
    ad_user_data: isGranted ? 'granted' : 'denied',
    ad_personalization: isGranted ? 'granted' : 'denied',
    wait_for_update: 500,
  });
}

export function loadAnalytics() {
  if (typeof window === 'undefined') return;
  const gaId = SITE.gaId;
  if (!gaId || gaId.includes('XXXX')) return;
  if (document.getElementById('leonida-ga')) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  script.id = 'leonida-ga';
  document.head.appendChild(script);

  window.gtag!('js', new Date());
  window.gtag!('config', gaId, {
    send_page_view: false, // Managed manually via React Router trackPageView
    anonymize_ip: true,
    cookie_flags: 'SameSite=None;Secure',
  });

  // Initialize automatic enhanced tracking
  initAutoTracking();
}

// Track SPA Page Views with engagement timing
let lastPagePath = '';
let pageStartTime = Date.now();

export function trackPageView(path: string, title?: string) {
  if (typeof window === 'undefined') return;
  const gaId = SITE.gaId;
  if (!gaId || !window.gtag) return;

  // Track previous page duration if changing routes
  if (lastPagePath && lastPagePath !== path) {
    const durationSeconds = Math.round((Date.now() - pageStartTime) / 1000);
    if (durationSeconds > 2) {
      window.gtag('event', 'user_engagement', {
        engagement_time_msec: durationSeconds * 1000,
        page_path: lastPagePath,
      });
    }
  }

  lastPagePath = path;
  pageStartTime = Date.now();
  resetScrollTracking();

  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
    page_location: window.location.href,
  });
}

// Generic event tracker
export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', event, params);
}

/* ------------------------------------------------ Enhanced Tracking Features */

// 1. Scroll Depth Milestones (25%, 50%, 75%, 90%)
const milestonesTracked = new Set<number>();

function resetScrollTracking() {
  milestonesTracked.clear();
}

function handleScroll() {
  if (typeof window === 'undefined' || !window.gtag) return;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (docHeight <= 0) return;

  const scrollPercent = Math.round((window.scrollY / docHeight) * 100);
  const thresholds = [25, 50, 75, 90];

  for (const t of thresholds) {
    if (scrollPercent >= t && !milestonesTracked.has(t)) {
      milestonesTracked.add(t);
      track('scroll_depth', {
        percent_scrolled: t,
        page_path: window.location.pathname,
      });
    }
  }
}

// 2. Outbound Link & File Download Auto-Tracking
function handleGlobalClicks(e: MouseEvent) {
  const target = (e.target as HTMLElement).closest('a');
  if (!target || !target.href) return;

  const href = target.href;
  const url = new URL(href, window.location.origin);

  // File download tracking (JSON, PDF, CSV, XML)
  const isDownload = /\.(json|xml|txt|pdf|csv|zip)$/i.test(url.pathname);
  if (isDownload) {
    track('file_download', {
      file_name: url.pathname.split('/').pop() || 'download',
      file_extension: url.pathname.split('.').pop() || '',
      link_url: href,
    });
    return;
  }

  // Outbound link tracking
  const isExternal = url.hostname !== window.location.hostname;
  if (isExternal) {
    track('outbound_click', {
      link_url: href,
      link_domain: url.hostname,
      link_text: target.textContent?.trim().slice(0, 50) || '',
    });
  }
}

let autoTrackingInitialized = false;
function initAutoTracking() {
  if (autoTrackingInitialized || typeof window === 'undefined') return;
  autoTrackingInitialized = true;

  // Throttled scroll listener
  let ticking = false;
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );

  // Global click delegator
  document.addEventListener('click', handleGlobalClicks, { passive: true });
}
