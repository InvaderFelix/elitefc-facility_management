import { useState, type CSSProperties } from "react";
import { Button } from "../Button";
import { addDays, buildBookings, buildSelectedSlots, computeTotal, extendRange, getBlockLabel, isSlotBlocked, minutesToLabel } from "../../lib/booking";
import type { BlockedSlot, Court, CourtSelection, SelectedSlot, SlotBlockPredicate } from "../../lib/booking";

type BookingLine = { court: Court; start: number; end: number };

export interface BookingLegendItem {
  label: string;
  swatchClass: string;
}

export interface CalendarProps {
  courts: Court[];
  startMinutes: number;
  endMinutes: number;
  interval: number;
  today?: Date;
  getBlockedSlotsForDate: (date: Date) => BlockedSlot[];
  legendItems?: BookingLegendItem[];
  legendNote?: string;
  onSelectionChange?: (slots: SelectedSlot[], bookings: BookingLine[], total: number) => void;
  showSummary?: boolean;
  showNotes?: boolean;
  notes?: string[];
  continueLabel?: string;
  clearLabel?: string;
}

export function Calendar({
  courts,
  startMinutes,
  endMinutes,
  interval,
  today = new Date(),
  getBlockedSlotsForDate,
  legendItems = [],
  legendNote = "",
  onSelectionChange,
  showSummary = true,
  showNotes = true,
  notes = [],
  continueLabel = "Continue →",
  clearLabel = "Clear",
}: CalendarProps) {
  const [date, setDate] = useState(today);
  const [ranges, setRanges] = useState<Record<string, CourtSelection>>({});

  const blockedSlots = getBlockedSlotsForDate(date);
  const isBlocked: SlotBlockPredicate = (courtId, start, end) =>
    isSlotBlocked(blockedSlots, courtId, start, end);

  const spanFor = (courtId: string, selection: CourtSelection) =>
    extendRange(courtId, selection.anchor, selection.target, selection.target + interval, isBlocked);

  const selectSlot = (courtId: string, slotStart: number) => {
    if (isSlotBlocked(blockedSlots, courtId, slotStart, slotStart + interval)) return;

    setRanges((prev) => {
      const current = prev[courtId];

      if (!current) {
        return { ...prev, [courtId]: { anchor: slotStart, target: slotStart } };
      }

      if (current.anchor === slotStart) {
        const next = { ...prev };
        delete next[courtId];
        return next;
      }

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

  const handleDateSelect = (newDate: Date) => {
    setDate(newDate);
    setRanges({});
  };

  const goToToday = () => {
    setDate(today);
    setRanges({});
  };

  const clearRanges = () => setRanges({});

  const selectedSlots = buildSelectedSlots(ranges, isBlocked, courts);
  const bookings = buildBookings(selectedSlots);
  const total = computeTotal(selectedSlots, courts);
  const durationMinutes = selectedSlots.length * interval;

  if (onSelectionChange) {
    onSelectionChange(selectedSlots, bookings, total);
  }

  const isToday = date.toDateString() === today.toDateString();

  const isAtStart = (() => {
    const d = new Date(date);
    const t = new Date(today);
    d.setHours(12, 0, 0, 0);
    t.setHours(12, 0, 0, 0);
    return d.getTime() <= t.getTime();
  })();

  const openDatePicker = () => {
    const picker = document.getElementById("booking-date") as HTMLInputElement | null;
    picker?.showPicker?.();
    picker?.focus?.();
  };

  const handleDateInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.value) return;
    const newDate = new Date(event.target.value);
    newDate.setHours(12, 0, 0, 0);
    const todayMid = new Date(today);
    todayMid.setHours(12, 0, 0, 0);
    if (newDate < todayMid) return;
    handleDateSelect(newDate);
  };

  return (
    <>
      <div className="booking-toolbar">
        <div className="booking-datenav">
          <div className="booking-datenav__controls">
            <button type="button" className="booking-datenav__arrow" onClick={() => changeDate(-1)} aria-label="Previous day" disabled={isAtStart}>
              ‹
            </button>
            <button type="button" className="booking-datenav__arrow" onClick={() => changeDate(1)} aria-label="Next day">
              ›
            </button>
          </div>

          <div className="booking-datenav__date">
            <span className="booking-datenav__weekday">{date.toLocaleDateString("en-AU", { weekday: "long" })}</span>
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
              <Button type="button" variant="secondary" size="sm" onClick={openDatePicker}>
                Pick Date
              </Button>
              <input
                id="booking-date"
                type="date"
                value={date.toISOString().split("T")[0]}
                onChange={handleDateInputChange}
                max="2100-12-31"
                min={new Date().toISOString().split("T")[0]}
                className="booking-datenav__picker"
                aria-label="Select booking date"
              />
            </div>
            <Button type="button" variant="secondary" size="sm" onClick={goToToday} disabled={isToday}>
              Today
            </Button>
          </div>
        </div>

        {legendItems.length > 0 && (
          <div className="booking-legend">
            {legendItems.map((item, idx) => (
              <span className="booking-legend__item" key={idx}>
                <span className={item.swatchClass} />
                {item.label}
              </span>
            ))}
            {legendNote && <span className="booking-legend__note">{legendNote}</span>}
          </div>
        )}
      </div>

      <div className="booking-sheet">
        <div className="booking-grid" style={{ "--courts": courts.length } as CSSProperties}>
          {courts.map((court) => (
            <div className="booking-cell booking-cell--head" key={court.id}>
              {court.name}
              <span className="booking-cell__type">
                {court.type} · ${court.pricePerHour.toFixed(0)}/hr
              </span>
            </div>
          ))}

          {Array.from({ length: (endMinutes - startMinutes) / (interval * 2) }, (_, i) => startMinutes + i * interval * 2).map((mins) => {
            return courts.map((court) => {
              const start1 = mins;
              const end1 = mins + interval;
              const start2 = mins + interval;
              const end2 = mins + interval * 2;
              const blocked1 = isSlotBlocked(blockedSlots, court.id, start1, end1);
              const blocked2 = isSlotBlocked(blockedSlots, court.id, start2, end2);

              const selection = ranges[court.id];
              const span = selection ? spanFor(court.id, selection) : null;
              const labelStart = span && selection ? (selection.target >= selection.anchor ? span.end - interval : span.start) : null;

              const slotState = (start: number, end: number, blocked: boolean) => {
                const blockLabel = blocked ? getBlockLabel(blockedSlots, court.id, start, end) || "Blocked" : undefined;
                const isSelected = !!span && !blocked && start >= span.start && end <= span.end;
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

                const className = `booking-slot${blocked ? " booking-slot--blocked" : ""}${isSelected ? " booking-slot--selected" : ""}${
                  isLabel ? " booking-slot--range" : ""
                }${isAnchor ? " booking-slot--cancel" : ""}`;

                return { content, className, blockLabel, isSelected };
              };

              const s1 = slotState(start1, end1, blocked1);
              const s2 = slotState(start2, end2, blocked2);

              return (
                <div className="booking-cell booking-cell--slots" key={`${court.id}-${mins}`}>
                  <div className="booking-slots">
                    <button type="button" className={s1.className} aria-pressed={s1.isSelected} onClick={() => selectSlot(court.id, start1)} disabled={blocked1} title={s1.blockLabel}>
                      {s1.content}
                    </button>
                    <button type="button" className={s2.className} aria-pressed={s2.isSelected} onClick={() => selectSlot(court.id, start2)} disabled={blocked2} title={s2.blockLabel}>
                      {s2.content}
                    </button>
                  </div>
                </div>
              );
            });
          })}
        </div>
      </div>

      {showSummary && (
        <div className="booking-summary">
          <div className="booking-summary__body">
            <span className="booking-summary__kicker">YOUR SELECTION</span>

            {bookings.length === 0 ? (
              <p className="booking-summary__empty">No times selected yet. Choose an available slot above.</p>
            ) : (
              <ul className="booking-summary__list">
                {bookings.map((booking, idx) => (
                  <li key={`${booking.court.id}-${booking.start}-${idx}`}>
                    {date.toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}
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
                  <span className="booking-summary__price-value">${total.toFixed(2)}</span>
                  <span className="booking-summary__price-value">({durationMinutes}min)</span>
                </>
              )}
            </div>
          </div>

          <div className="booking-summary__info">
            <Button type="button" variant="ghost" fullWidth onClick={clearRanges} disabled={selectedSlots.length === 0}>
              {clearLabel}
            </Button>
            <Button type="button" variant="primary" fullWidth disabled={selectedSlots.length === 0}>
              {continueLabel}
            </Button>
          </div>
        </div>
      )}

      {showNotes && notes.length > 0 && (
        <div className="booking-notes">
          <h3>Please note</h3>
          <ul>
            {notes.map((note, idx) => (
              <li key={idx}>{note}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
