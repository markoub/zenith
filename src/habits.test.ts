import { describe, it, expect } from "vitest";
import {
  createHabit,
  toggleCompletion,
  isCompletedOn,
  dayStr,
} from "./habits";

describe("createHabit", () => {
  it("creates a habit with a trimmed name and no completions", () => {
    const h = createHabit("  Drink water  ");
    expect(h.name).toBe("Drink water");
    expect(h.completions).toEqual([]);
    expect(h.id).toBeTruthy();
  });

  it("throws on an empty name", () => {
    expect(() => createHabit("   ")).toThrow(/empty/i);
  });
});

describe("toggleCompletion", () => {
  it("marks a day complete, then clears it", () => {
    let h = createHabit("Read");
    h = toggleCompletion(h, "2026-06-02");
    expect(isCompletedOn(h, "2026-06-02")).toBe(true);
    h = toggleCompletion(h, "2026-06-02");
    expect(isCompletedOn(h, "2026-06-02")).toBe(false);
  });

  it("keeps completions sorted and does not mutate the original", () => {
    const h0 = createHabit("Stretch");
    const h1 = toggleCompletion(h0, "2026-06-03");
    const h2 = toggleCompletion(h1, "2026-06-01");
    expect(h2.completions).toEqual(["2026-06-01", "2026-06-03"]);
    expect(h0.completions).toEqual([]); // original untouched
  });
});

describe("dayStr", () => {
  it("formats a date as YYYY-MM-DD", () => {
    expect(dayStr(new Date(2026, 5, 2))).toBe("2026-06-02");
  });
});
