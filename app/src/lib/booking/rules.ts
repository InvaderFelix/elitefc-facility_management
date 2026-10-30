import type { BlockedSlot } from "./types";

export function isSlotBlocked(blocked: BlockedSlot[], courtId: string, start: number, end: number): boolean {
  return blocked.some((b) => b.courtId === courtId && !(end <= b.start || start >= b.end));
}

export function getBlockLabel(blocked: BlockedSlot[], courtId: string, start: number, end: number): string | undefined {
  return blocked.find((b) => b.courtId === courtId && !(end <= b.start || start >= b.end))?.label;
}
