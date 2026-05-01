// Home page — "Reach Trails of Bheta"
// Style reminder: Himalayan Cartography. Aged paper, deodar green ink,
// terracotta accent, serif display + mono numerics. Map is the hero.
// No purple gradients, no rounded-2xl Inter blandness.

import { useEffect, useMemo, useRef, useState } from "react";
import UnfoldingMap from "@/components/UnfoldingMap";
import PropertyGallery from "@/components/PropertyGallery";
import { BHETA, DESTINATIONS, type Destination, type Mode } from "@/lib/destinations";
import { Car, TrainFront, Plane, MapPin, Compass, Phone, Mail } from "lucide-react";

const SEAL_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663529091986/Scs4Vu8VvmjxVNgSRkX7yS/bheta-seal-Ckt69jQrVyv3TCjVLmcBoP.webp";

const MODE_META: Record<Mode, { label: string; Icon: typeof Car; color: string }> = {
  road: { label: "By road", Icon: Car, color: "var(--color-deodar)" },
  rail: { label: "By rail", Icon: TrainFront, color: "var(--color-indigo-faded)" },
  air:  { label: "By air",  Icon: Plane, color: "var(--color-terracotta)" },
};

function formatGoogleMapsUrl(d: Destination) {
  const q = encodeURIComponent(`${d.name}, Uttarakhand`);
  const dest = encodeURIComponent(`${BHETA.lat},${BHETA.lng}`);
  return `https://www.google.com/maps/dir/?api=1&origin=${q}&destination=${dest}&travelmode=driving`;
}

