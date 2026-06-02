import { describe, it, expect } from "vitest";
import {
  createHabit,
  toggleCompletion,
  isCompletedOn,
  dayStr,
  currentStreak,
  bestStreak,
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

describe("currentStreak", () => {
  const today = "2026-06-10";

  it("returns 0 for empty habit", () => {
    const h = createHabit("Test");
    expect(currentStreak(h, today)).toBe(0);
  });

  it("returns 1 when only today is completed", () => {
    let h = createHabit("Test");
    h = toggleCompletion(h, today);
    expect(currentStreak(h, today)).toBe(1);
  });

  it("returns 1 when only yesterday is completed and today is not", () => {
    let h = createHabit("Test");
    h = toggleCompletion(h, "2026-06-09");
    expect(currentStreak(h, today)).toBe(1);
  });

  it("returns 0 when last completion was two days ago", () => {
    let h = createHabit("Test");
    h = toggleCompletion(h, "2026-06-08");
    expect(currentStreak(h, today)).toBe(0);
  });

  it("counts an active streak of several days ending today", () => {
    let h = createHabit("Test");
    h = toggleCompletion(h, "2026-06-08");
    h = toggleCompletion(h, "2026-06-09");
    h = toggleCompletion(h, "2026-06-10");
    expect(currentStreak(h, today)).toBe(3);
  });

  it("only counts the consecutive tail — ignores older completions after a gap", () => {
    let h = createHabit("Test");
    h = toggleCompletion(h, "2026-06-01"); // gap
    h = toggleCompletion(h, "2026-06-09");
    h = toggleCompletion(h, "2026-06-10");
    expect(currentStreak(h, today)).toBe(2);
  });
});

describe("bestStreak", () => {
  it("returns 0 for empty habit", () => {
    const h = createHabit("Test");
    expect(bestStreak(h)).toBe(0);
  });

  it("returns 1 for a single completion", () => {
    let h = createHabit("Test");
    h = toggleCompletion(h, "2026-06-10");
    expect(bestStreak(h)).toBe(1);
  });

  it("returns 1 when there is only one completion (yesterday)", () => {
    let h = createHabit("Test");
    h = toggleCompletion(h, "2026-06-09");
    expect(bestStreak(h)).toBe(1);
  });

  it("counts a streak broken in the middle correctly", () => {
    let h = createHabit("Test");
    h = toggleCompletion(h, "2026-06-01");
    h = toggleCompletion(h, "2026-06-02");
    h = toggleCompletion(h, "2026-06-03");
    // gap
    h = toggleCompletion(h, "2026-06-07");
    h = toggleCompletion(h, "2026-06-08");
    expect(bestStreak(h)).toBe(3);
  });

  it("returns the length of a long active streak", () => {
    let h = createHabit("Test");
    for (let d = 5; d <= 10; d++) {
      h = toggleCompletion(h, `2026-06-${String(d).padStart(2, "0")}`);
    }
    expect(bestStreak(h)).toBe(6);
  });

  it("returns the best past run when current run is shorter", () => {
    let h = createHabit("Test");
    // Past best: 4 days
    h = toggleCompletion(h, "2026-05-01");
    h = toggleCompletion(h, "2026-05-02");
    h = toggleCompletion(h, "2026-05-03");
    h = toggleCompletion(h, "2026-05-04");
    // Current run: 2 days
    h = toggleCompletion(h, "2026-06-09");
    h = toggleCompletion(h, "2026-06-10");
    expect(bestStreak(h)).toBe(4);
  });
});
