import assert from "node:assert/strict"
import { getMonthlyBudget } from "../src/lib/budget-calculations.ts"

const categories = [
  { id: "transfer", name: "Transfer", type: "Income" },
  { id: "food", name: "Food", type: "Expense" },
  { id: "travel", name: "Travel", type: "Expense" },
]
const budgets = [
  { categoryId: "food", limit: 1000 },
  { categoryId: "travel", limit: 500 },
]
const transactions = [
  { type: "Income", category: "Transfer", amount: 200, date: "2026-10-02T00:00:00.000Z", destinationCategoryId: "food" },
  { type: "Expense", categoryId: "food", amount: 300, date: "2026-10-03T00:00:00.000Z" },
  { type: "Income", category: "Transfer", amount: 90, date: "2026-09-30T00:00:00.000Z", destinationCategoryId: "travel" },
]

const october = getMonthlyBudget(transactions, budgets, categories, "2026-10")
assert.equal(october.rows.find(row => row.categoryId === "food").available, 900)
assert.equal(october.rows.find(row => row.categoryId === "travel").available, 500)
assert.equal(october.remaining, 1400)

const moved = getMonthlyBudget([
  { ...transactions[0], destinationCategoryId: "travel" },
  ...transactions.slice(1),
], budgets, categories, "2026-10")
assert.equal(moved.rows.find(row => row.categoryId === "food").available, 700)
assert.equal(moved.rows.find(row => row.categoryId === "travel").available, 700)

const removed = getMonthlyBudget(transactions.slice(1), budgets, categories, "2026-10")
assert.equal(removed.rows.find(row => row.categoryId === "food").available, 700)
assert.equal(removed.remaining, 1200)

console.log("Transfer funding calculations passed")
