import { describe, it, expect } from 'vitest';
import {
  PITCH_HIRE_COURTS,
  PITCH_HIRE_END_MINUTES,
  INTERVAL,
  PITCH_HIRE_START_MINUTES,
  addDays,
  buildBookings,
  buildSelectedSlots,
  computeTotal,
  dateKey,
  extendRange,
  getBlockLabel,
  getPitchHireBlockedSlots,
  isSlotBlocked,
  minutesToLabel,
  type BlockedSlot,
  type Court,
  type SelectedSlot,
  type SlotBlockPredicate,
} from './availability';

/* Local-time constructor: the engine reads Date methods in local time, so
 * building dates from local components keeps weekday/year assertions stable
 * regardless of the machine's timezone. */
const d = (year: number, month: number, day: number) => new Date(year, month - 1, day);

const slot = (court: Court, start: number, end: number): SelectedSlot => ({
  court,
  label: '',
  start,
  end,
});

describe('minutesToLabel', () => {
  it.each<[number, string]>([
    [0, '12:00am'],
    [7 * 60, '7:00am'],
    [12 * 60, '12:00pm'],
    [13 * 60 + 30, '1:30pm'],
    [23 * 60, '11:00pm'],
  ])('formats %i minutes as %s', (minutes, label) => {
    expect(minutesToLabel(minutes)).toBe(label);
  });
});

describe('dateKey', () => {
  it('uses unpadded month/day segments', () => {
    expect(dateKey(d(2026, 1, 5))).toBe('2026-1-5');
  });

  it('does not zero-pad double-digit month and day', () => {
    expect(dateKey(d(2026, 12, 13))).toBe('2026-12-13');
  });
});

describe('addDays', () => {
  it('rolls across a month boundary', () => {
    const next = addDays(d(2026, 1, 31), 1);
    expect(next.getMonth()).toBe(1);
    expect(next.getDate()).toBe(1);
  });

  it('moves backwards', () => {
    expect(addDays(d(2026, 3, 1), -1).getDate()).toBe(28);
  });

  it('does not mutate the input', () => {
    const original = d(2026, 5, 10);
    addDays(original, 5);
    expect(original.getDate()).toBe(10);
  });
});

describe('getPitchHireBlockedSlots', () => {
  const asTuple = (slots: BlockedSlot[]) =>
    slots.map((b) => [b.courtId, b.start, b.end, b.label]);

  it('blocks Saturday coaching on all three courts (07 Nov 2026)', () => {
    expect(asTuple(getPitchHireBlockedSlots(d(2026, 11, 7)))).toEqual([
      ['in1', 8 * 60, 13 * 60 + 30, 'Coaching'],
      ['in2', 9 * 60, 12 * 60, 'Coaching'],
      ['out1', 9 * 60, 12 * 60, 'Coaching'],
    ]);
  });

  it('blocks weekday after-school coaching plus Mon/Tue league on Monday', () => {
    const slots = getPitchHireBlockedSlots(d(2026, 10, 5));
    expect(slots).toHaveLength(6);
    expect(slots.filter((b) => b.label === 'Coaching')).toHaveLength(3);
    expect(slots.filter((b) => b.label === 'League Play')).toHaveLength(3);
    expect(slots.find((b) => b.courtId === 'in1' && b.label === 'League Play')).toMatchObject({
      start: 19 * 60,
      end: 23 * 60 + 30,
    });
  });

  it('adds league play on Tuesday too', () => {
    expect(getPitchHireBlockedSlots(d(2026, 10, 6))).toHaveLength(6);
  });

  it('has only after-school coaching midweek', () => {
    const slots = getPitchHireBlockedSlots(d(2026, 10, 7));
    expect(slots).toHaveLength(3);
    expect(slots.every((b) => b.label === 'Coaching')).toBe(true);
  });

  it('leaves a plain Sunday free', () => {
    expect(getPitchHireBlockedSlots(d(2026, 10, 4))).toEqual([]);
  });

  it('blocks the Elite Summer League (ESL) tournament on Sundays in Nov 2026 and 1–13 Dec 2026', () => {
    const expected = [
      ['in1', 8 * 60, 13 * 60, 'Elite Summer League (ESL) Tournament'],
      ['in2', 8 * 60, 13 * 60, 'Elite Summer League (ESL) Tournament'],
      ['out1', 8 * 60, 13 * 60, 'Elite Summer League (ESL) Tournament'],
    ];
    expect(asTuple(getPitchHireBlockedSlots(d(2026, 11, 1)))).toEqual(expected);
    expect(asTuple(getPitchHireBlockedSlots(d(2026, 12, 13)))).toEqual(expected);
  });

  it('stops the Elite Summer League (ESL) window after 13 Dec 2026', () => {
    expect(getPitchHireBlockedSlots(d(2026, 12, 20))).toEqual([]);
  });

  it('does not run Elite Summer League (ESL) in other years', () => {
    expect(getPitchHireBlockedSlots(d(2027, 11, 7))).toEqual([]);
  });

  it('Elite Summer League (ESL) applies to Sundays only (Saturday 07 Nov gets normal coaching)', () => {
    expect(getPitchHireBlockedSlots(d(2026, 11, 7)).every((b) => b.label === 'Coaching')).toBe(true);
  });
});

