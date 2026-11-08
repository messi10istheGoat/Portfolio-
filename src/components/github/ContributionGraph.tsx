"use client";

import { useState } from "react";
import type { ContributionDay } from "@/lib/github";
import { cn } from "@/lib/utils";

const levelClass: Record<number, string> = {
  0: "bg-white/[0.055]",
  1: "bg-accent/25",
  2: "bg-accent/45",
  3: "bg-accent/70",
  4: "bg-accent",
};

const dayLabels = ["", "MON", "", "WED", "", "FRI", ""];

export function ContributionGraph({
  weeks,
  months,
  total,
}: {
  weeks: ContributionDay[][];
  months: { label: string; column: number }[];
  total: number;
}) {
  const [hovered, setHovered] = useState<ContributionDay | null>(null);

  return (
    <div className="relative">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-sans text-[14px] text-fog">
          {hovered ? (
            <>
              <span className="tabular-nums text-bone">{hovered.count}</span>{" "}
              {hovered.count === 1 ? "contribution" : "contributions"} on{" "}
              <span className="text-bone">{hovered.date}</span>
            </>
          ) : (
            <>
              <span className="tabular-nums text-bone">{total.toLocaleString()}</span> contributions in
              the last year
            </>
          )}
        </p>
        <div className="flex items-center gap-1.5">
          <span className="font-sans text-[13px] text-fog">Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <span key={level} className={cn("h-2.5 w-2.5", levelClass[level])} />
          ))}
          <span className="font-sans text-[13px] text-fog">More</span>
        </div>
      </div>

      <div className="thin-scroll mt-3 overflow-x-auto pb-1">
        <div className="min-w-[640px]">
          <div className="relative mb-1.5 h-5">
            {months.map((month) => (
              <span
                key={`${month.label}-${month.column}`}
                className="mono-sm absolute top-0 text-[14px] text-fog"
                style={{ left: `${(month.column / weeks.length) * 100}%` }}
              >
                {month.label}
              </span>
            ))}
          </div>

          <div className="flex gap-1">
            <div className="mr-1 flex flex-col justify-between py-0.5">
              {dayLabels.map((label, index) => (
                <span key={index} className="mono-sm h-[15px] text-[14px] leading-[15px] text-fog/70">
                  {label}
                </span>
              ))}
            </div>

            <div className="flex flex-1 gap-[3px]" role="img" aria-label={`GitHub contribution heatmap: ${total} total contributions across ${weeks.length} weeks`}>
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-1 flex-col gap-[3px]">
                  {week.map((day) => (
                    <div
                      key={day.date}
                      className={cn(
                        "aspect-square w-full min-w-[7px] transition-[transform,background-color] duration-150",
                        levelClass[day.level],
                        hovered?.date === day.date && "ring-1 ring-white/70",
                        day.count > 0 && "hover:scale-[1.25]",
                      )}
                      onMouseEnter={() => setHovered(day)}
                      onMouseLeave={() => setHovered(null)}
                      title={`${day.date} — ${day.count} contribution${day.count === 1 ? "" : "s"}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
