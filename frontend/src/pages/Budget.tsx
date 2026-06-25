import { useState, useEffect } from "react"
import { useBudget } from "@/context/BudgetContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { Trash2, PlusIcon } from "lucide-react"

function BudgetLimitItem({ budget, onSave }: { budget: any, onSave: (cat: string, limit: number) => void }) {
  const [limit, setLimit] = useState(String(budget.limit))
  
  useEffect(() => {
    setLimit(String(budget.limit))
  }, [budget.limit])

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-2.5 border-b last:border-0">
      <span className="font-medium text-sm">{budget.category}</span>
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
  const { budgets, updateBudget, categories, addCategory, deleteCategory } = useBudget()

  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryType, setNewCategoryType] = useState<"Income" | "Expense">("Expense")

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim(), newCategoryType)
      setNewCategoryName("")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Budget & Categories</h1>
        <p className="text-base text-muted-foreground mt-1">Manage your monthly spending limits and transaction categories.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Manage Categories</CardTitle>
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
              <Button size="icon" onClick={handleAddCategory}>
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {categories.map((c) => (
                <div key={c.name} className="flex items-center justify-between p-2.5 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-sm">{c.name}</span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${c.type === "Income" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"}`}>
                      {c.type}
                    </span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deleteCategory(c.name)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Category Limits (Expenses)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {budgets.map((budget) => (
                <BudgetLimitItem key={budget.category} budget={budget} onSave={updateBudget} />
              ))}
              {budgets.length === 0 && (
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
