export type BusinessHours = {
  openHour: number;
  closeHour: number;
  stepMin: number;
};

export const DEFAULT_BUSINESS_HOURS: BusinessHours = {
  openHour: 9,
  closeHour: 21,
  stepMin: 30,
};

export type DurationUnitLabels = {
  hour: string;
  minute: string;
};

export const DEFAULT_DURATION_UNIT_LABELS: DurationUnitLabels = {
  hour: "h",
  minute: "m",
};

export function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

export function toMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function toTime(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${pad2(h)}:${pad2(m)}`;
}

export function buildSlots(hours: BusinessHours = DEFAULT_BUSINESS_HOURS) {
  const start = hours.openHour * 60;
  const end = hours.closeHour * 60;
  const slots: string[] = [];
  for (let cur = start; cur <= end; cur += hours.stepMin) slots.push(toTime(cur));
  return slots;
}

export function formatDuration(mins: number, unitLabels: DurationUnitLabels = DEFAULT_DURATION_UNIT_LABELS) {
  const m = Math.max(0, mins);
  if (m >= 60) {
    const h = Math.floor(m / 60);
    const mm = m % 60;
    return `${h}${unitLabels.hour}${mm ? ` ${mm}${unitLabels.minute}` : ""}`;
  }
  return `${m}${unitLabels.minute}`;
}
