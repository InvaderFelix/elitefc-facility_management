import { useState, type CSSProperties } from "react";
import "../styles/pages/booking.css";
import { Button } from "../components/Button";
import { PageHero } from "../components/PageHero";
import {
  COURTS,
  END_MINUTES,
  INTERVAL,
  START_MINUTES,
  addDays,
  buildBookings,
  buildSelectedSlots,
  computeTotal,
  dateKey,
  extendRange,
  getBlockLabel,
  getBlockedSlots,
  isSlotBlocked,
  minutesToLabel,
  type CourtSelection,
  type SlotBlockPredicate,
} from "../lib/booking/availability";

export function Booking() {
  const today = new Date();
  const [date, setDate] = useState(today);
  const [ranges, setRanges] = useState<Record<string, CourtSelection>>({});

  const isToday = dateKey(date) === dateKey(today);
  const blockedSlots = getBlockedSlots(date);
  const isBlocked: SlotBlockPredicate = (courtId, start, end) =>
    isSlotBlocked(blockedSlots, courtId, start, end);

  const spanFor = (courtId: string, selection: CourtSelection) =>
    extendRange(courtId, selection.anchor, selection.target, selection.target + INTERVAL, isBlocked);

  const selectSlot = (courtId: string, slotStart: number) => {
    if (isSlotBlocked(blockedSlots, courtId, slotStart, slotStart + INTERVAL)) return;

    setRanges((prev) => {
      const current = prev[courtId];

      // First tap: this square becomes the start (and the end) of the range.
      if (!current) {
        return { ...prev, [courtId]: { anchor: slotStart, target: slotStart } };
      }

      // Tapping the start square again clears the selection.
      if (current.anchor === slotStart) {
        const next = { ...prev };
        delete next[courtId];
        return next;
      }

      // Any other square becomes the end of the range.
      return { ...prev, [courtId]: { ...current, target: slotStart } };
    });
  };

  const changeDate = (amount: number) => {
    setDate((current) => {
      const next = addDays(current, amount);
      const t = new Date(today);
      t.setHours(12, 0, 0, 0);
      next.setHours(12, 0, 0, 0);
      if (next < t) return current;
      return next;
    });
    setRanges({});
  };

  const selectedSlots = buildSelectedSlots(ranges, isBlocked);
  const bookings = buildBookings(selectedSlots);
  const total = computeTotal(selectedSlots);
  const durationMinutes = selectedSlots.length * 30;

  return (
    <main className="content">
      <PageHero
        eyebrow="BOOKING"
        title="Court & Pitch"
        accent="Hire"
        description="Public availability for our indoor courts and outdoor pitches. Pick a date, choose your times and reserve online."
      />

      <section className="booking">
        <div className="booking-toolbar">
          <div className="booking-datenav">
            <div className="booking-datenav__controls">
              <button
                type="button"
                className="booking-datenav__arrow"
                onClick={() => changeDate(-1)}
                aria-label="Previous day"
                disabled={(() => {
                  const d = new Date(date);
                  const t = new Date(today);
                  d.setHours(12, 0, 0, 0);
                  t.setHours(12, 0, 0, 0);
                  return d.getTime() <= t.getTime();
                })()}
              >
                ‹
              </button>

              <button
                type="button"
                className="booking-datenav__arrow"
                onClick={() => changeDate(1)}
                aria-label="Next day"
              >
                ›
              </button>
            </div>

            <div className="booking-datenav__date">
              <span className="booking-datenav__weekday">
                {date.toLocaleDateString("en-AU", { weekday: "long" })}
              </span>
              <strong>
                {date.toLocaleDateString("en-AU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </strong>
            </div>

            <div className="booking-datenav__actions">
              <div className="booking-datenav__picker-wrapper">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    const picker = document.getElementById(
                      "booking-date"
                    ) as HTMLInputElement | null;
                    picker?.showPicker?.();
                    picker?.focus?.();
                  }}
                >
                  Pick Date
                </Button>
                <input
                  id="booking-date"
                  type="date"
                  value={date.toISOString().split("T")[0]}
                  onChange={(event) => {
                    if (!event.target.value) return;
                    const newDate = new Date(event.target.value);
                    newDate.setHours(12, 0, 0, 0);
                    const todayMid = new Date(today);
                    todayMid.setHours(12, 0, 0, 0);
                    if (newDate < todayMid) return;
                    setDate(newDate);
                    setRanges({});
                  }}
                  max="2100-12-31"
                  min={new Date().toISOString().split("T")[0]}
                  className="booking-datenav__picker"
                  aria-label="Select booking date"
                />
              </div>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  setDate(today);
                  setRanges({});
                }}
                disabled={isToday}
              >
                Today
              </Button>
            </div>
          </div>

          <div className="booking-legend">
            <span className="booking-legend__item">
              <span className="booking-legend__swatch booking-legend__swatch--available" />
              Available
            </span>
            <span className="booking-legend__item">
              <span className="booking-legend__swatch booking-legend__swatch--selected" />
              Selected
            </span>
          </div>
        </div>

        <div className="booking-sheet">
          <div
            className="booking-grid"
            style={{ "--courts": COURTS.length } as CSSProperties}
          >
            {COURTS.map((court) => (
              <div className="booking-cell booking-cell--head" key={court.id}>
                <span className="booking-cell__court">{court.name}</span>
                <span className="booking-cell__type">
                  {court.type} · ${court.pricePerHour.toFixed(0)}/hr
                </span>
              </div>
            ))}

            {Array.from(
              { length: (END_MINUTES - START_MINUTES) / (INTERVAL * 2) },
              (_, i) => START_MINUTES + i * INTERVAL * 2
            ).map((mins) => {
              return COURTS.map((court) => {
                const start1 = mins;
                const end1 = mins + INTERVAL;
                const start2 = mins + INTERVAL;
                const end2 = mins + INTERVAL * 2;
                const blocked1 = isSlotBlocked(blockedSlots, court.id, start1, end1);
                const blocked2 = isSlotBlocked(blockedSlots, court.id, start2, end2);

                const selection = ranges[court.id];
                const span = selection ? spanFor(court.id, selection) : null;
                const labelStart =
                  span && selection
                    ? selection.target >= selection.anchor
                      ? span.end - INTERVAL
                      : span.start
                    : null;

                const slotState = (start: number, end: number, blocked: boolean) => {
                  const blockLabel = blocked
                    ? getBlockLabel(blockedSlots, court.id, start, end) || "Blocked"
                    : undefined;
                  const isSelected =
                    !!span && !blocked && start >= span.start && end <= span.end;
                  const isLabel = !!span && !blocked && start === labelStart;
                  const isAnchor = !blocked && !!selection && start === selection.anchor;

                  let content: string;
                  if (blocked) {
                    content = blockLabel || "";
                  } else if (isLabel && span) {
                    content = `${minutesToLabel(span.start)}\nto\n${minutesToLabel(span.end)}`;
                  } else if (isAnchor) {
                    content = "Click here\nto cancel";
                  } else if (isSelected) {
                    content = "";
                  } else {
                    content = minutesToLabel(start);
                  }

                  const className = `booking-slot${
                    blocked ? " booking-slot--blocked" : ""
                  }${isSelected ? " booking-slot--selected" : ""}${
                    isLabel ? " booking-slot--range" : ""
                  }${isAnchor ? " booking-slot--cancel" : ""}`;

                  return { content, className, blockLabel, isSelected };
                };

                const s1 = slotState(start1, end1, blocked1);
                const s2 = slotState(start2, end2, blocked2);

                return (
                  <div
                    className="booking-cell booking-cell--slots"
                    key={`${court.id}-${mins}`}
                  >
                    <div className="booking-slots">
                      <button
                        type="button"
                        className={s1.className}
                        aria-pressed={s1.isSelected}
                        onClick={() => selectSlot(court.id, start1)}
                        disabled={blocked1}
                        title={s1.blockLabel}
                      >
                        {s1.content}
                      </button>
                      <button
                        type="button"
                        className={s2.className}
                        aria-pressed={s2.isSelected}
                        onClick={() => selectSlot(court.id, start2)}
                        disabled={blocked2}
                        title={s2.blockLabel}
                      >
                        {s2.content}
                      </button>
                    </div>
                  </div>
                );
              });
            })}
          </div>
        </div>

        <div className="booking-summary">
          <div className="booking-summary__body">
            <span className="booking-summary__kicker">YOUR SELECTION</span>

            {bookings.length === 0 ? (
              <p className="booking-summary__empty">
                No times selected yet. Choose an available slot above.
              </p>
            ) : (
              <ul className="booking-summary__list">
                {bookings.map((booking, idx) => (
                  <li key={`${booking.court.id}-${booking.start}-${idx}`}>
                    <span className="booking-summary__date-faded">
                      {date.toLocaleDateString("en-AU", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <span>{booking.court.name}</span>
                    <span className="booking-summary__time">
                      {minutesToLabel(booking.start)} – {minutesToLabel(booking.end)}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <div className="booking-summary__price-row">
              {selectedSlots.length > 0 && (
                <>
                  <span className="booking-summary__total">Total</span>
                  <span className="booking-summary__price-value">
                    ${total.toFixed(2)}
                  </span>
                  <span className="booking-summary__price-value">
                    ({durationMinutes}min)
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="booking-summary__info">
            <Button
              type="button"
              variant="ghost"
              fullWidth
              onClick={() => setRanges({})}
              disabled={selectedSlots.length === 0}
            >
              Clear
            </Button>
            <Button
              type="button"
              variant="primary"
              fullWidth
              disabled={selectedSlots.length === 0}
            >
              Continue →
            </Button>
          </div>
        </div>

        <div className="booking-notes">
          <h3>Please note</h3>
          <ul>
            <li>Bookings are made online only — no phone or walk-in reservations.</li>
            <li>Payment is taken at the time of booking to confirm your slot.</li>
            <li>Cancellations within 24 hours of your booking incur a fee.</li>
            <li>Single bookings must be continuous, we cannot accomodate 30 minute gaps.</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
