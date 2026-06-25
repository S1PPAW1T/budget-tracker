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
        { name: "Food & Coffee", type: "Expense" },
        { name: "Transportation", type: "Expense" },
        { name: "Subscriptions", type: "Expense" },
        { name: "Utilities", type: "Expense" },
        { name: "Shopping", type: "Expense" },
      ]
      
      for (const cat of defaultCategories) {
        const created = await prisma.category.create({ data: cat })
        categories.push(created)
        
        if (cat.type === "Expense") {
          await prisma.budget.create({
            data: { limit: 0, categoryId: created.id },
          })
        }
      }
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
    // If it's an expense category, auto-create a budget of 0
    if (type === "Expense") {
      await prisma.budget.create({
        data: { limit: 0, categoryId: category.id },
      })
    }
    res.json(category)
  } catch (error) {
    console.error("Error creating category:", error)
    res.status(500).json({ error: "Failed to create category (name might not be unique)" })
  }
})

app.delete("/api/categories/:name", async (req, res) => {
  const { name } = req.params
  try {
    await prisma.category.delete({
      where: { name },
    })
    res.json({ success: true })
  } catch (error) {
    console.error("Error deleting category:", error)
    res.status(500).json({ error: "Failed to delete category" })
  }
})

// --- Budgets ---

app.get("/api/budgets", async (req, res) => {
  try {
    const budgets = await prisma.budget.findMany({
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
  const { limit } = req.body
  try {
    const budget = await prisma.budget.update({
      where: { categoryId },
      data: { limit: Number(limit) },
    })
    res.json(budget)
  } catch (error) {
    console.error("Error updating budget:", error)
    res.status(500).json({ error: "Failed to update budget" })
  }
})

// --- Transactions ---

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
  const { amount, date, type, note, categoryId } = req.body
  try {
    const transaction = await prisma.transaction.create({
      data: { 
        amount: Number(amount), 
        date: new Date(date), 
        type, 
        note, 
        categoryId 
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
  const { amount, date, type, note, categoryId } = req.body
  try {
    const transaction = await prisma.transaction.update({
      where: { id },
      data: { 
        amount: Number(amount), 
        date: new Date(date), 
        type, 
        note, 
        categoryId 
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
