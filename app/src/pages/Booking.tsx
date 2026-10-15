import { useState, type CSSProperties } from "react";
import "../App.css";
import { Button } from "../components/Button";

interface Court {
  id: string;
  name: string;
  type: string;
  pricePerHour: number;
}

const COURTS: Court[] = [
  { id: "in1", name: "Indoor Court 1", type: "7-a-side", pricePerHour: 240 },
  { id: "in2", name: "Indoor Court 2", type: "5-a-side", pricePerHour: 120 },
  { id: "out1", name: "Outdoor Court 1", type: "5-a-side", pricePerHour: 110 },
];

const START_MINUTES = 7 * 60; // 7:00am
const END_MINUTES = 23 * 60; // 11:00pm
const INTERVAL = 30; // half hour blocks

function minutesToLabel(totalMinutes: number) {
  const hr = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  const period = hr >= 12 ? "pm" : "am";
  const display = hr % 12 === 0 ? 12 : hr % 12;
  return `${display}:${m === 0 ? "00" : "30"}${period}`;
}

function parseTime(label: string) {
  const m = label.match(/^(\d+):(\d+)(am|pm)$/);
  if (!m) return 0;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const p = m[3];
  if (p === "pm" && h !== 12) h += 12;
  if (p === "am" && h === 12) h = 0;
  return h * 60 + min;
}

function parseLabel(label: string) {
  const [start, end] = label.split("-");
  return { start: parseTime(start), end: parseTime(end) };
}

function dateKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}


interface BlockedSlot {
  courtId: string;
  start: number;
  end: number;
  label: string;
}

interface CourtRange {
  start: number;
  end: number;
  complete: boolean;
}

function getDay(date: Date) {
  return date.getDay(); // 0 Sun, 1 Mon, 2 Tue, 3 Wed, 4 Thu, 5 Fri, 6 Sat
}

