import LoadingState from "@/components/loading-state";

const VARIANTS = ["Drive", "Dots", "Orbit", "Surfer"] as const;

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-24 dark:bg-black">
      <main className="flex w-full max-w-md flex-col gap-10">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
            Loading state
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Pixel-grid loader for long-running work.
          </p>
        </div>

        <div className="flex flex-col gap-8 rounded-xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
          {VARIANTS.map((variant) => (
            <div key={variant} className="flex flex-col gap-2">
              <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-600">
                {variant}
              </span>
              <LoadingState variant={variant} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
