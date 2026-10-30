import { PITCH_HIRE_COURTS, PITCH_HIRE_START_MINUTES, PITCH_HIRE_END_MINUTES, PITCH_HIRE_INTERVAL, getPitchHireBlockedSlots } from "./pitchHire";

export const pitchHireLegendItems = [
  { label: "Available", swatchClass: "booking-legend__swatch booking-legend__swatch--available" },
  { label: "Selected", swatchClass: "booking-legend__swatch booking-legend__swatch--selected" },
  { label: "Booked", swatchClass: "booking-legend__swatch booking-legend__swatch--blocked" },
];

export const pitchHireLegendNote = "You may only book in 30-minute blocks";

export const pitchHireNotes = [
  "Bookings are made online only — no phone or walk-in reservations.",
  "Payment is taken at the time of booking to confirm your slot.",
  "Cancellations within 24 hours of your booking incur a fee.",
  "Single bookings must be continuous, we cannot accommodate 30-minute gaps.",
];

export const pitchHireConfig = {
  courts: PITCH_HIRE_COURTS,
  startMinutes: PITCH_HIRE_START_MINUTES,
  endMinutes: PITCH_HIRE_END_MINUTES,
  interval: PITCH_HIRE_INTERVAL,
  getBlockedSlotsForDate: getPitchHireBlockedSlots,
  legendItems: pitchHireLegendItems,
  legendNote: pitchHireLegendNote,
  notes: pitchHireNotes,
};
