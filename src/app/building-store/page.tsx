"use client";

import Image from "next/image";
import { useEffect, useState, type CSSProperties } from "react";
import { LoaderGrid, PATTERNS } from "@/components/loading-state";

const COUNTDOWN_FROM = 6;

function useCountdown(from: number) {
  const [ds, setDs] = useState(from * 10);
  useEffect(() => {
    const t = setInterval(() => {
      setDs((d) => (d <= 0 ? from * 10 : d - 1));
    }, 100);
    return () => clearInterval(t);
  }, [from]);
  return (ds / 10).toFixed(1);
}

export default function BuildingStorePage() {
  const remaining = useCountdown(COUNTDOWN_FROM);

  return (
    <div
      className="relative flex flex-1 flex-col items-center justify-center px-6"
      style={
        {
          background: "#f9f9f9",
          "--ink": "#594F4C",
          "--ink-3": "color-mix(in srgb, #594F4C 45%, white)",
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

      <div className="absolute inset-0 z-10 flex scale-[1.32] items-center justify-center gap-2.5">
        <LoaderGrid {...PATTERNS.Drive} />
        <span
          className="bg-clip-text text-[13px] font-medium text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(90deg, var(--ink-3) 35%, var(--ink) 50%, var(--ink-3) 65%)",
            backgroundSize: "200% 100%",
            animation: "shimmer-text 1.4s linear infinite",
          }}
        >
          building store in progress
        </span>
        <span className="font-mono text-[12px] text-ink-3 tabular-nums">{remaining}s</span>
      </div>
    </div>
  );
}
