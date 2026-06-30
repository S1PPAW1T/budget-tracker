

import { useBudget } from "@/context/BudgetContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon, WalletIcon } from "lucide-react"

export function SummaryCards() {
  const { transactions } = useBudget()

  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  const currentMonthTx = transactions.filter((tx) => {
    const d = new Date(tx.date)
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear
  })

  const totalIncome = currentMonthTx
    .filter((tx) => tx.type === "Income")
    .reduce((sum, tx) => sum + tx.amount, 0)

  const totalExpense = currentMonthTx
    .filter((tx) => tx.type === "Expense")
    .reduce((sum, tx) => sum + tx.amount, 0)

  const allTimeIncome = transactions
    .filter((tx) => tx.type === "Income")
    .reduce((sum, tx) => sum + tx.amount, 0)

  const allTimeExpense = transactions
    .filter((tx) => tx.type === "Expense")
    .reduce((sum, tx) => sum + tx.amount, 0)

  const allTimeRemaining = allTimeIncome - allTimeExpense

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="relative overflow-hidden border-emerald-500/20 bg-emerald-500/5">
        <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-emerald-500/10 blur-2xl"></div>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Income (รายรับเดือนนี้)</CardTitle>
          <div className="rounded-full bg-emerald-500/20 p-2">
            <ArrowUpIcon className="h-4 w-4 text-emerald-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
            ฿{totalIncome.toLocaleString()}
          </div>
        </CardContent>
      </Card>
      
      <Card className="relative overflow-hidden border-rose-500/20 bg-rose-500/5">
        <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-rose-500/10 blur-2xl"></div>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-rose-600 dark:text-rose-400">Expenses (รายจ่ายเดือนนี้)</CardTitle>
          <div className="rounded-full bg-rose-500/20 p-2">
            <ArrowDownIcon className="h-4 w-4 text-rose-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
            ฿{totalExpense.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden border-blue-500/20 bg-blue-500/5">
        <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-blue-500/10 blur-2xl"></div>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Balance (คงเหลือทั้งหมด)</CardTitle>
          <div className="rounded-full bg-blue-500/20 p-2">
            <WalletIcon className="h-4 w-4 text-blue-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className={allTimeRemaining >= 0 ? "text-3xl font-bold tracking-tight text-blue-600 dark:text-blue-400" : "text-3xl font-bold tracking-tight text-rose-600 dark:text-rose-400"}>
            ฿{allTimeRemaining.toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