describe('isSlotBlocked / getBlockLabel', () => {
  const blocked: BlockedSlot[] = [
    { courtId: 'in1', start: 600, end: 660, label: 'Coaching' },
  ];

  it('detects exact, partial, containing and contained overlaps', () => {
    expect(isSlotBlocked(blocked, 'in1', 600, 660)).toBe(true);
    expect(isSlotBlocked(blocked, 'in1', 570, 630)).toBe(true);
    expect(isSlotBlocked(blocked, 'in1', 540, 720)).toBe(true);
    expect(isSlotBlocked(blocked, 'in1', 615, 645)).toBe(true);
  });

  it('treats touching ranges as free (end <= start)', () => {
    expect(isSlotBlocked(blocked, 'in1', 570, 600)).toBe(false);
    expect(isSlotBlocked(blocked, 'in1', 660, 690)).toBe(false);
  });

  it('is scoped per court', () => {
    expect(isSlotBlocked(blocked, 'in2', 600, 660)).toBe(false);
    expect(getBlockLabel(blocked, 'in2', 600, 660)).toBeUndefined();
  });

  it('returns the overlapping block label', () => {
    expect(getBlockLabel(blocked, 'in1', 600, 660)).toBe('Coaching');
    expect(getBlockLabel(blocked, 'in1', 700, 730)).toBeUndefined();
  });
});

describe('extendRange', () => {
  const never: SlotBlockPredicate = () => false;

  it('grows forward from the anchor to cover the target slot', () => {
    expect(extendRange('in1', 600, 690, 720, never)).toEqual({ start: 600, end: 720 });
  });

  it('grows backwards from the anchor to cover the target slot', () => {
    expect(extendRange('in1', 720, 600, 630, never)).toEqual({ start: 600, end: 750 });
  });

  it('stops the forward walk at the first blocked slot', () => {
    const blockedBeforeTarget: SlotBlockPredicate = (_id, start) => start === 660;
    expect(extendRange('in1', 600, 690, 720, blockedBeforeTarget)).toEqual({ start: 600, end: 660 });
  });

  it('stops the backward walk at the first blocked slot', () => {
    const blocked: SlotBlockPredicate = (_id, start) => start === 630;
    expect(extendRange('in1', 720, 600, 630, blocked)).toEqual({ start: 660, end: 750 });
  });

  it('passes the court id through to the predicate', () => {
    const calls: Array<[string, number, number]> = [];
    const record: SlotBlockPredicate = (courtId, start, end) => {
      calls.push([courtId, start, end]);
      return false;
    };
    extendRange('out1', 600, 660, 690, record);
    expect(calls.length).toBeGreaterThan(0);
    expect(calls.every(([courtId]) => courtId === 'out1')).toBe(true);
  });
});

