import { useEffect, useId, useRef, useState } from "react";

const DURATION = 3.95;
const STAR_GAP = 64;

const DULL_COLORS = [
  "#5c3a1c",
  "#5a2e24",
  "#4f1c2e",
  "#421533",
  "#341442",
  "#240e42",
];

const VIVID_COLORS = [
  "#ff9e42",
  "#ff7c50",
  "#ff5a7c",
  "#e6399b",
  "#bf3cd6",
  "#8e33ea",
];

const RAYS = [
  { angle: -90, name: "top", color: "#ff6238", edge: "#ff9a4a" },
  { angle: -18, name: "right", color: "#a835f2", edge: "#d64df2" },
  { angle: 54, name: "bottom-right", color: "#bd29c9", edge: "#f044c1" },
  { angle: 126, name: "bottom-left", color: "#f52b99", edge: "#ff644f" },
  { angle: 198, name: "left", color: "#ff8241", edge: "#ffc05e" },
];

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const lerp = (start: number, end: number, amount: number) => start + (end - start) * clamp(amount);
const easeInOut = (value: number) => {
  const progress = clamp(value);
  return progress * progress * (3 - 2 * progress);
};
const easeOut = (value: number) => 1 - (1 - clamp(value)) ** 3;

function blendHex(from: string, to: string, amount: number) {
  const start = Number.parseInt(from.slice(1), 16);
  const end = Number.parseInt(to.slice(1), 16);
  const channels = [16, 8, 0].map((shift) =>
    Math.round(lerp((start >> shift) & 255, (end >> shift) & 255, amount)),
  );
  return `rgb(${channels.join(",")})`;
}

