

import { useState } from "react"
import { useBudget } from "@/context/BudgetContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { PencilIcon, Trash2 } from "lucide-react"
import { TransactionFormModal } from "@/components/transactions/TransactionFormModal"

export function RecentTransactions() {
  const { transactions, deleteTransaction } = useBudget()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [transactionToEdit, setTransactionToEdit] = useState<any>(null)

  const recent = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-4">
          {recent.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="rounded-full bg-secondary/50 p-3 mb-3">
                <PencilIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No recent transactions</p>
            </div>
          ) : (
            recent.map((tx) => (
              <div key={tx.id} className="group flex items-center justify-between rounded-xl border border-transparent p-3 transition-colors hover:bg-secondary/50 hover:border-border/50">
                <div className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${tx.type === "Income" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`}>
                    <span className="text-lg font-bold">{tx.type === "Income" ? "+" : "-"}</span>
                  </div>
                  <div>
                    <p className="text-base font-semibold leading-none mb-1">{tx.note || tx.category}</p>
                    <p className="text-sm text-muted-foreground">{format(new Date(tx.date), "MMM dd, yyyy")} • {tx.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`text-base font-bold ${tx.type === "Income" ? "text-emerald-500" : "text-rose-500"}`}>
                    {tx.type === "Income" ? "+" : "-"}฿{tx.amount.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                    <Button variant="ghost" size="icon" onClick={() => { setTransactionToEdit(tx); setIsModalOpen(true); }} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteTransaction(tx.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
      <TransactionFormModal open={isModalOpen} onOpenChange={setIsModalOpen} transactionToEdit={transactionToEdit} />
    </Card>
  )
}
