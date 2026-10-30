export interface Court {
  id: string;
  name: string;
  type: string;
  pricePerHour: number;
}

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

export type SlotBlockPredicate = (courtId: string, start: number, end: number) => boolean;
