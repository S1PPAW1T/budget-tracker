import "dotenv/config"
import express from "express"
import cors from "cors"
import { PrismaClient } from "@prisma/client"

const app = express()
const prisma = new PrismaClient()

app.use(cors())
app.use(express.json())

// --- Categories ---

app.get("/api/categories", async (req, res) => {
  try {
    let categories = await prisma.category.findMany()
    
    // Seed default categories if DB is empty
    if (categories.length === 0) {
      const defaultCategories = [
        { name: "Salary", type: "Income" },
        { name: "Freelance", type: "Income" },
        { name: "Investment", type: "Income" },
        { name: "Transfer", type: "Income" },
        { name: "Food & Coffee", type: "Expense" },
        { name: "Transportation", type: "Expense" },
        { name: "Subscriptions", type: "Expense" },
        { name: "Utilities", type: "Expense" },
        { name: "Shopping", type: "Expense" },
      ]
      
      for (const cat of defaultCategories) {
        const created = await prisma.category.create({ data: cat })
        categories.push(created)
      }
    }

    // Make the Transfer income option available in databases created before this feature.
    if (!categories.some(category => category.name.toLowerCase() === "transfer")) {
      const transfer = await prisma.category.create({ data: { name: "Transfer", type: "Income" } })
      categories.push(transfer)
    }
    
    res.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    res.status(500).json({ error: "Failed to fetch categories" })
  }
})

app.post("/api/categories", async (req, res) => {
  const { name, type } = req.body
  try {
    const category = await prisma.category.create({
      data: { name, type },
    })
    res.json(category)
  } catch (error) {
    console.error("Error creating category:", error)
    res.status(500).json({ error: "Failed to create category (name might not be unique)" })
  }
})

app.delete("/api/categories/:name", async (req, res) => {
  const { name } = req.params
  try {
    const category = await prisma.category.findUnique({ where: { name } })
    if (category) {
      // Keep income history when a funded expense category is removed.
      await prisma.transaction.updateMany({
        where: { destinationCategoryId: category.id },
        data: { destinationCategoryId: null },
      })
      // First delete associated transactions
      await prisma.transaction.deleteMany({
        where: { categoryId: category.id },
      })
      // Also delete associated budget if any
      await prisma.budget.deleteMany({
        where: { categoryId: category.id },
      })
      
      await prisma.category.delete({
        where: { name },
      })
    }
    res.json({ success: true })
  } catch (error) {
    console.error("Error deleting category:", error)
    res.status(500).json({ error: "Failed to delete category" })
  }
})

// --- Budgets ---

app.get("/api/budgets", async (req, res) => {
  const { month } = req.query
  try {
    const budgets = await prisma.budget.findMany({
      where: month ? { month: String(month) } : {},
      include: { category: true }
    })
    res.json(budgets)
  } catch (error) {
    console.error("Error fetching budgets:", error)
    res.status(500).json({ error: "Failed to fetch budgets" })
  }
})

app.put("/api/budgets/:categoryId", async (req, res) => {
  const { categoryId } = req.params
  const { limit, month } = req.body
  try {
    if (!month) {
      return res.status(400).json({ error: "month is required" })
    }
    const budget = await prisma.budget.upsert({
      where: {
        categoryId_month: { categoryId, month: String(month) }
      },
      update: { limit: Number(limit) },
      create: { limit: Number(limit), categoryId, month: String(month) },
    })
    res.json(budget)
  } catch (error) {
    console.error("Error updating budget:", error)
    res.status(500).json({ error: "Failed to update budget" })
  }
})

// --- Transactions ---

async function validateDestination(type: string, categoryId: string, destinationCategoryId?: string | null) {
  const source = await prisma.category.findUnique({ where: { id: categoryId } })
  if (!source || source.type !== type) return { id: null, error: "Invalid transaction category" }

  if (type !== "Income" || source.name.toLowerCase() !== "transfer") {
    return { id: null }
  }

  if (!destinationCategoryId) return { id: null, error: "Choose an expense category for the transfer" }
  const destination = await prisma.category.findUnique({ where: { id: destinationCategoryId } })
  if (!destination || destination.type !== "Expense") {
    return { id: null, error: "Transfer destination must be an expense category" }
  }
  return { id: destination.id }
}

app.get("/api/transactions", async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      include: { category: true },
      orderBy: { date: 'desc' }
    })
    res.json(transactions)
  } catch (error) {
    console.error("Error fetching transactions:", error)
    res.status(500).json({ error: "Failed to fetch transactions" })
  }
})

app.post("/api/transactions", async (req, res) => {
  const { amount, date, type, note, categoryId, destinationCategoryId } = req.body
  try {
    if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({ error: "Amount must be greater than zero" })
    }
    const destination = await validateDestination(type, categoryId, destinationCategoryId)
    if (destination.error) return res.status(400).json({ error: destination.error })
    const transaction = await prisma.transaction.create({
      data: { 
        amount: Number(amount), 
        date: new Date(date), 
        type, 
        note, 
        categoryId,
        destinationCategoryId: destination.id,
      },
      include: { category: true }
    })
    res.json(transaction)
  } catch (error) {
    console.error("Error creating transaction:", error)
    res.status(500).json({ error: "Failed to create transaction" })
  }
})

app.put("/api/transactions/:id", async (req, res) => {
  const { id } = req.params
  const { amount, date, type, note, categoryId, destinationCategoryId } = req.body
  try {
    if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({ error: "Amount must be greater than zero" })
    }
    const destination = await validateDestination(type, categoryId, destinationCategoryId)
    if (destination.error) return res.status(400).json({ error: destination.error })
    const transaction = await prisma.transaction.update({
      where: { id },
      data: { 
        amount: Number(amount), 
        date: new Date(date), 
        type, 
        note, 
        categoryId,
        destinationCategoryId: destination.id,
      },
      include: { category: true }
    })
    res.json(transaction)
  } catch (error) {
    console.error("Error updating transaction:", error)
    res.status(500).json({ error: "Failed to update transaction" })
  }
})

app.delete("/api/transactions/:id", async (req, res) => {
  const { id } = req.params
  try {
    await prisma.transaction.delete({
      where: { id },
    })
    res.json({ success: true })
  } catch (error) {
    console.error("Error deleting transaction:", error)
    res.status(500).json({ error: "Failed to delete transaction" })
  }
})

// --- Server start ---

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`)
})
