import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { navItems } from "./navigation"

export function BottomNav() {
  const location = useLocation()
  const pathname = location.pathname

  return (
    <nav aria-label="Main navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex min-h-16 items-center justify-around border-t border-border bg-card/95 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_rgba(18,48,31,0.06)] backdrop-blur-xl">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              "flex min-h-14 min-w-[70px] flex-col items-center justify-center gap-1 rounded-xl px-1 transition-colors",
              isActive ? "text-primary bg-accent" : "text-muted-foreground hover:text-foreground"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <item.icon className="h-5 w-5" strokeWidth={1.9} />
            <span className="text-[11px] font-semibold">{item.name}</span>
          </Link>
        )
      })}
    </nav>
  )
}
