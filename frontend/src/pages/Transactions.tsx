

import { useState } from "react"
import { useBudget } from "@/context/BudgetContext"
import { format, isThisWeek, isThisMonth, isThisYear } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TransactionFormModal } from "@/components/transactions/TransactionFormModal"
import { Button } from "@/components/ui/button"
import { PlusIcon, PencilIcon } from "lucide-react"
import { Select } from "@/components/ui/select"

export default function TransactionsPage() {
  const { transactions } = useBudget()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [transactionToEdit, setTransactionToEdit] = useState<any>(null)
  const [range, setRange] = useState<"all" | "week" | "month" | "year">("all")

  const filteredTransactions = transactions.filter((tx) => {
    if (range === "all") return true
    
    const txDate = new Date(tx.date)
    if (range === "week") return isThisWeek(txDate)
    if (range === "month") return isThisMonth(txDate)
    if (range === "year") return isThisYear(txDate)
    
    return true
  })

  // Sort by date descending
  filteredTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Group transactions by category
  const categoriesMap = filteredTransactions.reduce((acc, tx) => {
    if (!acc[tx.category]) {
      acc[tx.category] = []
    }
    acc[tx.category].push(tx)
    return acc
  }, {} as Record<string, typeof transactions>)

  const groupedCategories = Object.entries(categoriesMap).sort(([a], [b]) => a.localeCompare(b))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Transactions</h1>
          <p className="text-lg text-muted-foreground mt-2">History of all your income and expenses.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-48">
            <Select value={range} onChange={(e) => setRange(e.target.value as any)}>
              <option value="all">All Time (Default)</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </Select>
          </div>
          <Button onClick={() => { setTransactionToEdit(null); setIsModalOpen(true); }} className="gap-2 text-base py-6 px-6">
            <PlusIcon className="h-5 w-5" />
            Add Transaction
          </Button>
        </div>
      </div>

      {groupedCategories.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {groupedCategories.map(([category, categoryTransactions]) => {
            const isIncome = categoryTransactions.some(tx => tx.type === "Income")
            
            return (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className={`text-xl ${isIncome ? "text-emerald-500" : "text-rose-500"}`}>
                    {category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-base text-left">
                      <thead className="text-sm text-muted-foreground uppercase bg-secondary/50 font-semibold tracking-wider">
                        <tr>
                          <th className="px-5 py-4 rounded-tl-md">Date</th>
                          <th className="px-5 py-4">Note</th>
                          <th className="px-5 py-4 text-right rounded-tr-md">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categoryTransactions.map(tx => (
                          <tr key={tx.id} className="border-b last:border-0 hover:bg-secondary/20 transition-colors">
                            <td className="px-5 py-4 whitespace-nowrap">{format(new Date(tx.date), "MMM dd, yyyy")}</td>
                            <td className="px-5 py-4 text-muted-foreground">{tx.note || "-"}</td>
                            <td className={`px-5 py-4 text-right text-lg font-bold whitespace-nowrap ${tx.type === "Income" ? "text-emerald-500" : "text-rose-500"}`}>
                              <div className="flex items-center justify-end gap-4">
                                <span>{tx.type === "Income" ? "+" : "-"}฿{tx.amount.toLocaleString()}</span>
                                <Button variant="ghost" size="icon" onClick={() => { setTransactionToEdit(tx); setIsModalOpen(true); }} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                  <PencilIcon className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="text-center text-lg text-muted-foreground py-12">
          No transactions found for this period.
        </div>
      )}

      <TransactionFormModal open={isModalOpen} onOpenChange={setIsModalOpen} transactionToEdit={transactionToEdit} />
    </div>
  )
}
