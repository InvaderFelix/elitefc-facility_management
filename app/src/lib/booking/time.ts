export function minutesToLabel(totalMinutes: number): string {
  const hr = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  const period = hr >= 12 ? "pm" : "am";
  const display = hr % 12 === 0 ? 12 : hr % 12;
  return `${display}:${m === 0 ? "00" : "30"}${period}`;
}

export function dateKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export function addDays(date: Date, amount: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

export function getDay(date: Date): number {
  return date.getDay();
}
