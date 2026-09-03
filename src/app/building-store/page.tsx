"use client";

import Image from "next/image";
import { type CSSProperties } from "react";
import TaskRows from "@/components/task-rows";

export default function BuildingStorePage() {
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

      <div className="absolute inset-0 z-10 flex -translate-y-10 flex-col items-center justify-center gap-5 px-6">
        <svg width="36" height="36" viewBox="0 0 36 36" style={{ animation: "spin 0.9s linear infinite" }}>
          <circle cx="18" cy="18" r="16" fill="none" stroke="var(--line)" strokeWidth="3" />
          <circle
            cx="18" cy="18" r="16" fill="none"
            stroke="var(--ink)" strokeWidth="3" strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 16 * 0.28} ${2 * Math.PI * 16 * 0.72}`}
          />
        </svg>

        <h1
          className="text-center text-[20px] font-semibold text-ink"
          style={{ fontFamily: "var(--font-plex-serif)" }}
        >
          Building your personal experience
        </h1>

        <TaskRows />
      </div>
    </div>
  );
}
