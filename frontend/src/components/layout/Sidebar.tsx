import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { navItems } from "./navigation"

export function Sidebar() {
  const location = useLocation()
  const pathname = location.pathname

  return (
    <aside className="sticky top-0 hidden md:flex h-screen w-[244px] shrink-0 flex-col bg-[#15392d] px-4 py-7 text-white lg:w-[264px]">
      <div className="flex items-center gap-3 px-3 mb-11">
        <div className="flex h-11 w-11 overflow-hidden items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
          <img src="/panda.jpg" alt="Panda Logo" className="h-full w-full object-cover" />
        </div>
        <span className="font-['Manrope'] text-lg font-extrabold tracking-tight">
          PandaBudget
        </span>
      </div>
      <div className="px-3 mb-4 font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-[.18em] text-white/45">Workspace</div>
      <nav className="flex-1 space-y-1" aria-label="Main navigation">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors duration-150 focus-visible:outline-offset-[-2px]",
                isActive
                  ? "bg-white text-[#15392d]"
                  : "text-white/65 hover:bg-white/10 hover:text-white"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon className="h-[18px] w-[18px]" strokeWidth={1.9} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto mx-3 border-t border-white/15 pt-5">
        <p className="font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-[.14em] text-white/45">Your money, clearly.</p>
      </div>
    </aside>
  )
}
