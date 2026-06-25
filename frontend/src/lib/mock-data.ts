export type TransactionType = "Income" | "Expense"

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  category: string
  date: string
  note: string
}

export interface Budget {
  category: string
  limit: number
}

// Generate some dates within the current month
const today = new Date()
const currentMonth = today.getMonth()
const currentYear = today.getFullYear()

const d = (day: number) => new Date(currentYear, currentMonth, day).toISOString()

export const mockTransactions: Transaction[] = [
  { id: "1", type: "Income", amount: 50000, category: "Salary", date: d(1), note: "Monthly Salary" },
  { id: "2", type: "Expense", amount: 1500, category: "Food & Coffee", date: d(2), note: "Groceries" },
  { id: "3", type: "Expense", amount: 300, category: "Transportation", date: d(3), note: "Grab to work" },
  { id: "4", type: "Expense", amount: 800, category: "Food & Coffee", date: d(4), note: "Dinner with friends" },
  { id: "5", type: "Expense", amount: 450, category: "Subscriptions", date: d(5), note: "Netflix & Spotify" },
  { id: "6", type: "Expense", amount: 2000, category: "Utilities", date: d(6), note: "Electricity bill" },
  { id: "7", type: "Expense", amount: 1200, category: "Shopping", date: d(8), note: "Clothes" },
  { id: "8", type: "Expense", amount: 400, category: "Food & Coffee", date: d(10), note: "Cafe" },
  { id: "9", type: "Expense", amount: 350, category: "Transportation", date: d(12), note: "Bolt ride" },
  { id: "10", type: "Expense", amount: 2500, category: "Shopping", date: d(15), note: "New Shoes" },
]

export const mockBudgets: Budget[] = [
  { category: "Food & Coffee", limit: 8000 },
  { category: "Transportation", limit: 3000 },
  { category: "Subscriptions", limit: 1000 },
  { category: "Utilities", limit: 4000 },
  { category: "Shopping", limit: 5000 },
]

export const CATEGORIES = [
  "Salary",
  "Food & Coffee",
  "Transportation",
  "Subscriptions",
  "Utilities",
  "Shopping",
  "Other"
]
