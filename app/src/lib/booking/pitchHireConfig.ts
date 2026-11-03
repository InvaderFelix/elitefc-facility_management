import { bookingLegendItems, bookingLegendNote } from "./legend";
import { PITCH_HIRE_COURTS, PITCH_HIRE_START_MINUTES, PITCH_HIRE_END_MINUTES, PITCH_HIRE_INTERVAL, getPitchHireBlockedSlots } from "./pitchHire";

export const pitchHireNotes = [
  "Bookings are made online only, no phone or walk-in reservations.",
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
  legendItems: bookingLegendItems,
  legendNote: bookingLegendNote,
  notes: pitchHireNotes,
};
