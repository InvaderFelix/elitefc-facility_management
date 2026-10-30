import type { Court, SelectedSlot } from "./types";

export function computeTotal(slots: SelectedSlot[], courts?: Court[]): number {
  const totals = slots.reduce<Record<string, number>>((acc, slot) => {
    acc[slot.court.id] = (acc[slot.court.id] || 0) + 0.5;
    return acc;
  }, {});

  return Object.entries(totals).reduce((sum, [id, hours]) => {
    const court = courts?.find((c) => c.id === id) ?? slots.find((s) => s.court.id === id)?.court;
    return sum + (court?.pricePerHour ?? 0) * hours;
  }, 0);
}