export default function Home() {
  const [active, setActive] = useState<string | null>("kausani");
  const [filter, setFilter] = useState<Mode | "all">("all");
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const visible = useMemo(
    () => DESTINATIONS.filter((d) => filter === "all" || d.mode === filter),
    [filter]
  );

  const activeDest = useMemo(
    () => DESTINATIONS.find((d) => d.id === active) ?? DESTINATIONS[0],
    [active]
  );

  // When user picks via map, scroll the corresponding card into view.
  useEffect(() => {
    if (!active) return;
    const el = cardRefs.current[active];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [active]);

  return (
    <div className="min-h-screen flex flex-col text-[color:var(--color-ink)]">
      {/* ─────── Header ─────── */}
      <header className="border-b border-[color:var(--color-rule)]/60 bg-[#f4ebd9]/60 backdrop-blur-sm sticky top-0 z-30">
        <div className="container py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={SEAL_URL} alt="Trails of Bheta seal" className="h-12 w-12" />
            <div>
              <div className="font-display text-xl leading-none tracking-tight">
                Trails of Bheta
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-ink-soft)] mt-1">
                Kumaon · Uttarakhand · Est. in the Himalayas
              </div>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
            <a href="#map" className="hover:text-[color:var(--color-deodar)] transition-colors">The Map</a>
            <a href="#logbook" className="hover:text-[color:var(--color-deodar)] transition-colors">Logbook</a>
            <a href="#planner" className="hover:text-[color:var(--color-deodar)] transition-colors">Planner</a>
            <a href="#reach" className="hover:text-[color:var(--color-deodar)] transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      {/* ─────── Hero ─────── */}
      <section className="relative">
        <div className="container pt-12 md:pt-20 pb-8">
          <div className="grid md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-8">
              <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-[color:var(--color-terracotta)] mb-4 flex items-center gap-3">
                <span className="inline-block w-8 h-px bg-[color:var(--color-terracotta)]" />
                A Cartographer's Guide
              </div>
              <h1 className="font-display text-[44px] md:text-[78px] leading-[0.95] tracking-tight">
                Finding your way to <em className="not-italic text-[color:var(--color-deodar)]">Bheta</em>.
              </h1>
              <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-[color:var(--color-ink-soft)]">
                Tucked into a quiet fold of the Kumaon hills, eleven kilometres from Kausani,
                Trails of Bheta is well connected to every major hill station and railhead in
                Uttarakhand. Trace a route on the map below, or thumb through the logbook —
                the journey is part of the stay.
              </p>
            </div>
            <div className="md:col-span-4">
              <div className="paper-card rounded-md p-5 font-mono text-[12px] leading-relaxed">
                <div className="flex items-start gap-2 mb-3">
                  <Compass className="w-4 h-4 mt-0.5 text-[color:var(--color-deodar)]" />
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-ink-soft)]">Coordinates</div>
                    <div className="text-[13px] text-[color:var(--color-ink)]">29.85° N · 79.60° E</div>
                  </div>
                </div>
                <div className="flex items-start gap-2 mb-3">
                  <MapPin className="w-4 h-4 mt-0.5 text-[color:var(--color-terracotta)]" />
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-ink-soft)]">Elevation</div>
                    <div className="text-[13px]">~1,890 m above sea level</div>
                  </div>
                </div>
                <div className="rule-dotted h-[2px] my-4 text-[color:var(--color-rule)]" />
                <div className="text-[11px] text-[color:var(--color-ink-soft)] italic">
                  "Eleven kilometres from Kausani, a thousand miles from anywhere loud."
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─────── Map + Logbook ─────── */}
      <section id="map" className="container pb-16 md:pb-24">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Map */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-4 px-1">
              <FilterChips value={filter} onChange={setFilter} />
            </div>
            <UnfoldingMap active={active} onSelect={setActive} modeFilter={filter} />
          </div>

          {/* Logbook */}
          <div id="logbook" className="lg:col-span-4">
            <div className="flex items-baseline justify-between mb-3">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[color:var(--color-ink-soft)]">
                  Plate II
                </div>
                <h2 className="font-display text-2xl">The Logbook</h2>
              </div>
              <div className="font-mono text-[10px] text-[color:var(--color-ink-soft)]">
                {visible.length} entries
              </div>
            </div>

            <div className="paper-card rounded-md p-2 max-h-[640px] overflow-y-auto pr-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[color:var(--color-rule)] [&::-webkit-scrollbar-thumb]:rounded">
              {visible.map((d, i) => (
                <DestinationCard
                  key={d.id}
                  destination={d}
                  index={i + 1}
                  active={active === d.id}
                  onClick={() => setActive(d.id)}
                  refSetter={(el) => (cardRefs.current[d.id] = el)}
                />
              ))}
              {visible.length === 0 && (
                <div className="p-8 text-center font-mono text-xs text-[color:var(--color-ink-soft)]">
                  No entries match this filter.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─────── Gallery ─────── */}
      <section id="gallery" className="border-t border-[color:var(--color-rule)]/60">
        <PropertyGallery />
      </section>

      {/* ─────── Active travel ticket ─────── */}
      <section id="planner" className="container pb-20">
        <div className="grid md:grid-cols-12 gap-8 items-stretch">
          <div className="md:col-span-7">
            <TravelTicket destination={activeDest} />
          </div>
          <div className="md:col-span-5">
            <ReachRingsLegend onPick={(km) => {
              // Highlight the destination just inside this ring
              const candidate = [...DESTINATIONS]
                .filter((d) => d.km <= km)
                .sort((a, b) => b.km - a.km)[0];
              if (candidate) setActive(candidate.id);
            }} />
          </div>
        </div>
      </section>

      {/* ─────── Reach us ─────── */}
      <section id="reach" className="border-t border-[color:var(--color-rule)]/60 bg-[#efe3c8]/40">
        <div className="container py-14 grid md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-terracotta)] mb-3">
              Plate III · Arrival
            </div>
            <h2 className="font-display text-3xl md:text-5xl leading-tight">
              Write to us before you set out.
            </h2>
            <p className="mt-4 text-[color:var(--color-ink-soft)] max-w-md">
              Tell us which hub you'll arrive at and we'll arrange a private cab,
              share the latest road conditions, and have a thermos of Kumaoni
              chai waiting at your door.
            </p>
          </div>
          <div className="md:col-span-7 grid sm:grid-cols-2 gap-4">
            <ContactCard
              Icon={Phone}
              label="Reception"
              value="+91 98XXX XXXXX"
              href="tel:+9198000000000"
            />
            <ContactCard
              Icon={Mail}
              label="Reservations"
              value="stay@trailsofbheta.in"
              href="mailto:stay@trailsofbheta.in"
            />
            <ContactCard
              Icon={MapPin}
              label="Address"
              value="Bheta Village, Kausani, Bageshwar 263639, Uttarakhand"
              href={`https://www.google.com/maps/search/?api=1&query=${BHETA.lat},${BHETA.lng}`}
            />
            <ContactCard
              Icon={Compass}
              label="Coordinates"
              value="29.85° N · 79.60° E"
              href={`https://www.google.com/maps/search/?api=1&query=${BHETA.lat},${BHETA.lng}`}
            />
          </div>
        </div>
        <div className="container pb-10">
          <div className="rule-dotted h-[2px] text-[color:var(--color-rule)] mb-5" />
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[color:var(--color-ink-soft)]">
            <div>© Trails of Bheta — Kumaon, Uttarakhand</div>
            <div>Drawn by hand · Set in Fraunces &amp; JetBrains Mono</div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─────────────────────── Subcomponents ─────────────────────── */

function FilterChips({
  value, onChange,
}: { value: Mode | "all"; onChange: (v: Mode | "all") => void }) {
  const items: Array<{ k: Mode | "all"; label: string; Icon?: typeof Car }> = [
    { k: "all", label: "All" },
    { k: "road", label: "Road", Icon: Car },
    { k: "rail", label: "Rail", Icon: TrainFront },
    { k: "air",  label: "Air",  Icon: Plane },
  ];
  return (
    <div className="inline-flex p-1 rounded-full border border-[color:var(--color-rule)] bg-[#fbf3df]/70">
      {items.map(({ k, label, Icon }) => {
        const sel = value === k;
        return (
          <button
            key={k}
            onClick={() => onChange(k)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-[0.18em] flex items-center gap-1.5 transition-colors ${
              sel
                ? "bg-[color:var(--color-deodar)] text-[color:var(--color-paper)]"
                : "text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-ink)]"
            }`}
          >
            {Icon && <Icon className="w-3 h-3" />}
            {label}
          </button>
        );
      })}
    </div>
  );
}

function DestinationCard({
  destination, active, index, onClick, refSetter,
}: {
  destination: Destination;
  active: boolean;
  index: number;
  onClick: () => void;
  refSetter: (el: HTMLDivElement | null) => void;
}) {
  const meta = MODE_META[destination.mode];
  const Icon = meta.Icon;
  return (
    <div
      ref={refSetter}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick()}
      className={`group relative px-4 py-4 cursor-pointer transition-colors border-b border-dashed border-[color:var(--color-rule)]/70 last:border-b-0 ${
        active ? "bg-[#fbf3df]" : "hover:bg-[#fbf3df]/60"
      }`}
    >
      {active && (
        <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-[color:var(--color-terracotta)]" />
      )}
      <div className="flex items-baseline justify-between gap-3">
        <div className="flex items-baseline gap-3 min-w-0">
          <span className="font-mono text-[10px] text-[color:var(--color-ink-soft)] tabular-nums">
            {String(index).padStart(2, "0")}
          </span>
          <div className="min-w-0">
            <div className="font-display text-lg leading-tight truncate">
              {destination.name}
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)] mt-0.5">
              {destination.region}
            </div>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="font-mono text-[18px] tabular-nums leading-none" style={{ color: meta.color }}>
            {destination.km}
            <span className="text-[10px] ml-0.5 opacity-70">km</span>
          </div>
          <div className="font-mono text-[10px] text-[color:var(--color-ink-soft)] mt-1">
            {destination.hoursLabel}
          </div>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2 text-[11px] text-[color:var(--color-ink-soft)]">
        <Icon className="w-3 h-3" style={{ color: meta.color }} />
        <span className="font-mono uppercase tracking-[0.15em] text-[10px]">{meta.label}</span>
      </div>
    </div>
  );
}

function TravelTicket({ destination }: { destination: Destination }) {
  const meta = MODE_META[destination.mode];
  const Icon = meta.Icon;
  // simple ETA bar
  const maxHours = 10;
  const pct = Math.min(100, (destination.hours / maxHours) * 100);

  return (
    <div className="paper-card rounded-md p-6 md:p-8 relative overflow-hidden">
      {/* perforated edge */}
      <div className="absolute left-0 top-0 bottom-0 w-3 flex flex-col justify-around">
        {Array.from({ length: 14 }).map((_, i) => (
          <span key={i} className="w-2 h-2 rounded-full bg-[#f4ebd9]" />
        ))}
      </div>

      <div className="pl-4 grid md:grid-cols-12 gap-6 items-start">
        <div className="md:col-span-7">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-terracotta)] mb-2">
            Travel Ticket · One Way
          </div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-display text-3xl md:text-4xl leading-tight">
              {destination.name}
            </h3>
            <span
              className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-mono uppercase tracking-[0.18em]"
              style={{ background: `${meta.color}1a`, color: meta.color }}
            >
              <Icon className="w-3 h-3" />
              {meta.label}
            </span>
          </div>
          <div className="font-mono text-[11px] text-[color:var(--color-ink-soft)] mb-5">
            {destination.region} · {destination.lat.toFixed(3)}° N · {destination.lng.toFixed(3)}° E
          </div>
          <p className="text-[color:var(--color-ink-soft)] leading-relaxed">
            {destination.note}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={formatGoogleMapsUrl(destination)}
              target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[color:var(--color-deodar)] text-[color:var(--color-paper)] px-4 py-2.5 rounded-sm font-mono text-[11px] uppercase tracking-[0.18em] hover:bg-[color:var(--color-deodar-soft)] transition-colors"
            >
              <MapPin className="w-3.5 h-3.5" />
              Open route in Maps
            </a>
            <a
              href="#reach"
              className="inline-flex items-center gap-2 border border-[color:var(--color-ink)]/60 text-[color:var(--color-ink)] px-4 py-2.5 rounded-sm font-mono text-[11px] uppercase tracking-[0.18em] hover:bg-[color:var(--color-ink)] hover:text-[color:var(--color-paper)] transition-colors"
            >
              Arrange a cab
            </a>
          </div>
        </div>

        <div className="md:col-span-5">
          <div className="border border-dashed border-[color:var(--color-rule)] rounded-sm p-4">
            <div className="flex items-baseline justify-between mb-1">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-ink-soft)]">
                Distance
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-ink-soft)]">
                Drive time
              </div>
            </div>
            <div className="flex items-baseline justify-between mb-4">
              <div className="font-display text-3xl tabular-nums">
                {destination.km}<span className="text-base ml-1 text-[color:var(--color-ink-soft)]">km</span>
              </div>
              <div className="font-display text-3xl tabular-nums">
                {destination.hoursLabel}
              </div>
            </div>

            <div className="h-2 rounded-full bg-[color:var(--color-paper-deep)] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${pct}%`, background: meta.color }}
              />
            </div>
            <div className="flex justify-between mt-1 font-mono text-[9px] text-[color:var(--color-ink-soft)] tabular-nums">
              <span>0 hr</span>
              <span>{maxHours} hrs</span>
            </div>

            <div className="rule-dotted h-[2px] my-5 text-[color:var(--color-rule)]" />

            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div>
                <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-[color:var(--color-ink-soft)]">From</div>
                <div className="font-display text-base">{destination.name}</div>
              </div>
              <div>
                <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-[color:var(--color-ink-soft)]">To</div>
                <div className="font-display text-base">Bheta</div>
              </div>
              <div className="col-span-2">
                <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-[color:var(--color-ink-soft)]">Stamp</div>
                <div className="font-mono text-[10px]">No. {destination.id.toUpperCase()}-{destination.km}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReachRingsLegend({ onPick }: { onPick: (km: number) => void }) {
  const rings = [
    { km: 50,  label: "Within an hour", desc: "Kausani & nearby villages." },
    { km: 100, label: "Half-day reach", desc: "Almora, Ranikhet — easy day trips." },
    { km: 150, label: "Same-day arrival", desc: "Kainchi Dham, Nainital, Kathgodam railhead." },
    { km: 200, label: "Comfortable transit", desc: "Pantnagar airport, Jim Corbett." },
    { km: 300, label: "The long road in", desc: "Rishikesh, Lansdowne, Dehradun." },
  ];
  return (
    <div className="paper-card rounded-md p-6 h-full">
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-terracotta)] mb-2">
        Reach Rings
      </div>
      <h3 className="font-display text-2xl mb-4">How far is far?</h3>
      <p className="text-sm text-[color:var(--color-ink-soft)] mb-5">
        Each ring on the map is a circle of constant distance from Bheta. Pick one to see what falls within.
      </p>
      <ul className="space-y-3">
        {rings.map((r) => (
          <li key={r.km}>
            <button
              onClick={() => onPick(r.km)}
              className="w-full text-left flex items-center gap-4 group"
            >
              <span
                className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-dashed border-[color:var(--color-deodar)]/60 font-mono text-[11px] tabular-nums text-[color:var(--color-deodar)] group-hover:bg-[color:var(--color-deodar)] group-hover:text-[color:var(--color-paper)] transition-colors"
              >
                {r.km}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block font-display text-base leading-tight">{r.label}</span>
                <span className="block font-mono text-[11px] text-[color:var(--color-ink-soft)] truncate">{r.desc}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContactCard({
  Icon, label, value, href,
}: { Icon: typeof Phone; label: string; value: string; href: string }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      className="paper-card rounded-md p-5 block hover:translate-y-[-2px] transition-transform"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-[color:var(--color-deodar)]/10 text-[color:var(--color-deodar)] flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-ink-soft)]">
            {label}
          </div>
          <div className="font-display text-base mt-1 break-words">{value}</div>
        </div>
      </div>
    </a>
  );
}
