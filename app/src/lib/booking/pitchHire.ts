import { getDay } from "./time";
import type { BlockedSlot, Court } from "./types";

export const PITCH_HIRE_COURTS: Court[] = [
  { id: "in1", name: "Indoor Pitch 1", type: "7-a-side", pricePerHour: 240 },
  { id: "in2", name: "Indoor Pitch 2", type: "5-a-side", pricePerHour: 120 },
  { id: "out1", name: "Outdoor Pitch 1", type: "5-a-side", pricePerHour: 110 },
];

export const PITCH_HIRE_START_MINUTES = 7 * 60;
export const PITCH_HIRE_END_MINUTES = 23 * 60;
export const PITCH_HIRE_INTERVAL = 30;

export function getPitchHireBlockedSlots(date: Date): BlockedSlot[] {
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
      blocked.push({ courtId: "in1", start: 8 * 60, end: 13 * 60, label: "Elite Summer League (ESL) Tournament" });
      blocked.push({ courtId: "in2", start: 8 * 60, end: 13 * 60, label: "Elite Summer League (ESL) Tournament" });
      blocked.push({ courtId: "out1", start: 8 * 60, end: 13 * 60, label: "Elite Summer League (ESL) Tournament" });
    }
  }

  return blocked;
}
