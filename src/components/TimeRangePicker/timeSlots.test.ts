import { describe, it, expect } from "vitest";
import { pad2, toMinutes, toTime, buildSlots, formatDuration, DEFAULT_BUSINESS_HOURS } from "./timeSlots";

describe("pad2", () => {
  it("pads single digits with a leading zero", () => {
    expect(pad2(5)).toBe("05");
  });

  it("leaves two-digit numbers unchanged", () => {
    expect(pad2(15)).toBe("15");
  });
});

describe("toMinutes / toTime", () => {
  it("converts HH:mm to minutes since midnight", () => {
    expect(toMinutes("10:30")).toBe(630);
  });

  it("converts minutes since midnight back to HH:mm", () => {
    expect(toTime(630)).toBe("10:30");
  });

  it("round-trips", () => {
    expect(toTime(toMinutes("14:45"))).toBe("14:45");
  });
});

describe("buildSlots", () => {
  it("builds slots from openHour to closeHour at stepMin increments, using the default business hours", () => {
    const { openHour, closeHour, stepMin } = DEFAULT_BUSINESS_HOURS;
    const slots = buildSlots();
    expect(slots[0]).toBe(toTime(openHour * 60));
    expect(slots[slots.length - 1]).toBe(toTime(closeHour * 60));
    expect(slots).toHaveLength(((closeHour - openHour) * 60) / stepMin + 1);
  });

  it("respects a custom business-hours override", () => {
    const slots = buildSlots({ openHour: 8, closeHour: 9, stepMin: 30 });
    expect(slots).toEqual(["08:00", "08:30", "09:00"]);
  });
});

describe("formatDuration", () => {
  it("formats minutes under an hour with the default English unit labels", () => {
    expect(formatDuration(45)).toBe("45m");
  });

  it("formats whole hours without a minutes suffix", () => {
    expect(formatDuration(120)).toBe("2h");
  });

  it("formats hours with remaining minutes", () => {
    expect(formatDuration(150)).toBe("2h 30m");
  });

  it("clamps negative durations to 0", () => {
    expect(formatDuration(-30)).toBe("0m");
  });

  it("accepts custom unit labels", () => {
    expect(formatDuration(150, { hour: "ч", minute: "м" })).toBe("2ч 30м");
  });
});
