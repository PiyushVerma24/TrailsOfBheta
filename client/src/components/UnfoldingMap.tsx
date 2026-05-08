import { useState, useEffect } from "react";
import { motion, useAnimate, AnimatePresence } from "framer-motion";
import BhetaMap from "./BhetaMap";
import type { Mode } from "@/lib/destinations";

interface UnfoldingMapProps {
  active: string | null;
  onSelect: (id: string) => void;
  modeFilter: Mode | "all";
}

// SVG viewBox is 1000×700. These are pin positions as % of (w, h).
const NUDGE_STOPS = [
  { left: "60.5%", top: "44.6%" }, // Kausani  (x=605, y=312)
  { left: "66%",   top: "60%" },   // Almora   (x=660, y=420)
  { left: "58%",   top: "82.9%" }, // Nainital (x=580, y=580)
];

function HandNudge() {
  const [scope, animate] = useAnimate();
  const [alive, setAlive] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      await new Promise<void>(r => setTimeout(r, 1500));
      if (cancelled || !scope.current) return;
      await animate(scope.current, { opacity: 1 }, { duration: 0.4 });
      for (const stop of NUDGE_STOPS) {
        if (cancelled) return;
        await animate(scope.current, stop, { duration: 0.9, ease: "easeInOut" });
        await animate(scope.current, { scale: 0.75 }, { duration: 0.12 });
        await animate(scope.current, { scale: 1.0 }, { duration: 0.14 });
        await new Promise<void>(r => setTimeout(r, 300));
      }
      if (cancelled) return;
      await animate(scope.current, { opacity: 0 }, { duration: 0.5 });
      setAlive(false);
    }
    run();
    return () => { cancelled = true; };
  }, []);

  if (!alive) return null;
  return (
    <motion.div
      ref={scope}
      className="absolute pointer-events-none z-20"
      initial={{ opacity: 0, left: "55.5%", top: "51.4%", scale: 1 }}
      style={{ fontSize: 22, lineHeight: 1 }}
    >
      <span style={{ display: "block", transform: "translate(-40%, -80%)" }}>👆</span>
    </motion.div>
  );
}

export default function UnfoldingMap({ active, onSelect, modeFilter }: UnfoldingMapProps) {
  const [isUnfolded, setIsUnfolded] = useState(true);

  return (
    <div className="space-y-4">
      {/* Unfold button — only shown when map is folded */}
      {!isUnfolded && (
        <motion.button
          onClick={() => setIsUnfolded(true)}
          className="flex items-center gap-2 text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-ink)] transition-colors group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="opacity-70">
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em]">
            Unfold the map
          </span>
        </motion.button>
      )}

      {/* Map Container */}
      <AnimatePresence>
        {isUnfolded && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0, y: -20 }}
            animate={{ opacity: 1, scaleY: 1, y: 0 }}
            exit={{ opacity: 0, scaleY: 0, y: -20 }}
            transition={{ duration: 1.4, ease: "easeOut", type: "spring", stiffness: 60, damping: 20 }}
            className="origin-top"
          >
            <div className="paper-card rounded-md p-3 md:p-5 relative z-10">
              <div className="flex items-center justify-between mb-3 px-1">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[color:var(--color-ink-soft)]">
                    Plate I
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl">Routes to Bheta</h2>
                </div>
                <button
                  onClick={() => setIsUnfolded(false)}
                  className="px-3 py-1 text-[10px] font-mono uppercase tracking-[0.18em] rounded border border-[color:var(--color-rule)] text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-ink)] transition-colors"
                >
                  Fold
                </button>
              </div>

              {/* Map with hand nudge overlay */}
              <div className="relative">
                <BhetaMap active={active} onSelect={onSelect} modeFilter={modeFilter} />
                <HandNudge />
              </div>

              <div className="px-1 pt-2 font-mono text-[10px] text-[color:var(--color-ink-soft)] flex flex-wrap gap-x-6 gap-y-1">
                <span>Tip: tap any pin or card to draw the route.</span>
                <span>Distances along motor roads — not straight-line.</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
