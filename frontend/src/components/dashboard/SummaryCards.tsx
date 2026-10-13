import { useBudget } from "@/context/BudgetContext"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react"

export function SummaryCards() {
  const { transactions, selectedMonth } = useBudget()
  const currentMonth = transactions.filter(tx => tx.date.slice(0, 7) === selectedMonth)
  const totalIncome = currentMonth.filter(tx => tx.type === "Income").reduce((sum, tx) => sum + tx.amount, 0)
  const totalExpense = currentMonth.filter(tx => tx.type === "Expense").reduce((sum, tx) => sum + tx.amount, 0)
  const totalBalance = transactions.reduce((sum, tx) => sum + (tx.type === "Income" ? tx.amount : -tx.amount), 0)

  return (
    <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3" aria-label="Money overview">
      <Card className="balance-card min-h-[190px] overflow-hidden lg:col-span-2 xl:col-span-1">
        <CardContent className="relative flex h-full flex-col justify-between p-6 md:p-7">
          <div className="flex items-start justify-between">
            <span className="font-['IBM_Plex_Mono'] text-[11px] font-semibold uppercase tracking-[.16em] text-white/65">Total balance</span>
            <span className="rounded-xl bg-white/10 p-2.5 text-white/90"><Wallet className="h-[18px] w-[18px]" /></span>
          </div>
          <div>
            <p className="money mt-7 text-[clamp(2rem,3vw,2.9rem)] font-extrabold leading-none text-white">฿{totalBalance.toLocaleString()}</p>
            <p className="mt-3 text-xs text-white/60">Across all recorded transactions</p>
          </div>
        </CardContent>
      </Card>

      <Card className="min-h-[190px]">
        <CardContent className="flex h-full flex-col justify-between p-6 md:p-7">
          <div className="flex items-start justify-between">
            <span className="font-['IBM_Plex_Mono'] text-[11px] font-semibold uppercase tracking-[.16em] text-muted-foreground">Income this month</span>
            <span className="rounded-xl bg-[#e9f6ef] p-2.5 text-[#187a55]"><ArrowDownLeft className="h-[18px] w-[18px]" /></span>
          </div>
          <div>
            <p className="money mt-7 text-[clamp(1.75rem,2.5vw,2.45rem)] font-extrabold leading-none">฿{totalIncome.toLocaleString()}</p>
            <p className="mt-3 text-xs text-muted-foreground">Money coming in</p>
          </div>
        </CardContent>
      </Card>

      <Card className="min-h-[190px]">
        <CardContent className="flex h-full flex-col justify-between p-6 md:p-7">
          <div className="flex items-start justify-between">
            <span className="font-['IBM_Plex_Mono'] text-[11px] font-semibold uppercase tracking-[.16em] text-muted-foreground">Spent this month</span>
            <span className="rounded-xl bg-[#fff0ec] p-2.5 text-[#ba6050]"><ArrowUpRight className="h-[18px] w-[18px]" /></span>
          </div>
          <div>
            <p className="money mt-7 text-[clamp(1.75rem,2.5vw,2.45rem)] font-extrabold leading-none">฿{totalExpense.toLocaleString()}</p>
            <p className="mt-3 text-xs text-muted-foreground">Money going out</p>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