describe('buildSelectedSlots', () => {
  const never: SlotBlockPredicate = () => false;

  it('returns nothing for an empty selection', () => {
    expect(buildSelectedSlots({}, never, PITCH_HIRE_COURTS)).toEqual([]);
  });

  it('expands a single tap into one half-hour slot with a label', () => {
    const [first] = buildSelectedSlots({ in1: { anchor: 600, target: 600 } }, never, PITCH_HIRE_COURTS);
    expect(first).toMatchObject({ start: 600, end: 630, label: '10:00am-10:30am' });
    expect(first.court.id).toBe('in1');
  });

  it('expands a range into contiguous half-hour slots', () => {
    const slots = buildSelectedSlots({ in1: { anchor: 600, target: 660 } }, never, PITCH_HIRE_COURTS);
    expect(slots.map((s) => s.label)).toEqual([
      '10:00am-10:30am',
      '10:30am-11:00am',
      '11:00am-11:30am',
    ]);
  });

  it('ignores unknown court ids', () => {
    expect(buildSelectedSlots({ nope: { anchor: 600, target: 600 } }, never, PITCH_HIRE_COURTS)).toEqual([]);
  });

  it('sorts the flattened slots by label across courts', () => {
    const slots = buildSelectedSlots(
      { in2: { anchor: 660, target: 660 }, in1: { anchor: 600, target: 600 } },
      never,
      PITCH_HIRE_COURTS,
    );
    expect(slots.map((s) => s.label)).toEqual(['10:00am-10:30am', '11:00am-11:30am']);
  });
});

describe('buildBookings', () => {
  const in1 = PITCH_HIRE_COURTS.find((c) => c.id === 'in1')!;
  const in2 = PITCH_HIRE_COURTS.find((c) => c.id === 'in2')!;

  it('merges adjacent half-hour slots into one line', () => {
    const lines = buildBookings([slot(in1, 600, 630), slot(in1, 630, 660)]);
    expect(lines).toEqual([{ court: in1, start: 600, end: 660 }]);
  });

  it('keeps non-adjacent slots on separate lines', () => {
    const lines = buildBookings([slot(in1, 600, 630), slot(in1, 720, 750)]);
    expect(lines).toHaveLength(2);
  });

  it('sorts before merging, even when input is unordered', () => {
    const lines = buildBookings([slot(in1, 630, 660), slot(in1, 600, 630)]);
    expect(lines).toEqual([{ court: in1, start: 600, end: 660 }]);
  });

  it('produces one line per court', () => {
    const lines = buildBookings([slot(in1, 600, 630), slot(in2, 600, 630)]);
    expect(lines).toHaveLength(2);
    expect(lines.map((l) => l.court.id).sort()).toEqual(['in1', 'in2']);
  });

  it('does not bridge a gap that is only touching at a later start', () => {
    const lines = buildBookings([slot(in1, 600, 630), slot(in1, 660, 690)]);
    expect(lines).toHaveLength(2);
  });
});

describe('computeTotal', () => {
  const in1 = PITCH_HIRE_COURTS.find((c) => c.id === 'in1')!;
  const in2 = PITCH_HIRE_COURTS.find((c) => c.id === 'in2')!;
  const out1 = PITCH_HIRE_COURTS.find((c) => c.id === 'out1')!;

  it('is zero with no slots', () => {
    expect(computeTotal([])).toBe(0);
  });

  it('charges the court half-hourly rate', () => {
    expect(computeTotal([slot(in1, 600, 630)])).toBe(120);
    expect(computeTotal([slot(in1, 600, 630), slot(in1, 630, 660)])).toBe(240);
  });

  it('sums across courts at their own rates', () => {
    expect(computeTotal([slot(in2, 600, 630), slot(out1, 600, 630)])).toBe(115);
  });
});

describe('constants', () => {
  it('exposes the grid bounds and interval', () => {
    expect(PITCH_HIRE_START_MINUTES).toBe(7 * 60);
    expect(PITCH_HIRE_END_MINUTES).toBe(23 * 60);
    expect(INTERVAL).toBe(30);
  });

  it('lists the demo courts', () => {
    expect(PITCH_HIRE_COURTS).toHaveLength(3);
    expect(PITCH_HIRE_COURTS.map((c) => c.id)).toEqual(['in1', 'in2', 'out1']);
  });
});
