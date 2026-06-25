

import { useBudget } from "@/context/BudgetContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function BudgetProgress() {
  const { transactions, budgets } = useBudget()

  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  const currentMonthExpenses = transactions.filter((tx) => {
    const d = new Date(tx.date)
    return tx.type === "Expense" && d.getMonth() === currentMonth && d.getFullYear() === currentYear
  })

  const categorySpent = currentMonthExpenses.reduce((acc, tx) => {
    acc[tx.category] = (acc[tx.category] || 0) + tx.amount
    return acc
  }, {} as Record<string, number>)

  const totalLimit = budgets.reduce((acc, b) => acc + Number(b.limit || 0), 0)
  const totalSpent = Object.values(categorySpent).reduce((acc, spent) => acc + spent, 0)
  const remainingBudget = totalLimit - totalSpent
  const overallPercentage = totalLimit > 0 ? Math.min((totalSpent / totalLimit) * 100, 100) : 0
  const isOverallOver = totalSpent > totalLimit

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Budget Limits</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="p-5 bg-muted/50 rounded-xl border border-border/50 shadow-inner">
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Overall Budget</h3>
                <span className="text-base font-medium px-4 py-2 bg-background rounded-md border shadow-sm">
                  Remaining: <span className={`font-bold ${isOverallOver ? 'text-destructive' : 'text-primary'}`}>฿{remainingBudget.toLocaleString()}</span>
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-lg">
                <span className="text-muted-foreground font-medium">Total Spent</span>
                <span className="font-semibold text-foreground text-xl">
                  ฿{totalSpent.toLocaleString()} <span className="text-muted-foreground font-normal text-lg">/ ฿{totalLimit.toLocaleString()}</span>
                </span>
              </div>
              <Progress 
                value={overallPercentage} 
                indicatorClassName={isOverallOver ? "bg-destructive" : overallPercentage > 80 ? "bg-yellow-500" : "bg-primary"}
                className="h-5 bg-background/50 rounded-full"
              />
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-muted-foreground uppercase tracking-wider">By Category</h4>
            {budgets.map((budget) => {
              const spent = categorySpent[budget.category] || 0
              const percentage = budget.limit > 0 ? Math.min((spent / budget.limit) * 100, 100) : (spent > 0 ? 100 : 0)
              const isOver = budget.limit > 0 && spent > budget.limit

              return (
                <div key={budget.category} className="space-y-3">
                  <div className="flex items-center justify-between text-lg">
                    <span className="font-semibold">{budget.category}</span>
                    <span className="text-muted-foreground font-medium">
                      ฿{spent.toLocaleString()} / ฿{Number(budget.limit).toLocaleString()}
                    </span>
                  </div>
                  <Progress 
                    value={percentage} 
                    indicatorClassName={isOver ? "bg-destructive" : percentage > 80 ? "bg-yellow-500" : "bg-primary"}
                    className="h-2.5"
                  />
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
