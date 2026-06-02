import "./style.css";
import {
  type Habit,
  createHabit,
  toggleCompletion,
  isCompletedOn,
  dayStr,
  currentStreak,
} from "./habits";

const STORAGE_KEY = "zenith.habits.v1";

function load(): Habit[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Habit[]) : [];
  } catch {
    return [];
  }
}

function save(habits: Habit[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
}

let habits: Habit[] = load();

function render(): void {
  const app = document.querySelector<HTMLDivElement>("#app")!;
  const today = dayStr();

  app.innerHTML = `
    <main class="wrap">
      <header>
        <h1>✦ Zenith</h1>
        <p class="tagline">Small steps, every day.</p>
      </header>

      <form id="add" autocomplete="off">
        <input id="name" placeholder="New habit, e.g. Drink water" aria-label="New habit" />
        <button type="submit">Add</button>
      </form>

      <ul class="habits">
        ${
          habits.length === 0
            ? `<li class="empty">No habits yet — add your first one above.</li>`
            : habits
                .map((h) => {
                  const done = isCompletedOn(h, today);
                  const streak = currentStreak(h, today);
                  const streakHtml =
                    streak === 0
                      ? ""
                      : `<span class="streak">${streak}${streak >= 3 ? " 🔥" : ""}</span>`;
                  return `
                    <li class="${done ? "done" : ""}">
                      <button class="check" data-id="${h.id}" aria-label="Toggle ${h.name}">
                        ${done ? "✓" : ""}
                      </button>
                      <span class="hname">${escapeHtml(h.name)}</span>
                      ${streakHtml}
                      <button class="del" data-del="${h.id}" aria-label="Delete ${h.name}">×</button>
                    </li>`;
                })
                .join("")
        }
      </ul>

      <footer>Built end-to-end by an autonomous Claude SDLC pipeline.</footer>
    </main>
  `;

  app.querySelector<HTMLFormElement>("#add")!.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = app.querySelector<HTMLInputElement>("#name")!;
    const name = input.value.trim();
    if (!name) return;
    habits = [...habits, createHabit(name)];
    save(habits);
    render();
  });

  app.querySelectorAll<HTMLButtonElement>(".check").forEach((btn) =>
    btn.addEventListener("click", () => {
      const id = btn.dataset.id!;
      habits = habits.map((h) =>
        h.id === id ? toggleCompletion(h, today) : h,
      );
      save(habits);
      render();
    }),
  );

  app.querySelectorAll<HTMLButtonElement>(".del").forEach((btn) =>
    btn.addEventListener("click", () => {
      const id = btn.dataset.del!;
      habits = habits.filter((h) => h.id !== id);
      save(habits);
      render();
    }),
  );
}

function escapeHtml(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
}

render();
