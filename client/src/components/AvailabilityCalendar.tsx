// Himalayan-styled availability calendar built on react-day-picker v9
// Paper / deodar / terracotta palette — no purple gradients.

import { useMemo } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import { buildBlockedDateSet, type BlockedRange } from "@/lib/qord";

interface Props {
  blockedRanges: BlockedRange[];
  selected: DateRange | undefined;
  onSelect: (range: DateRange | undefined) => void;
  minNights?: number;
}

export default function AvailabilityCalendar({ blockedRanges, selected, onSelect, minNights = 1 }: Props) {
  const blockedSet = useMemo(() => buildBlockedDateSet(blockedRanges), [blockedRanges]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function isBlocked(date: Date) {
    const ymd = date.toISOString().slice(0, 10);
    return date < today || blockedSet.has(ymd);
  }

  return (
    <div className="availability-calendar font-mono">
      <style>{`
        .availability-calendar .rdp-root {
          --rdp-accent-color: var(--color-deodar);
          --rdp-accent-background-color: color-mix(in srgb, var(--color-deodar) 15%, transparent);
          --rdp-range_start-color: var(--color-paper);
          --rdp-range_start-background: var(--color-deodar);
          --rdp-range_end-color: var(--color-paper);
          --rdp-range_end-background: var(--color-deodar);
          --rdp-range_middle-background-color: color-mix(in srgb, var(--color-deodar) 12%, transparent);
          --rdp-day_button-border-radius: 3px;
          --rdp-day-width: 40px;
          --rdp-day-height: 40px;
          --rdp-outside-opacity: 0.25;
          --rdp-disabled-opacity: 0.28;
          --rdp-font-family: "JetBrains Mono", ui-monospace, monospace;
          width: 100%;
          background: transparent;
          color: var(--color-ink);
        }
        .availability-calendar .rdp-month_caption {
          font-family: "Fraunces", ui-serif, Georgia, serif;
          font-size: 1rem;
          letter-spacing: 0.05em;
          color: var(--color-ink);
        }
        .availability-calendar .rdp-nav button {
          color: var(--color-deodar);
          opacity: 0.7;
        }
        .availability-calendar .rdp-nav button:hover {
          opacity: 1;
          background: color-mix(in srgb, var(--color-deodar) 10%, transparent);
        }
        .availability-calendar .rdp-weekday {
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--color-ink-soft);
          opacity: 0.6;
        }
        .availability-calendar .rdp-day_button {
          font-size: 12px;
          border: 1px solid transparent;
          transition: all 0.12s ease;
        }
        .availability-calendar .rdp-day_button:hover:not(:disabled) {
          border-color: var(--color-terracotta);
          color: var(--color-terracotta);
          background: color-mix(in srgb, var(--color-terracotta) 8%, transparent);
        }
        .availability-calendar .rdp-day--disabled .rdp-day_button,
        .availability-calendar .rdp-day--disabled .rdp-day_button:hover {
          text-decoration: line-through;
          color: var(--color-ink-soft) !important;
          border-color: transparent !important;
          background: transparent !important;
          cursor: not-allowed;
          opacity: 0.3;
        }
        .availability-calendar .rdp-day--range_start .rdp-day_button,
        .availability-calendar .rdp-day--range_end .rdp-day_button {
          background: var(--color-deodar) !important;
          color: var(--color-paper) !important;
          border-color: var(--color-deodar) !important;
        }
        .availability-calendar .rdp-day--range_middle .rdp-day_button {
          background: color-mix(in srgb, var(--color-deodar) 14%, var(--color-paper)) !important;
          border-radius: 0 !important;
        }
        .availability-calendar .rdp-months {
          gap: 2rem;
        }
      `}</style>

      <DayPicker
        mode="range"
        numberOfMonths={2}
        selected={selected}
        onSelect={onSelect}
        disabled={isBlocked}
        fromDate={today}
        showOutsideDays={false}
      />

      <div className="flex items-center gap-5 mt-3 text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-[color:var(--color-deodar)]" />
          Your stay
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm border border-[color:var(--color-rule)] line-through opacity-40 text-[8px] flex items-center justify-center">×</span>
          Unavailable
        </span>
        {minNights > 1 && (
          <span className="ml-auto opacity-60">Min. {minNights} nights</span>
        )}
      </div>
    </div>
  );
}
