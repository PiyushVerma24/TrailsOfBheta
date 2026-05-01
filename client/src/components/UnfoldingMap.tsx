import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BhetaMap from "./BhetaMap";
import { ChevronDown } from "lucide-react";
import type { Mode } from "@/lib/destinations";

interface UnfoldingMapProps {
  active: string | null;
  onSelect: (id: string) => void;
  modeFilter: Mode | "all";
}

export default function UnfoldingMap({ active, onSelect, modeFilter }: UnfoldingMapProps) {
  const [isUnfolded, setIsUnfolded] = useState(false);

  return (
    <div className="space-y-4">
      {/* Unfold Button */}
      {!isUnfolded && (
        <motion.button
          onClick={() => setIsUnfolded(true)}
          className="flex items-center gap-2 text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-ink)] transition-colors group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ChevronDown className="w-4 h-4" />
          </motion.div>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em]">
            Unfold the map
          </span>
        </motion.button>
      )}

      {/* Map Container with Unfolding Animation */}
      <AnimatePresence>
        {isUnfolded && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0, y: -20 }}
            animate={{ opacity: 1, scaleY: 1, y: 0 }}
            exit={{ opacity: 0, scaleY: 0, y: -20 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
              type: "spring",
              stiffness: 80,
              damping: 12,
            }}
            className="origin-top"
          >
            {/* Wave effect during unfolding */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{
                duration: 1.2,
                ease: "easeInOut",
                delay: 0.2,
              }}
              className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[color:var(--color-deodar)]/5 via-transparent to-transparent pointer-events-none blur-xl"
            />

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

              <BhetaMap active={active} onSelect={onSelect} modeFilter={modeFilter} />

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
