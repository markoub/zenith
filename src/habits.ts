// Core habit-tracking logic for Zenith.
//
// This module is intentionally pure (no DOM, no storage) so it is trivially
// unit-testable. The SDLC pipeline grows this file feature-by-feature as
// requirements land in Obsidian and flow through to GitHub issues.

export interface Habit {
  id: string;
  name: string;
  createdAt: string; // YYYY-MM-DD
  completions: string[]; // sorted list of YYYY-MM-DD the habit was completed
}

let _seq = 0;

/** Format a Date as a local YYYY-MM-DD string. */
export function dayStr(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Create a new habit. Throws on an empty name. */
export function createHabit(name: string, now: Date = new Date()): Habit {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Habit name cannot be empty");
  return {
    id: `${now.getTime()}-${_seq++}`,
    name: trimmed,
    createdAt: dayStr(now),
    completions: [],
  };
}

/** Whether the habit was completed on a given YYYY-MM-DD. */
export function isCompletedOn(habit: Habit, day: string): boolean {
  return habit.completions.includes(day);
}

/** Toggle completion for a given day, returning a new Habit (immutable). */
export function toggleCompletion(habit: Habit, day: string): Habit {
  const completions = isCompletedOn(habit, day)
    ? habit.completions.filter((d) => d !== day)
    : [...habit.completions, day].sort();
  return { ...habit, completions };
}

export function shiftDay(day: string, delta: number): string {
  const d = new Date(day + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + delta);
  return d.toISOString().slice(0, 10);
}

/**
 * Count of consecutive completed days ending on or just before `today`.
 * If `today` is not completed but yesterday is, the streak runs through yesterday.
 * Returns 0 when neither today nor yesterday is completed.
 */
export function currentStreak(habit: Habit, today: string): number {
  const set = new Set(habit.completions);
  let day = today;
  if (!set.has(day)) {
    day = shiftDay(day, -1);
    if (!set.has(day)) return 0;
  }
  let count = 0;
  while (set.has(day)) {
    count++;
    day = shiftDay(day, -1);
  }
  return count;
}

/**
 * Count completions whose date falls within [fromDay, toDay] inclusive.
 * Both arguments are YYYY-MM-DD strings; ISO lexicographic order is used.
 */
export function completionsInRange(
  habit: Habit,
  fromDay: string,
  toDay: string
): number {
  return habit.completions.filter((d) => d >= fromDay && d <= toDay).length;
}

/**
 * Count completions in the 7-day window ending on (and including) `today`.
 */
export function last7Count(habit: Habit, today: string): number {
  const sevenDaysAgo = shiftDay(today, -6);
  return completionsInRange(habit, sevenDaysAgo, today);
}

/**
 * Length of the longest run of consecutive completed days ever recorded.
 * Returns 0 for a habit with no completions.
 */
export function bestStreak(habit: Habit): number {
  if (habit.completions.length === 0) return 0;
  const sorted = [...habit.completions].sort();
  let best = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === shiftDay(sorted[i - 1], 1)) {
      run++;
      if (run > best) best = run;
    } else {
      run = 1;
    }
  }
  return best;
}
