// BookingSection — "Book Your Stay" with room picker → calendar → booking flow

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Loader2, AlertCircle, ArrowLeft, Users, BedDouble } from "lucide-react";
import BookingFlow from "@/components/BookingFlow";
import { fetchPropertyInfo, type PropertyInfo } from "@/lib/qord";
import { BHETA_ROOMS, type Room } from "@/lib/rooms";

type DialogStep = "rooms" | "calendar";

export default function BookingSection() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<DialogStep>("rooms");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [property, setProperty] = useState<PropertyInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  function handleClose() {
    setOpen(false);
    // Reset after dialog close animation
    setTimeout(() => {
      setStep("rooms");
      setSelectedRoom(null);
      setProperty(null);
      setFetchError(null);
    }, 300);
  }

  function handleRoomSelect(room: Room) {
    setSelectedRoom(room);
    setStep("calendar");
    setProperty(null);
    setFetchError(null);
    setLoading(true);
    fetchPropertyInfo(room.token)
      .then(setProperty)
      .catch(e => setFetchError(e.message ?? "Could not load availability"))
      .finally(() => setLoading(false));
  }

  function handleBack() {
    setStep("rooms");
    setSelectedRoom(null);
    setProperty(null);
    setFetchError(null);
  }

  return (
    <section id="book" className="border-t border-[color:var(--color-rule)]/60 bg-[#efe3c8]/30">
      <div className="container py-16">
        <div className="grid md:grid-cols-12 gap-8 items-center">

          {/* Left copy */}
          <div className="md:col-span-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-terracotta)] mb-3">
              Plate IV · Reservations
            </div>
            <h2 className="font-display text-4xl md:text-5xl leading-tight mb-4">
              Reserve your nights in the hills.
            </h2>
            <p className="text-[color:var(--color-ink-soft)] max-w-md leading-relaxed mb-6">
              Live availability, direct booking, no third-party commissions.
              Pay the advance online — the balance at check-in.
              Your access code arrives with confirmation.
            </p>
            <div className="flex flex-wrap gap-4 text-[11px] font-mono uppercase tracking-[0.15em] text-[color:var(--color-ink-soft)] mb-8">
              {["Live calendar", "Instant confirmation", "Secure payment"].map(t => (
                <span key={t} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-deodar)]" />
                  {t}
                </span>
              ))}
            </div>

            <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); else setOpen(true); }}>
              <DialogTrigger asChild>
                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ y: 0 }}
                  className="flex items-center gap-2.5 px-7 py-3.5 bg-[color:var(--color-deodar)] text-[color:var(--color-paper)] font-mono text-sm uppercase tracking-[0.15em] rounded-sm shadow-md hover:bg-[color:var(--color-deodar-soft)] transition-colors"
                >
                  <CalendarDays size={16} />
                  Check availability &amp; book
                </motion.button>
              </DialogTrigger>

              <DialogContent
                showCloseButton
                className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-sm p-0 border-[color:var(--color-rule)]"
                style={{ background: "var(--color-paper)" }}
              >
                {/* Header */}
                <div className="flex items-center gap-3 p-6 border-b border-[color:var(--color-rule)]/60">
                  {step === "calendar" && (
                    <button
                      onClick={handleBack}
                      className="p-1 text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-ink)] transition-colors shrink-0"
                    >
                      <ArrowLeft size={16} />
                    </button>
                  )}
                  <div>
                    <DialogTitle className="font-display text-2xl text-[color:var(--color-ink)]">
                      {step === "rooms" ? "Choose your room" : selectedRoom?.name ?? ""}
                    </DialogTitle>
                    <DialogDescription className="text-[color:var(--color-ink-soft)] text-sm mt-0.5 font-mono">
                      {step === "rooms"
                        ? "Trails of Bheta · Kumaon Hills · Direct reservation"
                        : selectedRoom?.tagline ?? ""}
                    </DialogDescription>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6">
                  <AnimatePresence mode="wait">

                    {/* ── Step 0: Room picker ── */}
                    {step === "rooms" && (
                      <motion.div
                        key="rooms"
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -16 }}
                        transition={{ duration: 0.18 }}
                        className="grid sm:grid-cols-2 gap-3"
                      >
                        {BHETA_ROOMS.map((room) => (
                          <button
                            key={room.id}
                            onClick={() => handleRoomSelect(room)}
                            className="group text-left border border-[color:var(--color-rule)] rounded-sm p-4 hover:border-[color:var(--color-deodar)] hover:bg-[color:var(--color-deodar)]/5 transition-all"
                          >
                            <div className="font-display text-lg leading-tight mb-1 group-hover:text-[color:var(--color-deodar)] transition-colors">
                              {room.name}
                            </div>
                            <div className="text-[color:var(--color-ink-soft)] text-xs mb-3 leading-snug">
                              {room.tagline}
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 text-[10px] font-mono text-[color:var(--color-ink-soft)] uppercase tracking-[0.12em]">
                                <span className="flex items-center gap-1">
                                  <BedDouble size={11} /> {room.beds}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users size={11} /> {room.max_guests}
                                </span>
                              </div>
                              <span className="font-mono text-sm font-bold text-[color:var(--color-deodar)]">
                                ₹{room.price_per_night.toLocaleString("en-IN")}
                                <span className="text-[10px] font-normal text-[color:var(--color-ink-soft)]">/night</span>
                              </span>
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}

                    {/* ── Step 1+: Calendar + booking flow ── */}
                    {step === "calendar" && (
                      <motion.div
                        key="calendar"
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 16 }}
                        transition={{ duration: 0.18 }}
                      >
                        {loading && (
                          <div className="flex flex-col items-center justify-center py-16 gap-3">
                            <Loader2 size={24} className="animate-spin text-[color:var(--color-deodar)]" />
                            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--color-ink-soft)]">
                              Loading calendar…
                            </span>
                          </div>
                        )}

                        {fetchError && (
                          <div className="flex flex-col items-center justify-center py-16 gap-3">
                            <AlertCircle size={24} className="text-[color:var(--color-terracotta)]" />
                            <p className="font-mono text-sm text-[color:var(--color-ink-soft)]">{fetchError}</p>
                            <button
                              onClick={() => selectedRoom && handleRoomSelect(selectedRoom)}
                              className="text-xs underline underline-offset-2 text-[color:var(--color-deodar)]"
                            >
                              Try again
                            </button>
                          </div>
                        )}

                        {property && !loading && selectedRoom && (
                          <BookingFlow
                            property={property}
                            token={selectedRoom.token}
                            onClose={handleClose}
                          />
                        )}
                      </motion.div>
                    )}

                  </AnimatePresence>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Right — decorative badge */}
          <div className="md:col-span-6 flex justify-center md:justify-end">
            <div className="relative w-64 h-64 select-none">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-[color:var(--color-rule)] animate-[spin_60s_linear_infinite]" />
              <div className="absolute inset-6 rounded-full border border-[color:var(--color-rule)] flex flex-col items-center justify-center text-center bg-[color:var(--color-paper-deep)]/40">
                <CalendarDays size={22} className="text-[color:var(--color-deodar)] mb-2" />
                <span className="font-display text-lg leading-tight">Book<br />Direct</span>
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[color:var(--color-terracotta)] mt-2">No OTA fees</span>
              </div>
              {["Jan–Mar", "Apr–Jun", "Jul–Sep", "Oct–Dec"].map((label, i) => {
                const rad = ([0, 90, 180, 270][i] - 90) * (Math.PI / 180);
                const x = 128 + 122 * Math.cos(rad);
                const y = 128 + 122 * Math.sin(rad);
                return (
                  <span key={label} className="absolute font-mono text-[8px] uppercase tracking-[0.12em] text-[color:var(--color-ink-soft)] opacity-60" style={{ left: x, top: y, transform: "translate(-50%,-50%)" }}>
                    {label}
                  </span>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
