

import { useState } from "react"
import { useBudget } from "@/context/BudgetContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { PencilIcon } from "lucide-react"
import { TransactionFormModal } from "@/components/transactions/TransactionFormModal"

export function RecentTransactions() {
  const { transactions } = useBudget()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [transactionToEdit, setTransactionToEdit] = useState<any>(null)

  const recent = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {recent.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between">
              <div>
                <p className="text-lg font-medium">{tx.note || tx.category}</p>
                <p className="text-base text-muted-foreground">{format(new Date(tx.date), "MMM dd, yyyy")} • {tx.category}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className={`text-xl font-bold ${tx.type === "Income" ? "text-emerald-500" : "text-rose-500"}`}>
                  {tx.type === "Income" ? "+" : "-"}฿{tx.amount.toLocaleString()}
                </div>
                <Button variant="ghost" size="icon" onClick={() => { setTransactionToEdit(tx); setIsModalOpen(true); }} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                  <PencilIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <TransactionFormModal open={isModalOpen} onOpenChange={setIsModalOpen} transactionToEdit={transactionToEdit} />
    </Card>
  )
}
