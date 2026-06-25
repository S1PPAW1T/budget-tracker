

import { useState } from "react"
import { SummaryCards } from "@/components/dashboard/SummaryCards"
import { TransactionChart } from "@/components/dashboard/TransactionChart"
import { BudgetProgress } from "@/components/dashboard/BudgetProgress"
import { RecentTransactions } from "@/components/dashboard/RecentTransactions"
import { TransactionFormModal } from "@/components/transactions/TransactionFormModal"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-base text-muted-foreground mt-1">Overview of your budget and spending.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} size="sm" className="gap-2">
          <PlusIcon className="h-4 w-4" />
          Add Transaction
        </Button>
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
