/*
 * Pure availability engine for the /booking grid. No React here — these are
 * date/time helpers, the demo court catalogue and the recurring block rules,
 * so they can be unit-tested and eventually fed from the database.
 */

export interface Court {
  id: string;
  name: string;
  type: string;
  pricePerHour: number;
}

/* Demo catalogue — replace with a Supabase query when bookings go live. */
export const COURTS: Court[] = [
  { id: "in1", name: "Indoor Court 1", type: "7-a-side", pricePerHour: 240 },
  { id: "in2", name: "Indoor Court 2", type: "5-a-side", pricePerHour: 120 },
  { id: "out1", name: "Outdoor Court 1", type: "5-a-side", pricePerHour: 110 },
];

export const START_MINUTES = 7 * 60; // 7:00am
export const END_MINUTES = 23 * 60; // 11:00pm
export const INTERVAL = 30; // half-hour blocks

export interface BlockedSlot {
  courtId: string;
  start: number;
  end: number;
  label: string;
}

export interface CourtSelection {
  anchor: number;
  target: number;
}

export interface SelectedSlot {
  court: Court;
  label: string;
  start: number;
  end: number;
}

export interface BookingLine {
  court: Court;
  start: number;
  end: number;
}

export type SlotBlockPredicate = (
  courtId: string,
  start: number,
  end: number,
) => boolean;

export function minutesToLabel(totalMinutes: number): string {
  const hr = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  const period = hr >= 12 ? "pm" : "am";
  const display = hr % 12 === 0 ? 12 : hr % 12;
  return `${display}:${m === 0 ? "00" : "30"}${period}`;
}

export function dateKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export function addDays(date: Date, amount: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function getDay(date: Date): number {
  return date.getDay(); // 0 Sun, 1 Mon, 2 Tue, 3 Wed, 4 Thu, 5 Fri, 6 Sat
}

/*
 * Recurring blocks for the demo. Saturday coaching, weekday after-school
 * coaching, Monday/Tuesday league play and the 2026 ESL tournament runs.
 */
export function getBlockedSlots(date: Date): BlockedSlot[] {
  const blocked: BlockedSlot[] = [];
  const day = getDay(date);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const d = date.getDate();

  if (day === 6) {
    blocked.push({ courtId: "in1", start: 8 * 60, end: 13 * 60 + 30, label: "Coaching" });
    blocked.push({ courtId: "in2", start: 9 * 60, end: 12 * 60, label: "Coaching" });
    blocked.push({ courtId: "out1", start: 9 * 60, end: 12 * 60, label: "Coaching" });
  }

  if (day >= 1 && day <= 5) {
    blocked.push({ courtId: "in1", start: 15 * 60 + 30, end: 19 * 60, label: "Coaching" });
    blocked.push({ courtId: "in2", start: 15 * 60 + 30, end: 19 * 60, label: "Coaching" });
    blocked.push({ courtId: "out1", start: 15 * 60 + 30, end: 19 * 60, label: "Coaching" });
  }

  if (day === 1 || day === 2) {
    blocked.push({ courtId: "in1", start: 19 * 60, end: 23 * 60 + 30, label: "League Play" });
    blocked.push({ courtId: "in2", start: 19 * 60, end: 23 * 60 + 30, label: "League Play" });
    blocked.push({ courtId: "out1", start: 19 * 60, end: 23 * 60 + 30, label: "League Play" });
  }

  if (day === 0 && year === 2026) {
    const isInRange = (month === 11 && d >= 1) || (month === 12 && d >= 1 && d <= 13);
    if (isInRange) {
      blocked.push({ courtId: "in1", start: 8 * 60, end: 13 * 60, label: "ESL Tournament" });
      blocked.push({ courtId: "in2", start: 8 * 60, end: 13 * 60, label: "ESL Tournament" });
      blocked.push({ courtId: "out1", start: 8 * 60, end: 13 * 60, label: "ESL Tournament" });
    }
  }

  return blocked;
}

export function isSlotBlocked(
  blocked: BlockedSlot[],
  courtId: string,
  start: number,
  end: number,
): boolean {
  return blocked.some((b) => b.courtId === courtId && !(end <= b.start || start >= b.end));
}

export function getBlockLabel(
  blocked: BlockedSlot[],
  courtId: string,
  start: number,
  end: number,
): string | undefined {
  return blocked.find((b) => b.courtId === courtId && !(end <= b.start || start >= b.end))?.label;
}

/*
 * Grow a tap selection into a continuous span, stopping at the first blocked
 * slot on either side so a range can never bridge a booking.
 */
export function extendRange(
  courtId: string,
  anchor: number,
  slotStart: number,
  slotEnd: number,
  isBlocked: SlotBlockPredicate,
): { start: number; end: number } {
  const rawStart = Math.min(anchor, slotStart);
  const rawEnd = Math.max(anchor + INTERVAL, slotEnd);

  let end = anchor + INTERVAL;
  for (let m = end; m < rawEnd; m += INTERVAL) {
    if (isBlocked(courtId, m, m + INTERVAL)) break;
    end = m + INTERVAL;
  }
  let start = anchor;
  for (let m = anchor - INTERVAL; m >= rawStart; m -= INTERVAL) {
    if (isBlocked(courtId, m, m + INTERVAL)) break;
    start = m;
  }

  return { start, end };
}

/* Flatten every court's selection into sorted half-hour slots. */
export function buildSelectedSlots(
  ranges: Record<string, CourtSelection>,
  isBlocked: SlotBlockPredicate,
): SelectedSlot[] {
  const slots: SelectedSlot[] = [];

  for (const [courtId, selection] of Object.entries(ranges)) {
    const court = COURTS.find((c) => c.id === courtId);
    if (!court) continue;

    const span = extendRange(
      courtId,
      selection.anchor,
      selection.target,
      selection.target + INTERVAL,
      isBlocked,
    );

    for (let m = span.start; m < span.end; m += INTERVAL) {
      slots.push({
        court,
        label: `${minutesToLabel(m)}-${minutesToLabel(m + INTERVAL)}`,
        start: m,
        end: m + INTERVAL,
      });
    }
  }

  return slots.sort((a, b) => a.label.localeCompare(b.label));
}

/* Merge adjacent half-hour slots per court into billing lines. */
export function buildBookings(slots: SelectedSlot[]): BookingLine[] {
  const byCourt = new Map<string, { start: number; end: number }[]>();

  slots.forEach((slot) => {
    const ranges = byCourt.get(slot.court.id) ?? [];
    ranges.push({ start: slot.start, end: slot.end });
    byCourt.set(slot.court.id, ranges);
  });

  const result: BookingLine[] = [];

  byCourt.forEach((ranges, id) => {
    const court = COURTS.find((item) => item.id === id);
    if (!court) return;

    ranges.sort((a, b) => a.start - b.start);

    const merged: { start: number; end: number }[] = [];
    ranges.forEach((range) => {
      const current = merged[merged.length - 1];
      if (current && range.start === current.end) {
        current.end = range.end;
      } else {
        merged.push({ ...range });
      }
    });

    merged.forEach((range) => result.push({ court, ...range }));
  });

  return result;
}

/* Price in dollars for a set of half-hour slots. */
export function computeTotal(slots: SelectedSlot[]): number {
  const totals = slots.reduce<Record<string, number>>((acc, slot) => {
    acc[slot.court.id] = (acc[slot.court.id] || 0) + 0.5;
    return acc;
  }, {});

  return Object.entries(totals).reduce((sum, [id, hours]) => {
    const court = COURTS.find((c) => c.id === id);
    return sum + (court?.pricePerHour ?? 0) * hours;
  }, 0);
}
