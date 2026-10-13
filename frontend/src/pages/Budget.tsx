import { useState, useEffect } from "react"
import { useBudget } from "@/context/BudgetContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { Trash2, PlusIcon } from "lucide-react"
import { getMonthlyBudget } from "@/lib/budget-calculations"

function BudgetLimitItem({ budget, onSave }: {
  budget: { category: string, limit: number, transfer: number, available: number },
  onSave: (cat: string, limit: number) => void
}) {
  const [limit, setLimit] = useState(String(budget.limit))
  
  useEffect(() => {
    setLimit(String(budget.limit))
  }, [budget.limit])

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-2.5 border-b last:border-0">
      <div>
        <span className="font-medium text-sm">{budget.category}</span>
        <p className="text-xs text-muted-foreground">
          {budget.transfer > 0 && <span>Transfer +฿{budget.transfer.toLocaleString()} · </span>}
          Available to spend: <span className={budget.available < 0 ? "text-destructive" : "text-positive"}>฿{budget.available.toLocaleString()}</span>
        </p>
      </div>
      <div className="flex items-center gap-2 max-w-[240px]">
        <span className="text-base text-muted-foreground">฿</span>
        <Input 
          type="number" 
          value={limit} 
          onChange={(e) => setLimit(e.target.value)}
          className="text-sm font-semibold w-24"
        />
        <Button 
          size="sm" 
          onClick={() => onSave(budget.category, Number(limit))}
          disabled={Number(limit) === budget.limit}
          variant="secondary"
        >
          Save
        </Button>
      </div>
    </div>
  )
}

export default function BudgetPage() {
  const { transactions, budgets, updateBudget, categories, addCategory, deleteCategory, selectedMonth, setSelectedMonth } = useBudget()
  const budgetSummary = getMonthlyBudget(transactions, budgets, categories, selectedMonth)

  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryType, setNewCategoryType] = useState<"Income" | "Expense">("Expense")

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim(), newCategoryType)
      setNewCategoryName("")
    }
  }

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-5 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow mb-2">Planning</p>
          <h1 className="page-title">Budget & Categories</h1>
          <p className="mt-2 text-sm text-muted-foreground">Set your monthly limits and keep each category on track.</p>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="budget-month" className="text-sm font-medium text-muted-foreground whitespace-nowrap">Month</label>
          <Input 
            id="budget-month"
            type="month" 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-40"
          />
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold">Manage Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-2">
              <Input 
                placeholder="New category name" 
                value={newCategoryName} 
                onChange={(e) => setNewCategoryName(e.target.value)} 
                className="text-sm"
              />
              <Select value={newCategoryType} onChange={(e) => setNewCategoryType(e.target.value as "Income" | "Expense")}>
                <option value="Expense">Expense</option>
                <option value="Income">Income</option>
              </Select>
              <Button size="icon" aria-label="Add category" onClick={handleAddCategory}>
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {categories.map((c) => (
                <div key={c.name} className="flex items-center justify-between p-2.5 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-sm">{c.name}</span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${c.type === "Income" ? "bg-positive-soft text-positive" : "bg-negative-soft text-negative"}`}>
                      {c.type}
                    </span>
                  </div>
                  <Button variant="ghost" size="icon" aria-label={`Delete ${c.name} category`} className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deleteCategory(c.name)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold">Category Limits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {budgetSummary.rows.map((row) => {
                return <BudgetLimitItem key={row.categoryId} budget={row} onSave={updateBudget} />
              })}
              {budgetSummary.rows.length === 0 && (
                <div className="text-center text-base text-muted-foreground py-6">
                  No expense categories found.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
