

import { useBudget } from "@/context/BudgetContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getMonthlyBudget } from "@/lib/budget-calculations"

export function BudgetProgress() {
  const { transactions, budgets, categories, selectedMonth } = useBudget()
  const summary = getMonthlyBudget(transactions, budgets, categories, selectedMonth)
  const overallPercentage = summary.effectiveLimit > 0
    ? Math.min((summary.totalSpent / summary.effectiveLimit) * 100, 100) : 0
  const isOverallOver = summary.remaining < 0

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
                    Remaining: <span className={`font-bold ${isOverallOver ? 'text-destructive' : 'text-primary'}`}>฿{summary.remaining.toLocaleString()}</span>
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Total Spent</span>
                    <span className="font-semibold text-foreground text-base">
                      ฿{summary.totalSpent.toLocaleString()} <span className="text-muted-foreground font-normal text-sm">/ ฿{summary.effectiveLimit.toLocaleString()}</span>
                    </span>
                  </div>
                  {summary.totalTransfers > 0 && (
                    <>
                      <div className="flex items-center justify-between text-xs mt-1 border-t border-border/50 pt-1.5">
                        <span className="text-muted-foreground">Base Budget</span>
                        <span className="text-muted-foreground font-medium">฿{summary.totalLimit.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Transfers Added</span>
                        <span className="text-emerald-500 font-medium">+฿{summary.totalTransfers.toLocaleString()}</span>
                      </div>
                    </>
                  )}
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
              {summary.rows.map((row) => {
                const percentage = row.effectiveLimit > 0 ? Math.min((row.spent / row.effectiveLimit) * 100, 100) : (row.spent > 0 ? 100 : 0)
                const isOver = row.available < 0

                return (
                  <div key={row.categoryId} className="space-y-2 group">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-foreground/80 group-hover:text-foreground transition-colors">{row.category}</span>
                      <span className="text-muted-foreground font-medium text-xs">
                        <span className={isOver ? 'text-destructive font-bold' : ''}>฿{row.spent.toLocaleString()}</span> / ฿{row.effectiveLimit.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{row.transfer > 0 ? `Base ฿${row.limit.toLocaleString()} + transfer ฿${row.transfer.toLocaleString()}` : ""}</span>
                      <span className={isOver ? "text-destructive" : "text-emerald-600 dark:text-emerald-400"}>Available ฿{row.available.toLocaleString()}</span>
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
