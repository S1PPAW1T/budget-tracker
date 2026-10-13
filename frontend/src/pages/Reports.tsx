import { useMemo } from "react"
import { useBudget } from "@/context/BudgetContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select } from "@/components/ui/select"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { ArrowDownIcon, ArrowUpIcon, WalletIcon } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { getMonthlyBudget } from "@/lib/budget-calculations"

const EXPENSE_COLORS = ['var(--chart-expense)', 'var(--chart-2)', 'var(--chart-4)', 'var(--chart-6)', 'var(--chart-8)', 'var(--chart-10)']
const INCOME_COLORS = ['var(--chart-income)', 'var(--chart-7)', 'var(--chart-5)', 'var(--chart-9)', 'var(--chart-11)', 'var(--chart-3)']

export default function ReportsPage() {
  const { transactions, budgets, categories, selectedMonth: budgetMonth, setSelectedMonth: setBudgetMonth } = useBudget()
  
  const currentYear = new Date().getFullYear()

  const [selectedYear, selectedMonth] = budgetMonth.split("-")

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
  const { totalIncome, totalExpense, remaining, incomeData, expenseData } = useMemo(() => {
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
    }
  }, [monthlyTransactions])

  // Budget calculations
  const budgetSummary = getMonthlyBudget(transactions, budgets, categories, budgetMonth)
  const isOverallOver = budgetSummary.remaining < 0
  const overallPercentage = budgetSummary.effectiveLimit > 0
    ? Math.min((budgetSummary.totalSpent / budgetSummary.effectiveLimit) * 100, 100) : 0

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-5 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow mb-2">Insights</p>
          <h1 className="page-title">Monthly Reports</h1>
          <p className="mt-2 text-sm text-muted-foreground">See the patterns behind your income and spending.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Select 
            value={String(Number(selectedMonth))}
            onChange={(e) => setBudgetMonth(`${selectedYear}-${e.target.value.padStart(2, "0")}`)}
            className="text-base py-2 px-3 h-auto w-36 bg-card border-primary/30 shadow-sm rounded-lg focus:ring-primary"
          >
            {months.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </Select>
          <Select 
            value={selectedYear} 
            onChange={(e) => setBudgetMonth(`${e.target.value}-${selectedMonth}`)}
            className="text-base py-2 px-3 h-auto w-28 bg-card border-primary/30 shadow-sm rounded-lg focus:ring-primary"
          >
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
            <ArrowUpIcon className="h-4 w-4 text-positive" />
          </CardHeader>
          <CardContent>
            <div className="money min-w-0 break-all text-[clamp(1.75rem,4vw,2.25rem)] font-extrabold text-positive">
              ฿{totalIncome.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
            <ArrowDownIcon className="h-4 w-4 text-negative" />
          </CardHeader>
          <CardContent>
            <div className="money min-w-0 break-all text-[clamp(1.75rem,4vw,2.25rem)] font-extrabold text-negative">
              ฿{totalExpense.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Net Balance</CardTitle>
            <WalletIcon className="h-4 w-4 text-foreground" />
          </CardHeader>
          <CardContent>
            <div className={remaining >= 0 ? "money min-w-0 break-all text-[clamp(1.75rem,4vw,2.25rem)] font-extrabold text-foreground" : "money min-w-0 break-all text-[clamp(1.75rem,4vw,2.25rem)] font-extrabold text-destructive"}>
              ฿{remaining.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        {/* Charts */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle className="text-xl">Income vs Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="grid min-w-0 grid-cols-1 gap-8 pb-8 xl:grid-cols-2">
            {[
              { title: "Income", data: incomeData, colors: INCOME_COLORS, empty: "No income this month", titleColor: "text-positive" },
              { title: "Expenses", data: expenseData, colors: EXPENSE_COLORS, empty: "No expenses this month", titleColor: "text-negative" },
            ].map((section, sectionIndex) => (
              <div key={section.title} className={`min-w-0 ${sectionIndex === 1 ? "border-t border-border pt-8 xl:border-l xl:border-t-0 xl:pl-8 xl:pt-0" : ""}`}>
                <h3 className={`mb-3 text-lg font-bold ${section.titleColor}`}>{section.title}</h3>
                {section.data.length === 0 ? (
                  <div className="flex min-h-[160px] items-center justify-center rounded-xl bg-muted/50 px-4 text-center text-sm text-muted-foreground">{section.empty}</div>
                ) : (
                  <div className="grid min-w-0 gap-4 sm:grid-cols-[220px_minmax(0,1fr)] sm:items-center xl:grid-cols-1">
                    <div className="mx-auto h-[220px] w-full max-w-[220px]" aria-hidden="true">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={section.data} cx="50%" cy="50%" innerRadius={58} outerRadius={88} paddingAngle={3} dataKey="value" stroke="none">
                            {section.data.map((_, i) => <Cell key={`${section.title}-${i}`} fill={section.colors[i % section.colors.length]} />)}
                          </Pie>
                          <Tooltip
                            contentStyle={{ backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--foreground))', borderRadius: '12px', border: '1px solid hsl(var(--border))', fontSize: '14px', fontWeight: 500 }}
                            itemStyle={{ color: 'hsl(var(--foreground))' }}
                            formatter={(value: number) => `฿${value.toLocaleString()}`}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <ul className="min-w-0 space-y-2" aria-label={`${section.title} by category`}>
                      {section.data.map((item, i) => (
                        <li key={item.name} className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-3 border-b border-border/70 py-2 text-sm last:border-b-0">
                          <span className="flex min-w-0 items-start gap-2.5">
                            <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: section.colors[i % section.colors.length] }} />
                            <span className="min-w-0 break-words [overflow-wrap:anywhere]">{item.name}</span>
                          </span>
                          <span className="money max-w-[45vw] break-all text-right font-bold sm:max-w-[160px]">฿{item.value.toLocaleString()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Budget Limits */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle className="text-xl">Monthly Budget Limits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="min-w-0 rounded-xl border border-border/50 bg-muted/50 p-4">
                <div className="flex flex-col gap-2 mb-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="text-lg font-semibold">Overall Budget</h3>
                    <span className="max-w-full rounded-md border bg-background px-3 py-1.5 text-sm font-medium [overflow-wrap:anywhere]">
                      Remaining: <span className={`money font-bold ${isOverallOver ? 'text-destructive' : 'text-primary'}`}>฿{budgetSummary.remaining.toLocaleString()}</span>
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1 text-sm">
                    <span className="text-muted-foreground font-medium">Total Spent</span>
                    <span className="money min-w-0 break-all text-base font-semibold text-foreground">
                      ฿{budgetSummary.totalSpent.toLocaleString()} <span className="text-muted-foreground font-normal text-sm">/ ฿{budgetSummary.effectiveLimit.toLocaleString()}</span>
                    </span>
                  </div>
                  {budgetSummary.totalTransfers > 0 && (
                    <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="[overflow-wrap:anywhere]">Base budget ฿{budgetSummary.totalLimit.toLocaleString()}</span>
                      <span className="text-primary [overflow-wrap:anywhere]">Transfers added +฿{budgetSummary.totalTransfers.toLocaleString()}</span>
                    </div>
                  )}
                  <Progress 
                    value={overallPercentage} 
                    indicatorClassName={isOverallOver ? "bg-destructive" : overallPercentage > 80 ? "bg-yellow-500" : "bg-primary"}
                    className="h-3 bg-background/50 rounded-full"
                  />
                </div>
              </div>

              <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2">
                {budgetSummary.rows.map((row) => {
                  const percentage = row.effectiveLimit > 0 ? Math.min((row.spent / row.effectiveLimit) * 100, 100) : (row.spent > 0 ? 100 : 0)
                  const isOver = row.available < 0

                  return (
                    <div key={row.categoryId} className="min-w-0 space-y-3 rounded-xl border border-border/50 bg-background/50 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1 text-sm">
                        <span className="min-w-0 font-semibold [overflow-wrap:anywhere]">{row.category}</span>
                        <span className="money min-w-0 break-all font-medium text-muted-foreground">
                          ฿{row.spent.toLocaleString()} / ฿{row.effectiveLimit.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="min-w-0 [overflow-wrap:anywhere]">{row.transfer > 0 ? `Base ฿${row.limit.toLocaleString()} + transfer ฿${row.transfer.toLocaleString()}` : ""}</span>
                        <span className={`money min-w-0 break-all font-semibold ${isOver ? "text-destructive" : "text-primary"}`}>Available ฿{row.available.toLocaleString()}</span>
                      </div>
                      <Progress 
                        value={percentage} 
                        indicatorClassName={isOver ? "bg-destructive" : percentage > 80 ? "bg-yellow-500" : "bg-primary"}
                        className="h-2"
                      />
                    </div>
                  )
                })}
              </div>
                {budgetSummary.rows.length === 0 && (
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
