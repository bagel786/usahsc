"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

type Tab = { id: string; label: string; count?: number; content: React.ReactNode };

export function TabSwitch({ tabs, initial }: { tabs: Tab[]; initial?: string }) {
  const [active, setActive] = useState(initial ?? tabs[0]?.id);

  return (
    <div>
      <div className="mb-8 inline-flex rounded-xl border border-line bg-surface/60 p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={cn(
              "rounded-lg px-5 py-2 font-display text-sm font-semibold uppercase tracking-wide transition-colors",
              active === t.id
                ? "bg-brand text-white"
                : "text-muted hover:text-heading",
            )}
          >
            {t.label}
            {typeof t.count === "number" && (
              <span className="ml-2 text-xs opacity-70">{t.count}</span>
            )}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div key={t.id} hidden={active !== t.id}>
          {t.content}
        </div>
      ))}
    </div>
  );
}
