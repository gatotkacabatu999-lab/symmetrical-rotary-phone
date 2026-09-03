"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface SwitchProps {
  id?: string
  size?: "sm" | "default"
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

/**
 * Lightweight toggle switch — replaces the primereact/inputswitch dependency
 * which is not available in PrimeReact v11's package structure.
 */
const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ id, size = "default", checked = false, onCheckedChange, disabled, className }, ref) => {
    const isSmall = size === "sm"
    return (
      <button
        ref={ref}
        id={id}
        role="switch"
        type="button"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onCheckedChange?.(!checked)}
        className={cn(
          "relative inline-flex shrink-0 items-center rounded-full border p-0.5 transition-all duration-200 ease-in-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-50",
          checked
            ? "border-emerald-500 bg-emerald-500 shadow-[0_6px_16px_rgba(16,185,129,0.28)]"
            : "border-slate-300 bg-slate-300 shadow-inner dark:border-slate-600 dark:bg-slate-700",
          isSmall ? "h-5 w-9" : "h-7 w-12",
          className,
        )}
      >
        <span
          className={cn(
            "pointer-events-none block rounded-full border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.18)] transition-all duration-200 ease-in-out",
            "dark:border-slate-300/80 dark:bg-slate-50",
            isSmall ? "h-3.5 w-3.5" : "h-5.5 w-5.5",
            checked ? (isSmall ? "translate-x-4" : "translate-x-5") : "translate-x-0",
          )}
        />
      </button>
    )
  },
)
Switch.displayName = "Switch"

export { Switch }
