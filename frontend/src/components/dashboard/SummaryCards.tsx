

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
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold text-muted-foreground">Income (รายรับเดือนนี้)</CardTitle>
          <ArrowUpIcon className="h-5 w-5 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold tracking-tight text-emerald-500">
            ฿{totalIncome.toLocaleString()}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold text-muted-foreground">Expenses (รายจ่ายเดือนนี้)</CardTitle>
          <ArrowDownIcon className="h-5 w-5 text-rose-500" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold tracking-tight text-rose-500">
            ฿{totalExpense.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold text-muted-foreground">Total Balance (เงินคงเหลือทั้งหมด)</CardTitle>
          <WalletIcon className="h-5 w-5 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className={allTimeRemaining >= 0 ? "text-4xl font-bold tracking-tight text-blue-500" : "text-4xl font-bold tracking-tight text-rose-500"}>
            ฿{allTimeRemaining.toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
