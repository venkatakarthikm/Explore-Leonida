import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Tune these */
const HERO_SCROLL = {
  /** Scroll distance while pinned. Higher = longer zoom before next section */
  pinDistance: '+=220%', // try 120%–220%
  /** Image start zoom */
  imgStartScale: 1.00,
  /** Image end zoom */
  imgEndScale: 1,
};

function getMaskSettings() {
  const w = window.innerWidth;

  if (w <= 768) {
    return {
      initialMaskPos: '50% 50%',
      initialMaskSize: '3100% 3100%',
      // stop size on mobile - larger = less zoom-out
      maskSize: '88% 88%',
    };
  }

  if (w <= 1024) {
    return {
      initialMaskPos: '50% 50%',
      initialMaskSize: '3500% 3500%',
      maskSize: '88% 88%',
    };
  }

  return {
    // anchor near bottom of the "A"
    initialMaskPos: '50% 58%',
    initialMaskSize: '3500% 3500%',
    // where the logo window STOPS (raise to stop earlier / bigger logo)
    // e.g. '24% 24%' stops sooner, '14% 14%' goes smaller
    maskSize: '88% 88%',
  };
}

export default function GtaHero() {
  const root = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const { initialMaskPos, initialMaskSize, maskSize } = getMaskSettings();

      gsap.set('.gta-hero__mask', {
        maskPosition: initialMaskPos,
        WebkitMaskPosition: initialMaskPos,
        maskSize: initialMaskSize,
        WebkitMaskSize: initialMaskSize,
      });

      gsap.set('.gta-hero__img', { scale: HERO_SCROLL.imgStartScale });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: HERO_SCROLL.pinDistance,
          scrub: 2.5,
          pin: true,
          anticipatePin: 0,
          invalidateOnRefresh: true,
        },
      });

      tl.to('.gta-hero__cue', { opacity: 0, ease: 'power1.inOut' }, 0)
        .to(
          '.gta-hero__img',
          { scale: HERO_SCROLL.imgEndScale, ease: 'power1.inOut' },
          0
        )
        .to(
          '.gta-hero__mask',
          {
            maskSize,
            WebkitMaskSize: maskSize,
            ease: 'power1.inOut',
          },
          0
        );

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: root }
  );

  return (
    <section className="gta-hero" ref={root} aria-label="Grand Theft Auto VI">
      <div className="gta-hero__stage">
        <h1 className="sr-only">Grand Theft Auto VI</h1>

        <div className="gta-hero__mask">
          <img
            className="gta-hero__img"
            src="/images/hero-bg.webp"
            alt="Grand Theft Auto VI - Lucia Caminos and Jason Duval in Vice City Leonida"
          />
        </div>

        <div className="gta-hero__cue" aria-hidden="true">
          <i /> Scroll
        </div>
      </div>
    </section>
  );
}