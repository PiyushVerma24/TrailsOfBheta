// BhetaMap — the cartographic centerpiece.
// Style reminder: vintage Survey-of-India journal. Hand-drawn feel, dotted
// routes, pulsing reach rings, deodar green ink. Do not modernize the look.

import React, { useMemo } from "react";
import { BHETA, DESTINATIONS, type Destination, type Mode } from "@/lib/destinations";

interface Props {
  active: string | null;
  onSelect: (id: string) => void;
  modeFilter: Mode | "all";
}

// Concentric reach rings, in km. Pixels-per-km is calibrated against
// the Bheta -> Nainital pair (127 km ≈ 234 px in the SVG).
const KM_PER_PX = 127 / Math.hypot(580 - 555, 580 - 360); // ~0.54 km/px
const PX_PER_KM = 1 / KM_PER_PX;
const REACH_RINGS_KM = [50, 100, 150, 200, 300];

const MODE_COLOR: Record<Mode, string> = {
  road: "#2F4A3A",
  rail: "#3A4D6B",
  air: "#B0512E",
};

// ─── Tiny notional animated vehicles ─────────────────────────────────────────
// Shapes are intentionally small (~6-18 SVG units) so they read as
// decorative indicators, not detailed illustrations.

function SmallPlane() {
  const c = "#B0512E";
  return (
    <g>
      <ellipse cx="0" cy="0" rx="5" ry="1" fill={c} />
      <path d="M 4 -0.5 L 7 0 L 4 0.5 Z" fill={c} />
      <path d="M 1 0 L -2 -6 L -3.5 -5.5 L 0 0 Z" fill={c} />
      <path d="M 1 0 L -2  6 L -3.5  5.5 L 0 0 Z" fill={c} />
      <path d="M -4 0 L -6 -2.5 L -6.5 -2 L -5 0 Z" fill={c} />
      <path d="M -4 0 L -6  2.5 L -6.5  2 L -5 0 Z" fill={c} />
    </g>
  );
}

function SmallTrain({ mirrored }: { mirrored: boolean }) {
  const c = "#3A4D6B";
  return (
    <g transform={mirrored ? "scale(-1,1)" : undefined}>
      <rect x="-16" y="-3" width="5" height="5" rx="0.5" fill={c} />
      <rect x="-10" y="-3" width="5" height="5" rx="0.5" fill={c} />
      <rect x="-4"  y="-3" width="7" height="5" rx="0.5" fill={c} />
      <rect x="0"   y="-6" width="2" height="3" rx="0.3" fill={c} />
      <circle cx="-14" cy="3" r="1.5" fill="#1b1a17" />
      <circle cx="-7"  cy="3" r="1.5" fill="#1b1a17" />
      <circle cx="1"   cy="3" r="1.5" fill="#1b1a17" />
    </g>
  );
}

function SmallCar() {
  const c = "#6b5a32";
  return (
    <g>
      <rect x="-3" y="-2" width="7" height="4" rx="1" fill={c} />
      <path d="M -2 -2 L -1 -4.5 L 3 -4.5 L 4 -2 Z" fill={c} />
      <circle cx="-1" cy="3" r="1.5" fill="#1b1a17" />
      <circle cx="3"  cy="3" r="1.5" fill="#1b1a17" />
    </g>
  );
}

