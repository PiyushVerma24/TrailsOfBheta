// BookingFlow — 3-step booking: choose dates → guest info → payment link
// Himalayan Cartography palette. Paper, deodar green, terracotta accents.

import { useState, useCallback } from "react";
import type { DateRange } from "react-day-picker";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, ExternalLink, CalendarDays, User, CreditCard, CheckCircle, Loader2 } from "lucide-react";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import { createBooking, nightsBetween, toLocalYMD, type PropertyInfo, type BookingResult } from "@/lib/qord";

type Step = "dates" | "info" | "confirm" | "done";

interface GuestForm {
  name: string;
  phone: string;
  email: string;
}

interface Props {
  property: PropertyInfo;
  token: string;
  onClose: () => void;
}

export default function BookingFlow({ property, token, onClose }: Props) {
  const [step, setStep] = useState<Step>("dates");
  const [range, setRange] = useState<DateRange | undefined>();
  const [guest, setGuest] = useState<GuestForm>({ name: "", phone: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BookingResult | null>(null);

  const nights = range?.from && range?.to ? nightsBetween(range.from, range.to) : 0;
  const baseTotal = nights * property.price_per_night;
  const advanceAmount = Math.ceil(baseTotal * 0.5); // 50% advance

  const canProceedFromDates =
    range?.from && range?.to && nights >= (property.min_nights ?? 1);

  const canProceedFromInfo =
    guest.name.trim().length >= 2 &&
    (guest.phone.trim().length >= 10 || guest.email.trim().includes("@"));

  const handleBook = useCallback(async () => {
    if (!range?.from || !range?.to) return;
    setLoading(true);
    setError(null);
    try {
      const res = await createBooking({
        property_token: token,
        check_in: toLocalYMD(range.from),
        check_out: toLocalYMD(range.to),
        guest_name: guest.name.trim(),
        guest_phone: guest.phone.trim() || undefined,
        guest_email: guest.email.trim() || undefined,
        advance_percentage: 50,
      });
      setResult(res);
      setStep("done");
    } catch (e: any) {
      setError(e.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [range, guest]);

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const formatINR = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="font-mono">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {(["dates", "info", "confirm"] as Step[]).map((s, i) => {
          const stepOrder: Step[] = ["dates", "info", "confirm", "done"];
          const current = stepOrder.indexOf(step);
          const idx = stepOrder.indexOf(s);
          const done = current > idx;
          const active = s === step;
          return (
            <span key={s} className="flex items-center gap-2">
              <span
                className={`
                  inline-flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-bold border transition-all
                  ${done
                    ? "bg-[color:var(--color-deodar)] border-[color:var(--color-deodar)] text-[color:var(--color-paper)]"
                    : active
                    ? "border-[color:var(--color-terracotta)] text-[color:var(--color-terracotta)]"
                    : "border-[color:var(--color-rule)] text-[color:var(--color-ink-soft)] opacity-40"
                  }
                `}
              >
                {done ? "✓" : i + 1}
              </span>
              <span className={`text-[10px] uppercase tracking-[0.15em] ${active ? "text-[color:var(--color-ink)]" : "text-[color:var(--color-ink-soft)] opacity-40"}`}>
                {s === "dates" ? "Dates" : s === "info" ? "Guest" : "Confirm"}
              </span>
              {i < 2 && <span className="w-6 h-px bg-[color:var(--color-rule)]" />}
            </span>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {/* ── STEP 1: Choose dates ──────────────────────────────── */}
        {step === "dates" && (
          <motion.div key="dates" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            <h3 className="font-display text-2xl mb-1">Choose your nights</h3>
            <p className="text-[color:var(--color-ink-soft)] text-sm mb-6">
              {property.price_per_night > 0
                ? `₹${property.price_per_night.toLocaleString("en-IN")} / night · min. ${property.min_nights ?? 1} night${(property.min_nights ?? 1) > 1 ? "s" : ""}`
                : "Dates with a line through are already reserved."}
            </p>

            <AvailabilityCalendar
              blockedRanges={property.blocked_ranges}
              selected={range}
              onSelect={setRange}
              minNights={property.min_nights ?? 1}
            />

            {range?.from && range?.to && nights > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 p-4 bg-[color:var(--color-paper-deep)]/60 border border-[color:var(--color-rule)] rounded-sm"
              >
                <div className="flex justify-between text-sm">
                  <span className="text-[color:var(--color-ink-soft)]">
                    {formatDate(range.from)} → {formatDate(range.to)}
                  </span>
                  <span className="font-bold text-[color:var(--color-deodar)]">{nights} night{nights > 1 ? "s" : ""}</span>
                </div>
                {property.price_per_night > 0 && (
                  <div className="flex justify-between text-xs mt-1 text-[color:var(--color-ink-soft)]">
                    <span>Total stay</span>
                    <span>{formatINR(baseTotal)}</span>
                  </div>
                )}
                {nights < (property.min_nights ?? 1) && (
                  <p className="text-[color:var(--color-terracotta)] text-xs mt-2">
                    Minimum stay is {property.min_nights} nights.
                  </p>
                )}
              </motion.div>
            )}

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setStep("info")}
                disabled={!canProceedFromDates}
                className="flex items-center gap-2 px-5 py-2.5 bg-[color:var(--color-deodar)] text-[color:var(--color-paper)] text-sm uppercase tracking-[0.12em] rounded-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[color:var(--color-deodar-soft)] transition-colors"
              >
                Next — Guest details <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        )}

        {/* ── STEP 2: Guest info ────────────────────────────────── */}
        {step === "info" && (
          <motion.div key="info" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            <h3 className="font-display text-2xl mb-1">Guest details</h3>
            <p className="text-[color:var(--color-ink-soft)] text-sm mb-6">
              {range?.from && range?.to && `${formatDate(range.from)} – ${formatDate(range.to)} · ${nights} night${nights > 1 ? "s" : ""}`}
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-ink-soft)] mb-1.5">Full name *</label>
                <input
                  type="text"
                  value={guest.name}
                  onChange={e => setGuest(g => ({ ...g, name: e.target.value }))}
                  placeholder="Your name"
                  className="w-full bg-transparent border border-[color:var(--color-rule)] rounded-sm px-3 py-2 text-sm text-[color:var(--color-ink)] placeholder:text-[color:var(--color-ink-soft)]/40 focus:border-[color:var(--color-deodar)] outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-ink-soft)] mb-1.5">Phone</label>
                <input
                  type="tel"
                  value={guest.phone}
                  onChange={e => setGuest(g => ({ ...g, phone: e.target.value }))}
                  placeholder="+91 98765 43210"
                  className="w-full bg-transparent border border-[color:var(--color-rule)] rounded-sm px-3 py-2 text-sm text-[color:var(--color-ink)] placeholder:text-[color:var(--color-ink-soft)]/40 focus:border-[color:var(--color-deodar)] outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-ink-soft)] mb-1.5">Email</label>
                <input
                  type="email"
                  value={guest.email}
                  onChange={e => setGuest(g => ({ ...g, email: e.target.value }))}
                  placeholder="you@example.com"
                  className="w-full bg-transparent border border-[color:var(--color-rule)] rounded-sm px-3 py-2 text-sm text-[color:var(--color-ink)] placeholder:text-[color:var(--color-ink-soft)]/40 focus:border-[color:var(--color-deodar)] outline-none transition-colors"
                />
              </div>
              <p className="text-[10px] text-[color:var(--color-ink-soft)]/60">* Phone or email required for payment link delivery.</p>
            </div>

            <div className="flex justify-between mt-8">
              <button onClick={() => setStep("dates")} className="flex items-center gap-1.5 text-sm text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-ink)] transition-colors">
                <ArrowLeft size={14} /> Back
              </button>
              <button
                onClick={() => setStep("confirm")}
                disabled={!canProceedFromInfo}
                className="flex items-center gap-2 px-5 py-2.5 bg-[color:var(--color-deodar)] text-[color:var(--color-paper)] text-sm uppercase tracking-[0.12em] rounded-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[color:var(--color-deodar-soft)] transition-colors"
              >
                Review booking <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        )}

        {/* ── STEP 3: Confirm ───────────────────────────────────── */}
        {step === "confirm" && (
          <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            <h3 className="font-display text-2xl mb-6">Review your booking</h3>

            <div className="border border-[color:var(--color-rule)] rounded-sm divide-y divide-[color:var(--color-rule)]">
              <div className="flex items-start gap-3 p-4">
                <CalendarDays size={16} className="mt-0.5 text-[color:var(--color-deodar)] shrink-0" />
                <div>
                  <div className="text-[10px] uppercase tracking-[0.15em] text-[color:var(--color-ink-soft)] mb-0.5">Stay</div>
                  <div className="text-sm">{range?.from && formatDate(range.from)} → {range?.to && formatDate(range.to)}</div>
                  <div className="text-xs text-[color:var(--color-ink-soft)] mt-0.5">{nights} night{nights > 1 ? "s" : ""}</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4">
                <User size={16} className="mt-0.5 text-[color:var(--color-deodar)] shrink-0" />
                <div>
                  <div className="text-[10px] uppercase tracking-[0.15em] text-[color:var(--color-ink-soft)] mb-0.5">Guest</div>
                  <div className="text-sm">{guest.name}</div>
                  {guest.phone && <div className="text-xs text-[color:var(--color-ink-soft)]">{guest.phone}</div>}
                  {guest.email && <div className="text-xs text-[color:var(--color-ink-soft)]">{guest.email}</div>}
                </div>
              </div>

              {property.price_per_night > 0 && (
                <div className="flex items-start gap-3 p-4">
                  <CreditCard size={16} className="mt-0.5 text-[color:var(--color-deodar)] shrink-0" />
                  <div className="w-full">
                    <div className="text-[10px] uppercase tracking-[0.15em] text-[color:var(--color-ink-soft)] mb-2">Payment</div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[color:var(--color-ink-soft)]">{nights} × {formatINR(property.price_per_night)}</span>
                      <span>{formatINR(baseTotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1 font-bold text-[color:var(--color-terracotta)]">
                      <span>Advance now (50%)</span>
                      <span>{formatINR(advanceAmount)}</span>
                    </div>
                    <div className="flex justify-between text-xs mt-1 text-[color:var(--color-ink-soft)]">
                      <span>Balance at check-in</span>
                      <span>{formatINR(baseTotal - advanceAmount)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-4 p-3 bg-[color:var(--color-terracotta)]/10 border border-[color:var(--color-terracotta)]/30 rounded-sm text-sm text-[color:var(--color-terracotta)]">
                {error}
              </div>
            )}

            <div className="flex justify-between mt-6">
              <button onClick={() => setStep("info")} className="flex items-center gap-1.5 text-sm text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-ink)] transition-colors">
                <ArrowLeft size={14} /> Back
              </button>
              <button
                onClick={handleBook}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 bg-[color:var(--color-terracotta)] text-[color:var(--color-paper)] text-sm uppercase tracking-[0.12em] rounded-sm disabled:opacity-60 hover:bg-[color:var(--color-terracotta-soft)] transition-colors"
              >
                {loading ? <><Loader2 size={14} className="animate-spin" /> Processing…</> : <>Confirm &amp; Pay <CreditCard size={14} /></>}
              </button>
            </div>
          </motion.div>
        )}

        {/* ── STEP 4: Done — payment link ───────────────────────── */}
        {step === "done" && result && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.25 }}>
            <div className="flex flex-col items-center text-center py-4">
              <CheckCircle size={40} className="text-[color:var(--color-deodar)] mb-4" />
              <h3 className="font-display text-2xl mb-2">Booking confirmed</h3>
              <p className="text-[color:var(--color-ink-soft)] text-sm max-w-xs mb-6">
                Your stay at {result.property_name} is reserved. Complete the advance payment to lock in your dates.
              </p>

              <div className="w-full border border-[color:var(--color-rule)] rounded-sm p-4 mb-6 text-left space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[color:var(--color-ink-soft)]">Booking ref</span>
                  <span className="font-bold tracking-wider text-xs">{result.booking_id.slice(0, 8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[color:var(--color-ink-soft)]">Access code</span>
                  <span className="font-bold tracking-[0.25em]">{result.access_code}</span>
                </div>
                <div className="flex justify-between font-bold text-[color:var(--color-terracotta)]">
                  <span>Advance due</span>
                  <span>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(result.amount)}</span>
                </div>
              </div>

              <a
                href={result.payment_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[color:var(--color-terracotta)] text-[color:var(--color-paper)] text-sm uppercase tracking-[0.15em] rounded-sm hover:bg-[color:var(--color-terracotta-soft)] transition-colors"
              >
                Pay advance <ExternalLink size={14} />
              </a>

              <p className="text-[10px] text-[color:var(--color-ink-soft)]/60 mt-4">
                Note your access code — you'll need it to check in.
              </p>

              <button onClick={onClose} className="mt-4 text-xs text-[color:var(--color-ink-soft)] underline underline-offset-2 hover:text-[color:var(--color-ink)]">
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
