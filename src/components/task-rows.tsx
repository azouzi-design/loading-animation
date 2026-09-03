"use client";

import { useEffect, useState } from "react";

/* ─────────────────────────────────────────────────────────
 * TASK ROWS — sequential checklist loader
 *
 * Tasks resolve one at a time: the active row's ring spins,
 * then flips to a green check before the next row starts.
 * Runs once per mount — the parent owns looping (e.g. by
 * remounting on a cycle timer).
 * ───────────────────────────────────────────────────────── */

export type Task = { key: string; label: string };

const DEFAULT_TASKS: Task[] = [
  { key: "signin", label: "Signing in to your Harps app" },
  { key: "loading", label: "Loading x, y, z" },
  { key: "customize", label: "Customizing your meals" },
  { key: "personalize", label: "Personalizing your suggestions" },
];

function useSequentialTasks(count: number, runMs: number, gapMs: number, startDelayMs: number) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [doneCount, setDoneCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    function step(i: number) {
      if (cancelled) return;
      setActiveIndex(i);
      timers.push(
        setTimeout(() => {
          if (cancelled) return;
          setDoneCount(i + 1);
          if (i + 1 < count) {
            timers.push(setTimeout(() => step(i + 1), gapMs));
          }
        }, runMs),
      );
    }

    timers.push(setTimeout(() => step(0), startDelayMs));
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [count, runMs, gapMs, startDelayMs]);

  return { activeIndex, doneCount };
}

function SpinnerRing({ active, children }: { active?: boolean; children?: React.ReactNode }) {
  const size = 24, stroke = 2;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <span className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size} height={size} className="absolute inset-0"
        style={active ? { animation: "spin 1.1s linear infinite" } : undefined}
      >
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth={stroke} />
        {active && (
          <circle
            cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke="var(--ink-3)" strokeWidth={stroke} strokeLinecap="round"
            strokeDasharray={`${c * 0.28} ${c * 0.72}`}
          />
        )}
      </svg>
      <span className="relative text-[10.5px] font-semibold tabular-nums text-ink">{children}</span>
    </span>
  );
}

function CheckBadge() {
  return (
    <span
      className="flex size-5.5 shrink-0 items-center justify-center rounded-full bg-green text-white"
      style={{ animation: "pop-in 300ms cubic-bezier(0.23,1,0.32,1) both" }}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    </span>
  );
}

export default function TaskRows({
  tasks = DEFAULT_TASKS,
  className,
  runMs = 1500,
  gapMs = 350,
  startDelayMs = 0,
}: {
  tasks?: Task[];
  className?: string;
  runMs?: number;
  gapMs?: number;
  startDelayMs?: number;
}) {
  const { activeIndex, doneCount } = useSequentialTasks(tasks.length, runMs, gapMs, startDelayMs);

  return (
    <div className={`flex w-full max-w-[360px] flex-col gap-2${className ? ` ${className}` : ""}`}>
      {tasks.map((task, i) => {
        const done = i < doneCount;
        const running = !done && i === activeIndex;
        return (
          <div
            key={task.key}
            className="flex h-11 items-center gap-2.5 rounded-card bg-surface px-2.5 shadow-card"
            style={{ animation: `fade-up 450ms cubic-bezier(0.23,1,0.32,1) ${startDelayMs + i * 80}ms both` }}
          >
            <span className="flex size-6 shrink-0 items-center justify-center">
              {done ? <CheckBadge /> : <SpinnerRing active={running}>{i + 1}</SpinnerRing>}
            </span>
            <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-ink">
              {task.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