// One vehicle (plane or train) that fades in, travels to its hub, fades out,
// then triggers a car that fades in at the hub and drives to BHETA along the
// displayed route (traversed in reverse via keyPoints="1;1;0").
interface VUProps {
  vPathId: string;
  cRouteId: string;
  totalDur: number;
  ratio: number;
  begin: number;
  rotateV?: boolean;
  vehicle: React.ReactNode;
}
function VehicleUnit({ vPathId, cRouteId, totalDur, ratio, begin, rotateV = true, vehicle }: VUProps) {
  const d = `${totalDur}s`, b = `${begin}s`, r = ratio.toFixed(4);
  const fadeOut = Math.max(0.04, ratio - 0.07).toFixed(4);
  const fadeIn  = Math.min(0.98, ratio + 0.05).toFixed(4);
  return (
    <g>
      {/* Vehicle: fades in, travels, fades out on arrival */}
      <g>
        {/* @ts-ignore */}
        <animate attributeName="opacity" values="0;1;1;0;0"
          keyTimes={`0;0.04;${fadeOut};${r};1`}
          dur={d} begin={b} repeatCount="indefinite" />
        {/* @ts-ignore */}
        <animateMotion dur={d} begin={b} repeatCount="indefinite"
          rotate={rotateV ? "auto" : "0"} keyPoints="0;1;1" keyTimes={`0;${r};1`} calcMode="linear">
          {/* @ts-ignore */}
          <mpath href={`#${vPathId}`} />
        </animateMotion>
        {vehicle}
      </g>
      {/* Car: waits at hub, then drives to BHETA along the map route in reverse */}
      <g>
        {/* @ts-ignore */}
        <animate attributeName="opacity" values="0;0;1;1;0"
          keyTimes={`0;${r};${fadeIn};0.90;1`}
          dur={d} begin={b} repeatCount="indefinite" />
        {/* @ts-ignore */}
        <animateMotion dur={d} begin={b} repeatCount="indefinite"
          rotate="auto" keyPoints="1;1;0" keyTimes={`0;${r};1`} calcMode="linear">
          {/* @ts-ignore */}
          <mpath href={`#${cRouteId}`} />
        </animateMotion>
        <SmallCar />
      </g>
    </g>
  );
}

function curvedPath(x1: number, y1: number, x2: number, y2: number, curvature = 0.18) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const nx = -dy;
  const ny = dx;
  const len = Math.hypot(nx, ny) || 1;
  const ox = (nx / len) * Math.hypot(dx, dy) * curvature;
  const oy = (ny / len) * Math.hypot(dx, dy) * curvature;
  return `M ${x1} ${y1} Q ${mx + ox} ${my + oy} ${x2} ${y2}`;
}

// Mode-aware wrapper — planes on Air tab, trains on Rail tab, static icons on All.
function AnimatedVehicles({ modeFilter }: { modeFilter: Mode | "all" }) {
  if (modeFilter === "road") return null;

  // Route paths match the dotted lines drawn on the map (curvature for index 0).
  const airRoute  = curvedPath(BHETA.x, BHETA.y, 700, 645, 0.14);
  const railRoute = curvedPath(BHETA.x, BHETA.y, 620, 615, 0.14);

  if (modeFilter === "all") {
    // Static notional icons at each hub — no cars, no motion
    return (
      <g opacity="0.6">
        <g transform="translate(700, 645)"><SmallPlane /></g>
        <g transform="translate(620, 615)"><SmallTrain mirrored={false} /></g>
      </g>
    );
  }

  if (modeFilter === "air") {
    const tDur = 28, ratio = 9 / 28, half = 14;
    return (
      <g>
        <defs>
          <path id="av-pa1" d="M -70 662 Q 290 662 700 645" />
          <path id="av-pa2" d="M -70 686 Q 260 685 700 645" />
          <path id="av-ar"  d={airRoute} />
        </defs>
        <VehicleUnit vPathId="av-pa1" cRouteId="av-ar" totalDur={tDur} ratio={ratio} begin={0}
          vehicle={<SmallPlane />} />
        <VehicleUnit vPathId="av-pa2" cRouteId="av-ar" totalDur={tDur} ratio={ratio} begin={half}
          vehicle={<SmallPlane />} />
      </g>
    );
  }

  // modeFilter === "rail"
  const tDur = 32, ratio = 10 / 32, half = 16;
  return (
    <g>
      <defs>
        <path id="av-tr1" d="M -60 630 Q 260 634 620 615" />
        <path id="av-tr2" d="M 1010 620 L 620 615" />
        <path id="av-rr"  d={railRoute} />
      </defs>
      {/* Train from west (heading right, rotate=auto) */}
      <VehicleUnit vPathId="av-tr1" cRouteId="av-rr" totalDur={tDur} ratio={ratio} begin={0}
        vehicle={<SmallTrain mirrored={false} />} />
      {/* Train from east (heading left, rotate=0 + mirrored shape) */}
      <VehicleUnit vPathId="av-tr2" cRouteId="av-rr" totalDur={tDur} ratio={ratio} begin={half}
        rotateV={false} vehicle={<SmallTrain mirrored={true} />} />
    </g>
  );
}

