import { minutesToLabel } from "./time";
import type { Court, CourtSelection, SelectedSlot, SlotBlockPredicate } from "./types";

export const INTERVAL = 30;

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

export function buildSelectedSlots(
  ranges: Record<string, CourtSelection>,
  isBlocked: SlotBlockPredicate,
  courts: Court[],
): SelectedSlot[] {
  const slots: SelectedSlot[] = [];

  for (const [courtId, selection] of Object.entries(ranges)) {
    const court = courts.find((c) => c.id === courtId);
    if (!court) continue;

    const span = extendRange(courtId, selection.anchor, selection.target, selection.target + INTERVAL, isBlocked);

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

export function buildBookings(slots: SelectedSlot[]) {
  const byCourt = new Map<string, { start: number; end: number }[]>();

  slots.forEach((slot) => {
    const rangesArr = byCourt.get(slot.court.id) ?? [];
    rangesArr.push({ start: slot.start, end: slot.end });
    byCourt.set(slot.court.id, rangesArr);
  });

  const result: Array<{ court: Court; start: number; end: number }> = [];

  byCourt.forEach((rangesArr, id) => {
    const court = slots.find((s) => s.court.id === id)?.court;
    if (!court) return;

    rangesArr.sort((a, b) => a.start - b.start);

    const merged: { start: number; end: number }[] = [];
    rangesArr.forEach((range) => {
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
