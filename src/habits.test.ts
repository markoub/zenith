import { describe, it, expect } from "vitest";
import {
  createHabit,
  toggleCompletion,
  isCompletedOn,
  dayStr,
  completionsInRange,
  last7Count,
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

describe("completionsInRange", () => {
  it("returns 0 for a habit with no completions", () => {
    const h = createHabit("Test");
    expect(completionsInRange(h, "2026-06-01", "2026-06-07")).toBe(0);
  });

  it("counts completions strictly inside the range", () => {
    let h = createHabit("Test");
    h = toggleCompletion(h, "2026-06-03");
    h = toggleCompletion(h, "2026-06-05");
    expect(completionsInRange(h, "2026-06-01", "2026-06-07")).toBe(2);
  });

  it("includes completions on the boundary dates", () => {
    let h = createHabit("Test");
    h = toggleCompletion(h, "2026-06-01");
    h = toggleCompletion(h, "2026-06-07");
    expect(completionsInRange(h, "2026-06-01", "2026-06-07")).toBe(2);
  });

  it("excludes completions outside the range", () => {
    let h = createHabit("Test");
    h = toggleCompletion(h, "2026-05-31"); // before fromDay
    h = toggleCompletion(h, "2026-06-08"); // after toDay
    expect(completionsInRange(h, "2026-06-01", "2026-06-07")).toBe(0);
  });

  it("counts only the completions within range when some are outside", () => {
    let h = createHabit("Test");
    h = toggleCompletion(h, "2026-05-30");
    h = toggleCompletion(h, "2026-06-02");
    h = toggleCompletion(h, "2026-06-04");
    h = toggleCompletion(h, "2026-06-10");
    expect(completionsInRange(h, "2026-06-01", "2026-06-07")).toBe(2);
  });
});

describe("last7Count", () => {
  const today = "2026-06-10";

  it("returns 0 for a habit with no completions", () => {
    const h = createHabit("Test");
    expect(last7Count(h, today)).toBe(0);
  });

  it("counts all 7 days when every day in the window is completed", () => {
    let h = createHabit("Test");
    for (let d = 4; d <= 10; d++) {
      h = toggleCompletion(h, `2026-06-${String(d).padStart(2, "0")}`);
    }
    expect(last7Count(h, today)).toBe(7);
  });

  it("counts partial completions within the 7-day window", () => {
    let h = createHabit("Test");
    h = toggleCompletion(h, "2026-06-05");
    h = toggleCompletion(h, "2026-06-09");
    h = toggleCompletion(h, "2026-06-10");
    expect(last7Count(h, today)).toBe(3);
  });

  it("excludes completions before the 7-day window", () => {
    let h = createHabit("Test");
    h = toggleCompletion(h, "2026-06-03"); // 8 days before today — outside window
    h = toggleCompletion(h, "2026-06-08");
    expect(last7Count(h, today)).toBe(1);
  });

  it("includes the boundary day (7 days ago)", () => {
    let h = createHabit("Test");
    h = toggleCompletion(h, "2026-06-04"); // exactly 6 days before today — inside window
    expect(last7Count(h, today)).toBe(1);
  });
});
