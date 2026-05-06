// Qord public API client — reads availability & creates bookings via Curling Property Sync

const QORD_BASE = import.meta.env.VITE_QORD_API_BASE ?? "https://curling-booking.vercel.app";

export interface BlockedRange {
  check_in: string;  // ISO
  check_out: string; // ISO
}

export interface PropertyInfo {
  id: string;
  name: string;
  price_per_night: number;
  min_nights: number;
  max_guests: number | null;
  timezone: string;
  blocked_ranges: BlockedRange[];
}

export interface BookingResult {
  booking_id: string;
  access_code: string;
  payment_url: string;
  amount: number;          // advance amount (INR)
  base_amount: number;
  balance_due: number;
  nights: number;
  property_name: string;
}

export async function fetchPropertyInfo(token: string): Promise<PropertyInfo> {
  const res = await fetch(`${QORD_BASE}/api/public/property/${token}`);
  if (!res.ok) throw new Error(`Failed to load availability (${res.status})`);
  return res.json();
}

export async function createBooking(params: {
  property_token: string;
  check_in: string;   // YYYY-MM-DD
  check_out: string;  // YYYY-MM-DD
  guest_name: string;
  guest_phone?: string;
  guest_email?: string;
  advance_percentage?: number;
}): Promise<BookingResult> {
  const res = await fetch(`${QORD_BASE}/api/public/bookings/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error ?? `Booking failed (${res.status})`);
  }
  return res.json();
}

/** Given blocked ranges from the API, return a Set of YYYY-MM-DD date strings that are unavailable */
export function buildBlockedDateSet(ranges: BlockedRange[]): Set<string> {
  const blocked = new Set<string>();
  for (const r of ranges) {
    const start = new Date(r.check_in);
    const end = new Date(r.check_out);
    // iterate day by day inclusive
    const cur = new Date(start);
    while (cur < end) {
      blocked.add(toYMD(cur));
      cur.setUTCDate(cur.getUTCDate() + 1);
    }
  }
  return blocked;
}

export function toYMD(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function nightsBetween(from: Date, to: Date): number {
  return Math.round((to.getTime() - from.getTime()) / 86_400_000);
}
