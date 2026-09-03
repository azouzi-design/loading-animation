"use client";

import { useEffect, useState } from "react";

/* ─────────────────────────────────────────────────────────
 * TASK ROWS — sequential checklist loader
 *
 * Tasks resolve one at a time: the active row's ring spins,
 * then flips to a green check and a "Completed" pill before
 * the next row starts. Once every row is done, the sequence
 * pauses briefly and loops from the top.
 * ───────────────────────────────────────────────────────── */

const RUN_MS = 1500;
const GAP_MS = 350;
const LOOP_PAUSE_MS = 1400;

export type Task = { key: string; label: string };

export type TaskRowsLabels = { completed: string };

const DEFAULT_LABELS: TaskRowsLabels = { completed: "Completed" };

const DEFAULT_TASKS: Task[] = [
  { key: "signin", label: "Signing in to your Harps app" },
  { key: "loading", label: "Loading x, y, z" },
  { key: "customize", label: "Customizing your meals" },
  { key: "personalize", label: "Personalizing your suggestions" },
];

function useSequentialTasks(count: number) {
  const [activeIndex, setActiveIndex] = useState(0);
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
          timers.push(
            setTimeout(() => {
              if (cancelled) return;
              if (i + 1 < count) {
                step(i + 1);
              } else {
                timers.push(setTimeout(runCycle, LOOP_PAUSE_MS));
              }
            }, GAP_MS),
          );
        }, RUN_MS),
      );
    }

    function runCycle() {
      if (cancelled) return;
      setDoneCount(0);
      step(0);
    }

    runCycle();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [count]);

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
  labels,
  className,
}: {
  tasks?: Task[];
  labels?: Partial<TaskRowsLabels>;
  className?: string;
}) {
  const { activeIndex, doneCount } = useSequentialTasks(tasks.length);
  const copy = { ...DEFAULT_LABELS, ...labels };

  return (
    <div className={`flex w-full max-w-[360px] flex-col gap-2${className ? ` ${className}` : ""}`}>
      {tasks.map((task, i) => {
        const done = i < doneCount;
        const running = !done && i === activeIndex;
        return (
          <div
            key={task.key}
            className="flex h-11 items-center gap-2.5 rounded-card bg-surface px-2.5 shadow-card"
            style={{ animation: `fade-up 450ms cubic-bezier(0.23,1,0.32,1) ${i * 80}ms both` }}
          >
            <span className="flex size-6 shrink-0 items-center justify-center">
              {done ? <CheckBadge /> : <SpinnerRing active={running}>{i + 1}</SpinnerRing>}
            </span>
            <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-ink">
              {task.label}
            </span>
            {done && (
              <span
                className="inline-flex h-5.5 shrink-0 items-center rounded-full bg-green-tint px-2 text-[11.5px] font-medium text-green"
                style={{ animation: "fade-in 200ms ease-out both" }}
              >
                {copy.completed}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
