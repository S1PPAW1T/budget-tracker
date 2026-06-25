import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, ReceiptText, WalletCards, PieChart } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Transactions", href: "/transactions", icon: ReceiptText },
  { name: "Reports", href: "/reports", icon: PieChart },
  { name: "Budget", href: "/budget", icon: WalletCards },
]

export function BottomNav() {
  const location = useLocation()
  const pathname = location.pathname

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-border/50 bg-card/90 backdrop-blur-2xl px-2 shadow-[0_-5px_15px_rgba(0,0,0,0.2)]">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 w-16 h-full transition-all duration-300",
              isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] font-semibold">{item.name}</span>
          </Link>
        )
      })}
    </nav>
  )
}
