import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/context/ThemeContext"
import { cn } from "@/lib/utils"

export function ThemeToggle({ sidebar = false }: { sidebar?: boolean }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === "dark"

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Dark mode"
      aria-pressed={isDark}
      className={cn(
        "inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-semibold transition-colors focus-visible:outline-offset-2",
        sidebar
          ? "w-full border-white/25 text-white hover:bg-white/10 focus-visible:outline-white"
          : "border-border bg-card text-foreground hover:bg-accent"
      )}
    >
      {isDark ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
      <span className="hidden min-[420px]:inline md:inline">Dark mode</span>
    </button>
  )
}
