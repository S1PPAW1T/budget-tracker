import type { Budget, Category, Transaction } from "@/context/BudgetContext"

export function getMonthlyBudget(
  transactions: Transaction[],
  budgets: Budget[],
  categories: Category[],
  month: string,
) {
  const spentByCategoryId: Record<string, number> = {}
  const transfersByCategoryId: Record<string, number> = {}
  let totalSpent = 0
  let totalTransfers = 0

  for (const tx of transactions) {
    if (tx.date.slice(0, 7) !== month) continue
    if (tx.type === "Expense") {
      spentByCategoryId[tx.categoryId] = (spentByCategoryId[tx.categoryId] || 0) + tx.amount
      totalSpent += tx.amount
    } else if (tx.category.toLowerCase() === "transfer") {
      totalTransfers += tx.amount
      if (tx.destinationCategoryId) {
        transfersByCategoryId[tx.destinationCategoryId] =
          (transfersByCategoryId[tx.destinationCategoryId] || 0) + tx.amount
      }
    }
  }

  const rows = categories.filter(c => c.type === "Expense").map(category => {
    const limit = Number(budgets.find(b => b.categoryId === category.id)?.limit || 0)
    const transfer = transfersByCategoryId[category.id] || 0
    const spent = spentByCategoryId[category.id] || 0
    return {
      categoryId: category.id,
      category: category.name,
      limit,
      transfer,
      available: limit + transfer - spent,
      effectiveLimit: limit + transfer,
      spent,
    }
  })

  const totalLimit = budgets.reduce((sum, budget) => sum + Number(budget.limit || 0), 0)
  return {
    rows,
    totalLimit,
    totalTransfers,
    totalSpent,
    effectiveLimit: totalLimit + totalTransfers,
    remaining: totalLimit + totalTransfers - totalSpent,
  }
}
