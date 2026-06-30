

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
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl">Budget Limits</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-8">
          <div className="p-5 bg-card rounded-2xl border shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
            <div className="relative">
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Overall Budget</h3>
                  <span className="text-sm font-medium px-3 py-1 bg-background/80 backdrop-blur-sm rounded-full border shadow-sm">
                    Remaining: <span className={`font-bold ${isOverallOver ? 'text-destructive' : 'text-primary'}`}>฿{remainingBudget.toLocaleString()}</span>
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Total Spent</span>
                  <span className="font-semibold text-foreground text-base">
                    ฿{totalSpent.toLocaleString()} <span className="text-muted-foreground font-normal text-sm">/ ฿{totalLimit.toLocaleString()}</span>
                  </span>
                </div>
                <Progress 
                  value={overallPercentage} 
                  indicatorClassName={isOverallOver ? "bg-destructive" : overallPercentage > 80 ? "bg-amber-500" : "bg-primary"}
                  className="h-4 bg-background rounded-full shadow-inner"
                />
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">By Category</h4>
            <div className="space-y-4">
              {budgets.map((budget) => {
                const spent = categorySpent[budget.category] || 0
                const percentage = budget.limit > 0 ? Math.min((spent / budget.limit) * 100, 100) : (spent > 0 ? 100 : 0)
                const isOver = budget.limit > 0 && spent > budget.limit

                return (
                  <div key={budget.category} className="space-y-2 group">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-foreground/80 group-hover:text-foreground transition-colors">{budget.category}</span>
                      <span className="text-muted-foreground font-medium text-xs">
                        <span className={isOver ? 'text-destructive font-bold' : ''}>฿{spent.toLocaleString()}</span> / ฿{Number(budget.limit).toLocaleString()}
                      </span>
                    </div>
                    <Progress 
                      value={percentage} 
                      indicatorClassName={isOver ? "bg-destructive" : percentage > 80 ? "bg-amber-500" : "bg-primary/80"}
                      className="h-2 bg-secondary/50 rounded-full"
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
