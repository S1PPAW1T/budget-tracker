import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useBudget } from "@/context/BudgetContext"
import { format, startOfWeek, addDays, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, startOfYear, endOfYear } from "date-fns"

type ViewMode = "Daily" | "Weekly" | "Monthly"

export function TransactionChart() {
  const { transactions } = useBudget()
  const [viewMode, setViewMode] = useState<ViewMode>("Daily")

  const { data } = useMemo(() => {
    const today = new Date()
    let groupedData: Record<string, { income: number; expense: number }> = {}
    let incomeMap: Record<string, number> = {}
    let expenseMap: Record<string, number> = {}
    let filterStart: Date, filterEnd: Date

    if (viewMode === "Daily") {
      filterStart = addDays(today, -6)
      filterEnd = today
      const days = eachDayOfInterval({ start: filterStart, end: filterEnd })
      days.forEach(d => { groupedData[format(d, "MMM dd")] = { income: 0, expense: 0 } })

      transactions.forEach(tx => {
        const d = new Date(tx.date)
        if (d >= filterStart && d <= filterEnd) {
          const key = format(d, "MMM dd")
          if (tx.type === "Income") {
            groupedData[key].income += tx.amount
            incomeMap[tx.category] = (incomeMap[tx.category] || 0) + tx.amount
          } else {
            groupedData[key].expense += tx.amount
            expenseMap[tx.category] = (expenseMap[tx.category] || 0) + tx.amount
          }
        }
      })
    } else if (viewMode === "Weekly") {
      filterStart = addDays(today, -27)
      filterEnd = today
      const weeks = eachWeekOfInterval({ start: filterStart, end: filterEnd })
      weeks.forEach(w => { groupedData[format(w, "MMM dd")] = { income: 0, expense: 0 } })

      transactions.forEach(tx => {
        const d = new Date(tx.date)
        if (d >= filterStart && d <= filterEnd) {
          const key = format(startOfWeek(d), "MMM dd")
          if (groupedData[key]) {
            if (tx.type === "Income") {
              groupedData[key].income += tx.amount
              incomeMap[tx.category] = (incomeMap[tx.category] || 0) + tx.amount
            } else {
              groupedData[key].expense += tx.amount
              expenseMap[tx.category] = (expenseMap[tx.category] || 0) + tx.amount
            }
          }
        }
      })
    } else {
      filterStart = startOfYear(today)
      filterEnd = endOfYear(today)
      const months = eachMonthOfInterval({ start: filterStart, end: filterEnd })
      months.forEach(m => { groupedData[format(m, "MMM")] = { income: 0, expense: 0 } })

      transactions.forEach(tx => {
        const d = new Date(tx.date)
        if (d >= filterStart && d <= filterEnd) {
          const key = format(d, "MMM")
          if (tx.type === "Income") {
            groupedData[key].income += tx.amount
            incomeMap[tx.category] = (incomeMap[tx.category] || 0) + tx.amount
          } else {
            groupedData[key].expense += tx.amount
            expenseMap[tx.category] = (expenseMap[tx.category] || 0) + tx.amount
          }
        }
      })
    }

    return {
      data: Object.keys(groupedData).map(key => ({
        name: key,
        Income: groupedData[key].income,
        Expense: groupedData[key].expense
      }))
    }
  }, [transactions, viewMode])

  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-row items-center justify-between pb-6">
        <CardTitle className="text-2xl">Income vs Expenses</CardTitle>
        <div className="flex bg-secondary p-1.5 rounded-lg">
          {(["Daily", "Weekly", "Monthly"] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                viewMode === mode ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-12">
        {/* Line Chart */}
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="name" fontSize={14} tickLine={false} axisLine={false} tickMargin={10} />
              <YAxis fontSize={14} tickLine={false} axisLine={false} tickFormatter={(value) => `฿${value}`} tickMargin={10} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', fontSize: '14px', fontWeight: 500 }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend wrapperStyle={{ fontSize: '14px', fontWeight: 600, marginTop: '10px' }} />
              <Line type="monotone" dataKey="Income" stroke="#2ecc71" strokeWidth={4} dot={{ r: 5 }} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="Expense" stroke="#f43f5e" strokeWidth={4} dot={{ r: 5 }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
