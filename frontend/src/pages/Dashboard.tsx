

import { useState } from "react"
import { useBudget } from "@/context/BudgetContext"
import { SummaryCards } from "@/components/dashboard/SummaryCards"
import { TransactionChart } from "@/components/dashboard/TransactionChart"
import { BudgetProgress } from "@/components/dashboard/BudgetProgress"
import { RecentTransactions } from "@/components/dashboard/RecentTransactions"
import { TransactionFormModal } from "@/components/transactions/TransactionFormModal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusIcon } from "lucide-react"

export default function DashboardPage() {
  const { selectedMonth, setSelectedMonth } = useBudget()
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-5 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow mb-2">Your workspace</p>
          <h1 className="page-title">Dashboard</h1>
          <p className="mt-2 text-sm text-muted-foreground">A clear view of what came in, went out, and is still available.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="dashboard-month" className="text-sm font-medium text-muted-foreground whitespace-nowrap">Month</label>
            <Input 
              id="dashboard-month"
              type="month" 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-40"
            />
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <PlusIcon className="h-4 w-4" />
            Add Transaction
          </Button>
        </div>
      </div>

      <SummaryCards />

      <div className="space-y-5">
        <TransactionChart />
        <div className="grid gap-5 xl:grid-cols-2">
          <BudgetProgress />
          <RecentTransactions />
        </div>
      </div>

      <TransactionFormModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  )
}
