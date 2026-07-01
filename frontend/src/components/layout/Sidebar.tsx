import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, ReceiptText, WalletCards, PieChart, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Transactions", href: "/transactions", icon: ReceiptText },
  { name: "Reports", href: "/reports", icon: PieChart },
  { name: "Budget", href: "/budget", icon: WalletCards },
]

export function Sidebar() {
  const location = useLocation()
  const pathname = location.pathname

  return (
    <aside className="sticky top-0 hidden md:flex h-screen w-64 flex-col border-r border-border/50 bg-card/60 backdrop-blur-2xl px-4 py-6 shadow-2xl z-50">
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="flex h-10 w-10 overflow-hidden items-center justify-center rounded-xl bg-black border border-primary/30 shadow-[0_0_15px_rgba(46,204,113,0.3)]">
          <img src="/panda.jpg" alt="Panda Logo" className="h-full w-full object-cover" />
        </div>
        <span className="text-xl font-bold tracking-tight text-primary drop-shadow-[0_0_8px_rgba(46,204,113,0.5)]">
          PandaBudget
        </span>
      </div>
      
      <nav className="flex-1 space-y-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-300",
                isActive
                  ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_10px_rgba(46,204,113,0.1)] translate-x-1"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground hover:translate-x-1"
              )}
            >
              <item.icon className={cn("h-5 w-5 transition-colors", isActive ? "text-primary" : "text-muted-foreground")} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-border/50">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-muted-foreground transition-all duration-300 hover:bg-secondary/60 hover:text-foreground hover:translate-x-1">
          <Settings className="h-5 w-5 text-muted-foreground" />
          Settings
        </button>
      </div>
    </aside>
  )
}
