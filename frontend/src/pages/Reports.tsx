import { useState, useMemo } from "react"
import { useBudget } from "@/context/BudgetContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select } from "@/components/ui/select"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { ArrowDownIcon, ArrowUpIcon, WalletIcon } from "lucide-react"
import { Progress } from "@/components/ui/progress"

const EXPENSE_COLORS = ['#f43f5e', '#fb923c', '#eab308', '#a855f7', '#ec4899', '#ef4444']
const INCOME_COLORS = ['#2ecc71', '#10b981', '#14b8a6', '#06b6d4', '#3b82f6', '#8b5cf6']

export default function ReportsPage() {
  const { transactions, budgets } = useBudget()
  
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()

  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString())
  const [selectedYear, setSelectedYear] = useState(currentYear.toString())

  const months = [
    { value: "1", label: "January" }, { value: "2", label: "February" },
    { value: "3", label: "March" }, { value: "4", label: "April" },
    { value: "5", label: "May" }, { value: "6", label: "June" },
    { value: "7", label: "July" }, { value: "8", label: "August" },
    { value: "9", label: "September" }, { value: "10", label: "October" },
    { value: "11", label: "November" }, { value: "12", label: "December" },
  ]
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString())

  // Filter transactions for the selected month
  const monthlyTransactions = useMemo(() => {
    const year = Number(selectedYear)
    const month = Number(selectedMonth)
    return transactions.filter((tx) => {
      const d = new Date(tx.date)
      return d.getFullYear() === year && d.getMonth() + 1 === month
    })
  }, [transactions, selectedMonth, selectedYear])

  // Calculate totals
  const { totalIncome, totalExpense, remaining, incomeData, expenseData, categorySpent } = useMemo(() => {
    let income = 0
    let expense = 0
    let incMap: Record<string, number> = {}
    let expMap: Record<string, number> = {}

    monthlyTransactions.forEach(tx => {
      if (tx.type === "Income") {
        income += tx.amount
        incMap[tx.category] = (incMap[tx.category] || 0) + tx.amount
      } else {
        expense += tx.amount
        expMap[tx.category] = (expMap[tx.category] || 0) + tx.amount
      }
    })

    return {
      totalIncome: income,
      totalExpense: expense,
      remaining: income - expense,
      incomeData: Object.entries(incMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value),
      expenseData: Object.entries(expMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value),
      categorySpent: expMap
    }
  }, [monthlyTransactions])

  const renderCustomLabel = ({ cx, cy, midAngle, outerRadius, value, name }: any) => {
    const RADIAN = Math.PI / 180
    const radius = outerRadius * 1.3
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)
  
    return (
      <text x={x} y={y} fill="currentColor" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-sm sm:text-base font-semibold">
        {name} ฿{value.toLocaleString()}
      </text>
    )
  }

  // Budget calculations
  const totalLimit = budgets.reduce((acc, b) => acc + Number(b.limit || 0), 0)
  const isOverallOver = totalExpense > totalLimit
  const overallPercentage = totalLimit > 0 ? Math.min((totalExpense / totalLimit) * 100, 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Monthly Reports</h1>
          <p className="text-lg text-muted-foreground mt-2">Deep dive into your monthly income, expenses, and budgets.</p>
        </div>
        <div className="flex gap-4">
          <Select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="text-lg py-2.5 px-4 h-auto w-40 bg-card border-primary/30 shadow-sm rounded-xl focus:ring-primary"
          >
            {months.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </Select>
          <Select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(e.target.value)}
            className="text-lg py-2.5 px-4 h-auto w-32 bg-card border-primary/30 shadow-sm rounded-xl focus:ring-primary"
          >
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold text-muted-foreground">Total Income</CardTitle>
            <ArrowUpIcon className="h-6 w-6 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold tracking-tight text-emerald-500">
              ฿{totalIncome.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold text-muted-foreground">Total Expenses</CardTitle>
            <ArrowDownIcon className="h-6 w-6 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold tracking-tight text-rose-500">
              ฿{totalExpense.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold text-muted-foreground">Net Balance</CardTitle>
            <WalletIcon className="h-6 w-6 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className={remaining >= 0 ? "text-5xl font-bold tracking-tight text-blue-500" : "text-5xl font-bold tracking-tight text-rose-500"}>
              ฿{remaining.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        {/* Charts */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle className="text-2xl">Income vs Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8">
            <div className="h-[350px] w-full flex flex-col items-center">
              <h3 className="text-xl font-bold mb-4 text-center tracking-tight text-emerald-500">Income</h3>
              {incomeData.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-muted-foreground text-base">No income this month</div>
              ) : (
                <div className="flex-1 w-full min-h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={incomeData}
                        cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={4}
                        dataKey="value" stroke="none" label={renderCustomLabel}
                        labelLine={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1.5 }}
                      >
                        {incomeData.map((_, i) => <Cell key={`cell-${i}`} fill={INCOME_COLORS[i % INCOME_COLORS.length]} />)}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', fontSize: '14px', fontWeight: 500 }}
                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                        formatter={(value: number) => `฿${value.toLocaleString()}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="h-[350px] w-full flex flex-col items-center border-t md:border-t-0 md:border-l border-border/50 pt-6 md:pt-0">
              <h3 className="text-xl font-bold mb-4 text-center tracking-tight text-rose-500">Expenses</h3>
              {expenseData.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-muted-foreground text-base">No expenses this month</div>
              ) : (
                <div className="flex-1 w-full min-h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseData}
                        cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={4}
                        dataKey="value" stroke="none" label={renderCustomLabel}
                        labelLine={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1.5 }}
                      >
                        {expenseData.map((_, i) => <Cell key={`cell-${i}`} fill={EXPENSE_COLORS[i % EXPENSE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', fontSize: '14px', fontWeight: 500 }}
                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                        formatter={(value: number) => `฿${value.toLocaleString()}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Budget Limits */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle className="text-2xl">Monthly Budget Limits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="p-5 bg-muted/50 rounded-xl border border-border/50 shadow-inner">
                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Overall Budget</h3>
                    <span className="text-base font-medium px-4 py-2 bg-background rounded-md border shadow-sm">
                      Remaining: <span className={`font-bold ${isOverallOver ? 'text-destructive' : 'text-primary'}`}>฿{(totalLimit - totalExpense).toLocaleString()}</span>
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-lg">
                    <span className="text-muted-foreground font-medium">Total Spent</span>
                    <span className="font-semibold text-foreground text-xl">
                      ฿{totalExpense.toLocaleString()} <span className="text-muted-foreground font-normal text-lg">/ ฿{totalLimit.toLocaleString()}</span>
                    </span>
                  </div>
                  <Progress 
                    value={overallPercentage} 
                    indicatorClassName={isOverallOver ? "bg-destructive" : overallPercentage > 80 ? "bg-yellow-500" : "bg-primary"}
                    className="h-5 bg-background/50 rounded-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {budgets.map((budget) => {
                  const spent = categorySpent[budget.category] || 0
                  const percentage = budget.limit > 0 ? Math.min((spent / budget.limit) * 100, 100) : (spent > 0 ? 100 : 0)
                  const isOver = budget.limit > 0 && spent > budget.limit

                  return (
                    <div key={budget.category} className="space-y-3 p-4 border border-border/50 rounded-xl bg-background/50">
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
                {budgets.length === 0 && (
                  <div className="text-center text-base text-muted-foreground py-6">
                    No expense categories set up.
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
