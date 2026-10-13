import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useBudget } from "@/context/BudgetContext"
import { format, startOfWeek, addDays, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, startOfYear, endOfYear } from "date-fns"

type ViewMode = "Daily" | "Weekly" | "Monthly"
type TabMode = "Overview" | "Income" | "Expense"

const CHART_COLORS = [
  "var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)",
  "var(--chart-5)", "var(--chart-6)", "var(--chart-7)", "var(--chart-8)",
  "var(--chart-9)", "var(--chart-10)", "var(--chart-11)", "var(--chart-12)"
]

export function TransactionChart() {
  const { transactions, categories } = useBudget()
  const [viewMode, setViewMode] = useState<ViewMode>("Daily")
  const [selectedTab, setSelectedTab] = useState<TabMode>("Overview")

  const data = useMemo(() => {
    const today = new Date()
    let groupedData: Record<string, any> = {}
    let filterStart: Date, filterEnd: Date

    const initializeData = (key: string) => {
      const base: Record<string, any> = { name: key, Income: 0, Expense: 0 }
      categories.forEach(cat => {
        base[cat.name] = 0
      })
      groupedData[key] = base
    }

    if (viewMode === "Daily") {
      filterStart = addDays(today, -6)
      filterEnd = today
      const days = eachDayOfInterval({ start: filterStart, end: filterEnd })
      days.forEach(d => initializeData(format(d, "MMM dd")))

      transactions.forEach(tx => {
        const d = new Date(tx.date)
        if (d >= filterStart && d <= filterEnd) {
          const key = format(d, "MMM dd")
          if (groupedData[key]) {
            if (tx.type === "Income") {
              groupedData[key].Income += tx.amount
              groupedData[key][tx.category] = (groupedData[key][tx.category] || 0) + tx.amount
            } else {
              groupedData[key].Expense += tx.amount
              groupedData[key][tx.category] = (groupedData[key][tx.category] || 0) + tx.amount
            }
          }
        }
      })
    } else if (viewMode === "Weekly") {
      filterStart = addDays(today, -27)
      filterEnd = today
      const weeks = eachWeekOfInterval({ start: filterStart, end: filterEnd })
      weeks.forEach(w => initializeData(format(w, "MMM dd")))

      transactions.forEach(tx => {
        const d = new Date(tx.date)
        if (d >= filterStart && d <= filterEnd) {
          const key = format(startOfWeek(d), "MMM dd")
          if (groupedData[key]) {
            if (tx.type === "Income") {
              groupedData[key].Income += tx.amount
              groupedData[key][tx.category] = (groupedData[key][tx.category] || 0) + tx.amount
            } else {
              groupedData[key].Expense += tx.amount
              groupedData[key][tx.category] = (groupedData[key][tx.category] || 0) + tx.amount
            }
          }
        }
      })
    } else {
      filterStart = startOfYear(today)
      filterEnd = endOfYear(today)
      const months = eachMonthOfInterval({ start: filterStart, end: filterEnd })
      months.forEach(m => initializeData(format(m, "MMM")))

      transactions.forEach(tx => {
        const d = new Date(tx.date)
        if (d >= filterStart && d <= filterEnd) {
          const key = format(d, "MMM")
          if (groupedData[key]) {
            if (tx.type === "Income") {
              groupedData[key].Income += tx.amount
              groupedData[key][tx.category] = (groupedData[key][tx.category] || 0) + tx.amount
            } else {
              groupedData[key].Expense += tx.amount
              groupedData[key][tx.category] = (groupedData[key][tx.category] || 0) + tx.amount
            }
          }
        }
      })
    }

    return Object.values(groupedData).map((item: any) => ({
      ...item,
      "Net Balance": item.Income - item.Expense
    }))
  }, [transactions, viewMode])

  const incomeCategories = categories.filter(c => c.type === "Income")
  const expenseCategories = categories.filter(c => c.type === "Expense")

  return (
    <Card className="col-span-full overflow-hidden">
      <CardHeader className="flex flex-col gap-5 border-b border-border pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            {selectedTab === "Overview" ? "Income vs Expenses" : `${selectedTab} Breakdown`}
          </CardTitle>
          <div className="flex bg-secondary p-1 rounded-xl">
          {(["Daily", "Weekly", "Monthly"] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                viewMode === mode ? "bg-card shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
        </div>
        
        <div className="flex overflow-x-auto pb-2 gap-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {(["Overview", "Income", "Expense"] as TabMode[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`whitespace-nowrap px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                selectedTab === tab 
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="name" fontSize={14} tick={{ fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} tickMargin={10} />
              <YAxis fontSize={14} tick={{ fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} tickFormatter={(value) => `฿${value}`} tickMargin={10} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--foreground))', borderRadius: '12px', border: '1px solid hsl(var(--border))', fontSize: '14px', fontWeight: 500 }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend wrapperStyle={{ color: 'hsl(var(--foreground))', fontSize: '14px', fontWeight: 600, marginTop: '10px' }} />
              
              {selectedTab === "Overview" && <Line type="monotone" dataKey="Income" stroke="var(--chart-income)" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />}
              {selectedTab === "Overview" && <Line type="monotone" dataKey="Expense" stroke="var(--chart-expense)" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />}
              {selectedTab === "Overview" && <Line type="monotone" dataKey="Net Balance" stroke="var(--chart-balance)" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />}

              {selectedTab === "Income" && incomeCategories.map((cat, i) => (
                <Line 
                  key={cat.name} 
                  type="monotone" 
                  dataKey={cat.name} 
                  stroke={CHART_COLORS[i % CHART_COLORS.length]} 
                  strokeWidth={3} 
                  dot={{ r: 4 }} 
                  activeDot={{ r: 6 }} 
                />
              ))}

              {selectedTab === "Expense" && expenseCategories.map((cat, i) => (
                <Line 
                  key={cat.name} 
                  type="monotone" 
                  dataKey={cat.name} 
                  stroke={CHART_COLORS[i % CHART_COLORS.length]} 
                  strokeWidth={3} 
                  dot={{ r: 4 }} 
                  activeDot={{ r: 6 }} 
                />
              ))}

            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
