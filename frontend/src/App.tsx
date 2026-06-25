import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { BudgetProvider } from "@/context/BudgetContext"
import { MainLayout } from "@/components/layout/MainLayout"
import WelcomePage from "@/pages/Welcome"
import DashboardPage from "@/pages/Dashboard"
import TransactionsPage from "@/pages/Transactions"
import BudgetPage from "@/pages/Budget"
import ReportsPage from "@/pages/Reports"

function App() {
  return (
    <Router>
      <BudgetProvider>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/dashboard" element={<MainLayout><DashboardPage /></MainLayout>} />
          <Route path="/transactions" element={<MainLayout><TransactionsPage /></MainLayout>} />
          <Route path="/budget" element={<MainLayout><BudgetPage /></MainLayout>} />
          <Route path="/reports" element={<MainLayout><ReportsPage /></MainLayout>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BudgetProvider>
    </Router>
  )
}

export default App
