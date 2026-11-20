import React, { useId } from 'react';

/**
 * 6 authentic GTA 6 sunset color pairs matching the user's reference frame:
 * Each star transitions vertically from a warm top tip to a deeper sunset bottom.
 * Across the 6 stars (left to right), the palette shifts from amber/coral to magenta/purple.
 */
export const SIX_STAR_PALETTES = [
  { topPale: '#e9923b', botPale: '#d14f5e', glow: '#ff7744' }, // Star 1: Amber -> Coral-Rose
  { topPale: '#e78342', botPale: '#c74272', glow: '#ff6055' }, // Star 2: Sunset Amber -> Rose-Magenta
  { topPale: '#e3714b', botPale: '#b93587', glow: '#ff4d70' }, // Star 3: Coral-Peach -> Magenta
  { topPale: '#da5c5f', botPale: '#a8269e', glow: '#f03590' }, // Star 4: Coral-Rose -> Orchid-Magenta
  { topPale: '#cd4677', botPale: '#941cb1', glow: '#d620b0' }, // Star 5: Rose-Pink -> Violet-Purple
  { topPale: '#bd3392', botPale: '#7b12c5', glow: '#a615e0' }, // Star 6: Magenta-Pink -> Electric Purple
];

export interface SixStarLoaderProps {
  /** Size in pixels for each star (default: 24) */
  size?: number;
  /** Gap between stars in pixels (default: 8) */
  gap?: number;
  /** Whether the blink animation sweeps from left to right (default: true) */
  stagger?: boolean;
  /** Optional loading text displayed underneath */
  label?: string;
  /** Additional wrapper CSS class */
  className?: string;
}

/**
 * Reusable 6-star component with authentic GTA 6 vertical sunset gradients and pulse blink:
 * 1. Each star contains its own internal top-to-bottom vertical linear gradient.
 * 2. Blinks gracefully: resting gradient -> vivid neon -> pure white -> resting gradient.
 */
export default function SixStarLoader({
  size = 24,
  gap = 8,
  stagger = true,
  label,
  className = '',
}: SixStarLoaderProps) {
  const rawId = useId();
  const id = rawId.replace(/[^a-zA-Z0-9_-]/g, '');

  return (
    <div
      className={`inline-flex flex-col items-center justify-center select-none ${className}`}
      role="status"
      aria-label={label || '6 star rating'}
    >
      <div
        style={{ display: 'flex', gap: `${gap}px`, alignItems: 'center', justifyContent: 'center' }}
      >
        {SIX_STAR_PALETTES.map((palette, i) => {
          const delay = stagger ? `${i * 0.14}s` : '0s';
          const gradId = `sixstar-grad-${id}-${i}`;

          return (
            <svg
              key={i}
              width={size}
              height={size}
              viewBox="0 0 100 100"
              className="gta-star-blink overflow-visible"
              style={{
                ['--star-glow' as any]: palette.glow,
                animationDelay: delay,
              }}
              aria-hidden="true"
            >
              <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={palette.topPale} />
                  <stop offset="100%" stopColor={palette.botPale} />
                </linearGradient>
              </defs>
              <polygon
                points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35"
                fill={`url(#${gradId})`}
              />
            </svg>
          );
        })}
      </div>
      {label && (
        <span
          className="font-head text-xs tracking-widest uppercase mt-2 text-white/70"
          style={{ letterSpacing: '0.15em' }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
