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

function shiftDay(day: string, delta: number): string {
  const d = new Date(day + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + delta);
  return d.toISOString().slice(0, 10);
}

/**
 * Count how many of the habit's completions fall within [fromDay, toDay] inclusive.
 * Both bounds are ISO-8601 date strings (YYYY-MM-DD).
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
  return completionsInRange(habit, shiftDay(today, -6), today);
}