function starPath(radius: number) {
  const points: string[] = [];
  for (let index = 0; index < 10; index += 1) {
    const pointRadius = index % 2 === 0 ? radius : radius * 0.382;
    const angle = ((-90 + index * 36) * Math.PI) / 180;
    const x = Math.cos(angle) * pointRadius;
    const y = Math.sin(angle) * pointRadius;
    points.push(`${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return `${points.join(" ")} Z`;
}

type IntroProps = {
  onDone?: () => void;
  onSkip?: () => void;
};

export default function StarLoader({ onDone, onSkip }: IntroProps) {
  const id = useId().replace(/:/g, "");
  const [time, setTime] = useState(0);
  const [viewport, setViewport] = useState({ width: 1280, height: 720 });
  const onDoneRef = useRef(onDone ?? onSkip);
  onDoneRef.current = onDone ?? onSkip;

  useEffect(() => {
    const updateViewport = () =>
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    let frame = 0;
    let start: number | null = null;

    const tick = (now: number) => {
      if (start === null) start = now;
      const elapsed = (now - start) / 1000;
      if (elapsed >= DURATION) {
        setTime(DURATION);
        onDoneRef.current?.();
        return;
      }
      setTime(elapsed);
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Enter" || event.code === "Space") {
        onDoneRef.current?.();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Much smoother timing to avoid any flash/blast
  const brightness = clamp((time - 0.30) / 1.50);   // slow rise to full neon
  const toWhite = clamp((time - 1.90) / 0.75);      // only starts after full brightness

  const collapse = easeInOut((time - 2.20) / 0.4);
  const showRow = time < 2.60;
  const showHero = time >= 2.50 && time < 3.95;
  const flareProgress = easeOut((time - 2.75) / 0.95);
  const flareRadius = lerp(0, Math.max(viewport.width, viewport.height) * 0.77, flareProgress);
  const coreRadius = lerp(27, 98, easeOut((time - 2.70) / 0.65));
  const bloomOpacity = clamp((time - 2.75) / 0.2);
  const warp = easeInOut((time - 3.65) / 0.3);
  const flashOpacity = clamp((warp - 0.45) / 0.55);
  const centerX = viewport.width / 2;
  const centerY = viewport.height / 2;
  const rayLength = flareRadius * 1.36;
  const backgroundId = `${id}-background`;

  return (
    <div
      role="status"
      aria-label="Explore Leonida intro animation"
      className="fixed inset-0 z-[9999] isolate flex select-none items-center justify-center overflow-hidden bg-[#0a0516] text-white"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* ===== 6 INITIAL STARS ===== */}
        {showRow && (
          <div className="absolute left-1/2 top-1/2 h-16 w-full -translate-x-1/2 -translate-y-1/2">
            {DULL_COLORS.map((dullColor, index) => {
              const vividColor = VIVID_COLORS[index];
              const x = (index - 2.5) * STAR_GAP * (1 - collapse);

              // Very smooth color transition
              const colorMix = easeInOut(brightness);
              let fill = blendHex(dullColor, vividColor, colorMix);

              if (toWhite > 0) {
                // Smooth ease into white
                fill = blendHex(fill, "#ffffff", easeInOut(toWhite));
              }

              // Glow strength grows smoothly and never drops
              const glowStrength = Math.min(1, brightness * 1.1);

              let filterStyle = `drop-shadow(0 0 4px ${dullColor})`;

              if (toWhite > 0.05) {
                filterStyle = `drop-shadow(0 0 ${8 + 18 * toWhite}px #ffffff) drop-shadow(0 0 ${18 + 24 * toWhite}px #ffd166)`;
              } else if (glowStrength > 0.08) {
                filterStyle = `drop-shadow(0 0 ${5 + 16 * glowStrength}px ${vividColor}) drop-shadow(0 0 ${10 + 22 * glowStrength}px ${vividColor})`;
              }

              return (
                <span
                  key={index}
                  className="absolute left-1/2 top-1/2"
                  style={{
                    transform: `translate(calc(-50% + ${x}px), -50%)`,
                    filter: filterStyle,
                    opacity: lerp(0.7, 1, brightness),
                  }}
                >
                  <svg
                    width="58"
                    height="58"
                    viewBox="-35 -35 70 70"
                    aria-hidden="true"
                    className="overflow-visible"
                  >
                    <path d={starPath(28)} fill={fill} />
                  </svg>
                </span>
              );
            })}
          </div>
        )}

        {/* ===== HERO STAR ===== */}
        {showHero && (
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox={`0 0 ${viewport.width} ${viewport.height}`}
            preserveAspectRatio="none"
            aria-hidden="true"
            style={{
              transform: `translate3d(0, 0, 0) scale(${1 + warp * 22})`,
              transformOrigin: `${centerX}px ${centerY}px`,
              opacity: Math.max(0, 1 - flashOpacity * 0.75),
              willChange: "transform, opacity",
            }}
          >
            <defs>
              <radialGradient
                id={backgroundId}
                gradientUnits="userSpaceOnUse"
                cx={centerX}
                cy={centerY}
                r={Math.max(1, flareRadius)}
              >
                <stop offset="0%" stopColor="#fff8f2" stopOpacity="0.75" />
                <stop offset="18%" stopColor="#ffb5c9" stopOpacity="0.38" />
                <stop offset="55%" stopColor="#cc3bd2" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#cc3bd2" stopOpacity="0" />
              </radialGradient>

              <filter id={`${id}-wide-glow`} x="-150%" y="-150%" width="400%" height="400%">
                <feGaussianBlur stdDeviation={Math.min(40, Math.max(5, flareRadius * 0.075))} />
              </filter>

              <filter id={`${id}-ray-glow`} x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation={Math.min(20, Math.max(3, flareRadius * 0.028))} />
              </filter>

              {RAYS.map((ray) => {
                const angle = (ray.angle * Math.PI) / 180;
                return (
                  <linearGradient
                    key={ray.name}
                    id={`${id}-ray-${ray.name}`}
                    gradientUnits="userSpaceOnUse"
                    x1={centerX}
                    y1={centerY}
                    x2={centerX + Math.cos(angle) * rayLength}
                    y2={centerY + Math.sin(angle) * rayLength}
                  >
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
                    <stop offset="12%" stopColor="#fff4ed" stopOpacity="0.96" />
                    <stop offset="37%" stopColor={ray.color} stopOpacity="0.94" />
                    <stop offset="73%" stopColor={ray.edge} stopOpacity="0.62" />
                    <stop offset="100%" stopColor={ray.color} stopOpacity="0" />
                  </linearGradient>
                );
              })}
            </defs>

            {bloomOpacity > 0 && (
              <g opacity={bloomOpacity}>
                <circle
                  cx={centerX}
                  cy={centerY}
                  r={Math.max(1, flareRadius)}
                  fill={`url(#${backgroundId})`}
                />

                <g filter={`url(#${id}-wide-glow)`} opacity="0.58">
                  {RAYS.map((ray) => {
                    const angle = (ray.angle * Math.PI) / 180;
                    return (
                      <line
                        key={`wide-${ray.name}`}
                        x1={centerX}
                        y1={centerY}
                        x2={centerX + Math.cos(angle) * rayLength}
                        y2={centerY + Math.sin(angle) * rayLength}
                        stroke={`url(#${id}-ray-${ray.name})`}
                        strokeWidth={Math.max(2, flareRadius * 0.2)}
                        strokeLinecap="round"
                      />
                    );
                  })}
                </g>

                <g filter={`url(#${id}-ray-glow)`} opacity="0.8">
                  {RAYS.map((ray) => {
                    const angle = (ray.angle * Math.PI) / 180;
                    return (
                      <line
                        key={`glow-${ray.name}`}
                        x1={centerX}
                        y1={centerY}
                        x2={centerX + Math.cos(angle) * rayLength}
                        y2={centerY + Math.sin(angle) * rayLength}
                        stroke={`url(#${id}-ray-${ray.name})`}
                        strokeWidth={Math.max(1.5, flareRadius * 0.055)}
                        strokeLinecap="round"
                      />
                    );
                  })}
                </g>

                {RAYS.map((ray) => {
                  const angle = (ray.angle * Math.PI) / 180;
                  return (
                    <line
                      key={`ray-${ray.name}`}
                      x1={centerX}
                      y1={centerY}
                      x2={centerX + Math.cos(angle) * rayLength}
                      y2={centerY + Math.sin(angle) * rayLength}
                      stroke={`url(#${id}-ray-${ray.name})`}
                      strokeWidth={Math.max(1.2, flareRadius * 0.012)}
                      strokeLinecap="round"
                    />
                  );
                })}
              </g>
            )}

            <path
              d={starPath(coreRadius)}
              transform={`translate(${centerX} ${centerY})`}
              fill="#fffdfb"
            />
            <circle cx={centerX} cy={centerY} r={coreRadius * 0.2} fill="#ffffff" />
          </svg>
        )}
      </div>

      <button
        type="button"
        onClick={() => onDoneRef.current?.()}
        className="absolute top-4 right-4 z-30 px-3 py-1.5 text-xs text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-full border border-white/10 backdrop-blur-sm transition-colors"
        title="Skip intro (Esc / Space)"
      >
        Skip ➜
      </button>

      {flashOpacity > 0 && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            opacity: flashOpacity,
            background: "linear-gradient(105deg, #ffb05c, #fffdfb 52%, #e942aa)",
            willChange: "opacity",
          }}
        />
      )}

      <p className="pointer-events-none absolute inset-x-0 bottom-8 z-10 text-center font-medium uppercase tracking-[0.24em] text-white/50">
        {time < 1.8 ? "Welcome to Leonida" : "Explore Leonida"}
      </p>
    </div>
  );
}