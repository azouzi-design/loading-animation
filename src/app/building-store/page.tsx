"use client";

import Image from "next/image";
import { useEffect, useState, type CSSProperties } from "react";
import TaskRows, { type Task } from "@/components/task-rows";

/* Cycle: logo slides in over LOGO_MS, then the title and the
 * 3 steps (RUN_MS run + GAP_MS gap each) resolve, leaving a
 * HOLD_MS pause so step 3's checkmark is actually visible
 * before the whole group remounts and replays — total is
 * 1000 + (3 * 1000 + 2 * 150) + 700 = 5000ms. */
const LOGO_MS = 1000;
const RUN_MS = 1000;
const GAP_MS = 150;
const HOLD_MS = 700;
const CYCLE_MS = LOGO_MS + 3 * RUN_MS + 2 * GAP_MS + HOLD_MS;

const TASKS: Task[] = [
  { key: "signin", label: "Logging you into SmartMeals" },
  { key: "link", label: "Linking to your Harps loyalty" },
  { key: "personalize", label: "Personalizing for you" },
];

function useCycleKey(intervalMs: number) {
  const [key, setKey] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setKey((k) => k + 1), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return key;
}

export default function BuildingStorePage() {
  const cycleKey = useCycleKey(CYCLE_MS);

  return (
    <div
      className="relative flex flex-1 flex-col items-center justify-center px-6"
      style={
        {
          background: "#f9f9f9",
          "--ink": "#594F4C",
          "--ink-3": "color-mix(in srgb, #594F4C 45%, white)",
          "--surface": "#ffffff",
          "--line": "#e8e8e8",
          "--green": "#16a34a",
          "--green-tint": "#dcfce7",
        } as CSSProperties
      }
    >
      <Image
        src="/app-image.png"
        alt=""
        height={800}
        width={369}
        className="relative z-0 h-[800px] w-auto"
        priority
      />

      <div
        key={cycleKey}
        className="absolute inset-0 z-10 flex -translate-y-[60px] flex-col items-center justify-center gap-5 px-6"
      >
        <Image
          src="/logo-smartmeals.png"
          alt="SmartMeals"
          height={120}
          width={168}
          className="h-[120px] w-auto"
          style={{ animation: `short-slide-down ${LOGO_MS}ms ease-out both` }}
          priority
        />

        <h1
          className="text-center text-[20px] font-semibold text-ink"
          style={{
            fontFamily: "var(--font-plex-serif)",
            animation: `fade-up 400ms cubic-bezier(0.23,1,0.32,1) ${LOGO_MS}ms both`,
          }}
        >
          Building your personal experience
        </h1>

        <TaskRows tasks={TASKS} runMs={RUN_MS} gapMs={GAP_MS} startDelayMs={LOGO_MS} />
      </div>
    </div>
  );
}
