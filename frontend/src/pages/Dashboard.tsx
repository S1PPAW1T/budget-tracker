

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
    <div className="space-y-8 relative">
      {/* Decorative background element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Dashboard</h1>
          <p className="text-base text-muted-foreground mt-2">Overview of your budget and spending.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-muted-foreground whitespace-nowrap">Month:</label>
            <Input 
              type="month" 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-40"
            />
          </div>
          <Button onClick={() => setIsModalOpen(true)} size="sm" className="gap-2 rounded-full px-6 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
            <PlusIcon className="h-4 w-4" />
            Add Transaction
          </Button>
        </div>
      </div>

      <SummaryCards />

      <div className="space-y-6">
        <TransactionChart />
        <div className="grid gap-6 md:grid-cols-2">
          <BudgetProgress />
          <RecentTransactions />
        </div>
      </div>

      <TransactionFormModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  )
}