function getBlockedSlots(date: Date): BlockedSlot[] {
  const blocked: BlockedSlot[] = [];
  const day = getDay(date);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const d = date.getDate();

  // Saturday: block out 8am-1:30pm for the 7v7 pitch (in1) - label "Coaching"
  if (day === 6) {
    blocked.push({ courtId: "in1", start: 8 * 60, end: 13 * 60 + 30, label: "Coaching" });
    // Saturday: block out 9am-12pm for both 5v5 pitches (in2, out1)
    blocked.push({ courtId: "in2", start: 9 * 60, end: 12 * 60, label: "Coaching" });
    blocked.push({ courtId: "out1", start: 9 * 60, end: 12 * 60, label: "Coaching" });
  }

  // Monday to Friday block out 3:30pm-7pm (label "Coaching")
  if (day >= 1 && day <= 5) {
    blocked.push({ courtId: "in1", start: 15 * 60 + 30, end: 19 * 60, label: "Coaching" });
    blocked.push({ courtId: "in2", start: 15 * 60 + 30, end: 19 * 60, label: "Coaching" });
    blocked.push({ courtId: "out1", start: 15 * 60 + 30, end: 19 * 60, label: "Coaching" });
  }

  // every Monday and Tuesday block out 7pm-11:30pm (label "League Play")
  if (day === 1 || day === 2) {
    blocked.push({ courtId: "in1", start: 19 * 60, end: 23 * 60 + 30, label: "League Play" });
    blocked.push({ courtId: "in2", start: 19 * 60, end: 23 * 60 + 30, label: "League Play" });
    blocked.push({ courtId: "out1", start: 19 * 60, end: 23 * 60 + 30, label: "League Play" });
  }

  // every Sunday from 1st November 2026 to 13th December 2026 block out 8am-1pm (label "ESL Tournament")
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

function extendRange(
  courtId: string,
  anchor: number,
  slotStart: number,
  slotEnd: number,
  isSlotBlocked: (courtId: string, start: number, end: number) => boolean
) {
  const rawStart = Math.min(anchor, slotStart);
  const rawEnd = Math.max(anchor + INTERVAL, slotEnd);

  // Keep the range continuous by stopping at the first blocked slot.
  let end = anchor + INTERVAL;
  for (let m = end; m < rawEnd; m += INTERVAL) {
    if (isSlotBlocked(courtId, m, m + INTERVAL)) break;
    end = m + INTERVAL;
  }
  let start = anchor;
  for (let m = anchor - INTERVAL; m >= rawStart; m -= INTERVAL) {
    if (isSlotBlocked(courtId, m, m + INTERVAL)) break;
    start = m;
  }

  return { start, end };
}

export function Booking() {
  const today = new Date();
  const [date, setDate] = useState(today);
  const [ranges, setRanges] = useState<Record<string, CourtRange>>({});
  const [hover, setHover] = useState<{ courtId: string; start: number; end: number } | null>(
    null
  );

  const isToday = dateKey(date) === dateKey(today);
  const blockedSlots = getBlockedSlots(date);
  const isSlotBlocked = (courtId: string, start: number, end: number) => {
    return blockedSlots.some((b) => b.courtId === courtId && !(end <= b.start || start >= b.end));
  };
  const getBlockLabel = (courtId: string, start: number, end: number) => {
    return blockedSlots.find((b) => b.courtId === courtId && !(end <= b.start || start >= b.end))?.label;
  };

  const selectSlot = (courtId: string, slotStart: number, slotEnd: number) => {
    if (isSlotBlocked(courtId, slotStart, slotEnd)) return;

    setRanges((prev) => {
      const current = prev[courtId];

      // First click, or a fresh range after the previous one was completed.
      if (!current || current.complete) {
        return {
          ...prev,
          [courtId]: { start: slotStart, end: slotEnd, complete: false },
        };
      }

      // Second click: the clicked slot sets the end of the range.
      const { start, end } = extendRange(
        courtId,
        current.start,
        slotStart,
        slotEnd,
        isSlotBlocked
      );

      return { ...prev, [courtId]: { start, end, complete: true } };
    });
  };

  const selected: string[] = [];
  for (const [courtId, range] of Object.entries(ranges)) {
    for (let m = range.start; m < range.end; m += INTERVAL) {
      selected.push(`${courtId}|${minutesToLabel(m)}-${minutesToLabel(m + INTERVAL)}`);
    }
  }

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

  const selectedSlots = selected
    .map((slot) => {
      const [courtId, label] = slot.split("|");
      const court = COURTS.find((item) => item.id === courtId);
      return { court, label };
    })
    .filter((item) => item.court)
    .sort((a, b) => a.label.localeCompare(b.label));

  const bookings = (() => {
    const byCourt = new Map<string, { start: number; end: number }[]>();
    selectedSlots.forEach((slot) => {
      const id = slot.court?.id ?? "";
      const { start, end } = parseLabel(slot.label);
      const ranges = byCourt.get(id) ?? [];
      ranges.push({ start, end });
      byCourt.set(id, ranges);
    });

    const result: { court: Court; start: number; end: number }[] = [];
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
  })();

  return (
    <main className="content">
      <section className="hero">
        <div className="eyebrow">BOOKING</div>

        <h1>
          Court & Pitch
          <span>Hire</span>
        </h1>

        <p className="hero-description">
          Public availability for our indoor courts and outdoor pitches. Pick a
          date, choose your times and reserve online.
        </p>
      </section>

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
            onMouseLeave={() => setHover(null)}
          >
            {COURTS.map((court) => (
              <div
                className="booking-cell booking-cell--head"
                key={court.id}
                onMouseEnter={() => setHover(null)}
              >
                <span className="booking-cell__court">{court.name}</span>
                <span className="booking-cell__type">{court.type} · ${court.pricePerHour.toFixed(0)}/hr</span>
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
                  const key1 = `${court.id}|${minutesToLabel(start1)}-${minutesToLabel(end1)}`;
                  const key2 = `${court.id}|${minutesToLabel(start2)}-${minutesToLabel(end2)}`;
                  const blocked1 = isSlotBlocked(court.id, start1, end1);
                  const blocked2 = isSlotBlocked(court.id, start2, end2);
                  const selected1 = selected.includes(key1) && !blocked1;
                  const selected2 = selected.includes(key2) && !blocked2;

                  const activeRange = ranges[court.id];
                  const preview =
                    activeRange && !activeRange.complete
                      ? hover && hover.courtId === court.id
                        ? extendRange(
                            court.id,
                            activeRange.start,
                            hover.start,
                            hover.end,
                            isSlotBlocked
                          )
                        : { start: activeRange.start, end: activeRange.end }
                      : null;
                  const anchorStart =
                    activeRange && !activeRange.complete ? activeRange.start : null;

                  const slotState = (
                    start: number,
                    end: number,
                    blocked: boolean,
                    isSelected: boolean
                  ) => {
                    const blockLabel = blocked
                      ? getBlockLabel(court.id, start, end) || "Blocked"
                      : undefined;
                    const inPreview =
                      !!preview && !blocked && start >= preview.start && end <= preview.end;
                    const isHovered =
                      !!preview && hover?.courtId === court.id && hover.start === start;

                    let content: string;
                    if (blocked) {
                      content = blockLabel || "";
                    } else if (isHovered && preview) {
                      content = `Book from ${minutesToLabel(preview.start)} to ${minutesToLabel(
                        preview.end
                      )}`;
                    } else if (inPreview && start !== anchorStart) {
                      content = "";
                    } else {
                      content = minutesToLabel(start);
                    }

                    const className = `booking-slot${
                      blocked ? " booking-slot--blocked" : ""
                    }${isSelected ? " booking-slot--selected" : ""}${
                      inPreview ? " booking-slot--preview" : ""
                    }${isHovered ? " booking-slot--range" : ""}`;

                    return { content, className, blockLabel };
                  };

                  const s1 = slotState(start1, end1, blocked1, selected1);
                  const s2 = slotState(start2, end2, blocked2, selected2);

                  return (
                    <div
                      className="booking-cell booking-cell--slots"
                      key={`${court.id}-${mins}`}
                    >
                      <div className="booking-slots">
                        <button
                          type="button"
                          className={s1.className}
                          aria-pressed={selected1}
                          onClick={() => selectSlot(court.id, start1, end1)}
                          onMouseEnter={() => setHover({ courtId: court.id, start: start1, end: end1 })}
                          disabled={blocked1}
                          title={s1.blockLabel}
                        >
                          {s1.content}
                        </button>
                        <button
                          type="button"
                          className={s2.className}
                          aria-pressed={selected2}
                          onClick={() => selectSlot(court.id, start2, end2)}
                          onMouseEnter={() => setHover({ courtId: court.id, start: start2, end: end2 })}
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
              {(() => {
                if (selectedSlots.length === 0) return null;
                const totals = selectedSlots.reduce<Record<string, number>>(
                  (acc, s) => {
                    const id = s.court?.id ?? "";
                    acc[id] = (acc[id] || 0) + 0.5;
                    return acc;
                  },
                  {}
                );
                const total = Object.entries(totals).reduce((sum, [id, h]) => {
                  const c = COURTS.find((x) => x.id === id);
                  return sum + (c?.pricePerHour ?? 0) * h;
                }, 0);
                const hours = selectedSlots.length * 30;
                const hoursLabel = `(${hours}min)`;
                return (
                  <>
                    <span className="booking-summary__total">Total</span>
                    <span className="booking-summary__price-value">
                      ${total.toFixed(2)}
                    </span>
                    <span className="booking-summary__price-value">{hoursLabel}</span>
                  </>
                );
              })()}
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