export default function BhetaMap({ active, onSelect, modeFilter }: Props) {
  const visible = useMemo(
    () => DESTINATIONS.filter((d) => modeFilter === "all" || d.mode === modeFilter),
    [modeFilter]
  );

  return (
    <div className="relative w-full">
      <svg
        viewBox="0 0 1000 700"
        className="w-full h-auto block"
        role="img"
        aria-label="Stylized map of Uttarakhand showing routes from major hubs to Trails of Bheta"
      >
        <defs>
          {/* Subtle paper grain overlay */}
          <pattern id="grain" width="3" height="3" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.4" fill="#1b1a17" opacity="0.05" />
          </pattern>
          {/* Compass rose star */}
          <symbol id="compass" viewBox="-50 -50 100 100">
            <circle r="44" fill="none" stroke="#1b1a17" strokeWidth="1" opacity="0.6" />
            <circle r="32" fill="none" stroke="#1b1a17" strokeWidth="0.6" opacity="0.4" />
            <polygon points="0,-44 6,0 0,44 -6,0" fill="#2F4A3A" opacity="0.85" />
            <polygon points="-44,0 0,6 44,0 0,-6" fill="#1b1a17" opacity="0.85" />
            <polygon points="0,-30 4,0 0,30 -4,0" fill="#B0512E" opacity="0.9" transform="rotate(45)" />
            <text y="-50" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#1b1a17">N</text>
            <text y="58" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#1b1a17">S</text>
            <text x="54" y="4" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#1b1a17">E</text>
            <text x="-54" y="4" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#1b1a17">W</text>
          </symbol>
          <filter id="rough" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
            <feDisplacementMap in="SourceGraphic" scale="0.6" />
          </filter>
          <radialGradient id="paperWash" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="#fbf3df" stopOpacity="0.0" />
            <stop offset="80%" stopColor="#c9b78f" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#8a7a52" stopOpacity="0.45" />
          </radialGradient>
        </defs>

        {/* Frame & wash */}
        <rect x="6" y="6" width="988" height="688" fill="url(#paperWash)" />
        <rect x="6" y="6" width="988" height="688" fill="url(#grain)" />
        <rect
          x="14" y="14" width="972" height="672"
          fill="none" stroke="#1b1a17" strokeWidth="1.2" opacity="0.7"
        />
        <rect
          x="22" y="22" width="956" height="656"
          fill="none" stroke="#1b1a17" strokeWidth="0.5" opacity="0.45"
          strokeDasharray="2 4"
        />

        {/* Stylized contour / mountain ridge lines (decorative, evoke Himalayas) */}
        <g stroke="#2F4A3A" strokeWidth="0.7" fill="none" opacity="0.35" filter="url(#rough)">
          <path d="M 60 220 Q 220 140 380 200 T 720 180 T 950 220" />
          <path d="M 80 260 Q 260 200 420 250 T 760 230 T 950 270" />
          <path d="M 100 300 Q 280 250 460 290 T 780 280 T 940 310" />
          <path d="M 120 350 Q 320 310 520 340 T 820 340 T 940 360" />
        </g>

        {/* Plains / Terai band at bottom */}
        <g opacity="0.5">
          <path
            d="M 30 560 Q 250 540 500 560 T 970 560 L 970 670 L 30 670 Z"
            fill="#ead8b8" opacity="0.55"
          />
          <text x="820" y="660" fontFamily="Fraunces" fontStyle="italic" fontSize="14" fill="#6b5a32" opacity="0.7">
            Terai plains
          </text>
        </g>

        {/* Region labels */}
        <g fontFamily="Fraunces" fontSize="13" fill="#2F4A3A" opacity="0.55" fontStyle="italic">
          <text x="180" y="120">G A R H W A L</text>
          <text x="660" y="120">K U M A O N</text>
          <text x="380" y="680" opacity="0.6">U T T A R   P R A D E S H</text>
        </g>

        {/* River lines */}
        <g fill="none" stroke="#3A4D6B" strokeWidth="1.1" opacity="0.55" filter="url(#rough)">
          <path d="M 240 410 Q 320 470 380 530 T 470 640" />
          <path d="M 540 380 Q 600 480 640 580 T 720 660" />
          <text>
            <textPath href="#" />
          </text>
        </g>

        {/* Reach rings (km) centered on Bheta */}
        <g className="ring-pulse">
          {REACH_RINGS_KM.map((km) => {
            const r = km * PX_PER_KM;
            return (
              <g key={km}>
                <circle
                  cx={BHETA.x} cy={BHETA.y} r={r}
                  fill="none" stroke="#2F4A3A" strokeWidth="0.7"
                  strokeDasharray="2 5" opacity="0.5"
                />
                <text
                  x={BHETA.x + r * Math.cos(Math.PI * 1.15)}
                  y={BHETA.y + r * Math.sin(Math.PI * 1.15) - 4}
                  fontFamily="JetBrains Mono" fontSize="9" fill="#2F4A3A" opacity="0.8"
                  textAnchor="middle"
                >
                  {km} km
                </text>
              </g>
            );
          })}
        </g>

        {/* Routes from Bheta to each visible destination */}
        <g>
          {visible.map((d, i) => {
            const isActive = active === d.id;
            const path = curvedPath(BHETA.x, BHETA.y, d.x, d.y, 0.14 + (i % 3) * 0.04);
            return (
              <path
                key={d.id}
                d={path}
                fill="none"
                stroke={MODE_COLOR[d.mode]}
                strokeWidth={isActive ? 2.4 : 1.1}
                strokeDasharray={d.mode === "rail" ? "10 4 2 4" : d.mode === "air" ? "1 6" : "5 5"}
                strokeLinecap="round"
                opacity={isActive ? 1 : 0.55}
                style={{
                  transition: "opacity 250ms ease, stroke-width 250ms ease",
                  filter: isActive ? "drop-shadow(0 1px 0 rgba(255,255,255,0.8))" : undefined,
                }}
              />
            );
          })}
        </g>

        {/* Destination pins */}
        <g>
          {visible.map((d) => {
            const isActive = active === d.id;
            return (
              <g
                key={d.id}
                transform={`translate(${d.x}, ${d.y})`}
                className="pin-drop"
                style={{ cursor: "pointer" }}
                onClick={() => onSelect(d.id)}
                role="button"
                aria-label={`${d.name}, ${d.km} kilometres, ${d.hoursLabel}`}
              >
                {/* halo */}
                {isActive && (
                  <circle r="14" fill={MODE_COLOR[d.mode]} opacity="0.18" />
                )}
                <circle r="5" fill="#fbf3df" stroke={MODE_COLOR[d.mode]} strokeWidth="1.6" />
                <circle r="1.6" fill={MODE_COLOR[d.mode]} />
                {/* white halo for label legibility against contour lines */}
                <text
                  x="9" y="-6"
                  fontFamily="Fraunces" fontSize={isActive ? 15 : 13}
                  stroke="#fbf3df" strokeWidth="3" strokeLinejoin="round" paintOrder="stroke"
                  fill="#1b1a17"
                  style={{ transition: "font-size 200ms ease" }}
                >
                  {d.name}
                </text>
                <text
                  x="9" y="8"
                  fontFamily="JetBrains Mono" fontSize="10"
                  stroke="#fbf3df" strokeWidth="2.5" strokeLinejoin="round" paintOrder="stroke"
                  fill="#3b3833" opacity="0.95"
                >
                  {d.km} km · {d.hoursLabel}
                </text>
              </g>
            );
          })}
        </g>

        {/* Bheta — the home pin */}
        <g transform={`translate(${BHETA.x}, ${BHETA.y})`}>
          <circle r="22" fill="#B0512E" opacity="0.12" />
          <circle r="14" fill="#B0512E" opacity="0.22" />
          <circle r="7" fill="#B0512E" stroke="#fbf3df" strokeWidth="2" />
          <path d="M 0 -28 L 4 -16 L -4 -16 Z" fill="#B0512E" />
          <text
            x="14" y="-18"
            fontFamily="Fraunces" fontSize="22" fontWeight="600"
            stroke="#fbf3df" strokeWidth="4" strokeLinejoin="round" paintOrder="stroke"
            fill="#B0512E"
          >
            Trails of Bheta
          </text>
          <text
            x="14" y="-2"
            fontFamily="JetBrains Mono" fontSize="10"
            stroke="#fbf3df" strokeWidth="2.5" strokeLinejoin="round" paintOrder="stroke"
            fill="#3b3833"
          >
            29.85° N · 79.60° E
          </text>
        </g>

        {/* Compass rose */}
        <g transform="translate(900, 110) scale(0.55)">
          <use href="#compass" />
        </g>

        {/* Animated vehicles — planes → Pantnagar, trains → Kathgodam, sedans → Kausani */}
        <AnimatedVehicles modeFilter={modeFilter} />

        {/* Scale bar (calibrated against PX_PER_KM) */}
        <g transform="translate(60, 640)">
          <text fontFamily="JetBrains Mono" fontSize="10" fill="#1b1a17" y="-6">
            SCALE — kilometres
          </text>
          {[0, 50, 100, 150, 200].map((km, i) => (
            <g key={km} transform={`translate(${km * PX_PER_KM}, 0)`}>
              <line y1="0" y2="6" stroke="#1b1a17" strokeWidth="1" />
              <text y="20" fontFamily="JetBrains Mono" fontSize="9" fill="#1b1a17" textAnchor="middle">
                {km}
              </text>
              {i < 4 && (
                <rect
                  x="0" y="0" width={50 * PX_PER_KM} height="4"
                  fill={i % 2 === 0 ? "#1b1a17" : "#fbf3df"}
                  stroke="#1b1a17" strokeWidth="0.6"
                />
              )}
            </g>
          ))}
        </g>

        {/* Legend */}
        <g transform="translate(60, 560)" fontFamily="JetBrains Mono" fontSize="10" fill="#1b1a17">
          <text y="-6" fontFamily="Fraunces" fontStyle="italic" fontSize="13" fill="#2F4A3A">
            Legend
          </text>
          <g transform="translate(0, 6)">
            <line x1="0" y1="6" x2="28" y2="6" stroke={MODE_COLOR.road} strokeWidth="1.4" strokeDasharray="5 5" />
            <text x="34" y="9">Road</text>
          </g>
          <g transform="translate(0, 22)">
            <line x1="0" y1="6" x2="28" y2="6" stroke={MODE_COLOR.rail} strokeWidth="1.4" strokeDasharray="10 4 2 4" />
            <text x="34" y="9">Rail</text>
          </g>
          <g transform="translate(0, 38)">
            <line x1="0" y1="6" x2="28" y2="6" stroke={MODE_COLOR.air} strokeWidth="1.4" strokeDasharray="1 6" />
            <text x="34" y="9">Air</text>
          </g>
        </g>
      </svg>
    </div>
  );
}

export { DESTINATIONS as MAP_DESTINATIONS };
export type { Destination };


