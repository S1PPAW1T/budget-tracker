import axios from 'axios'

export const api = axios.create({
  baseURL: (import.meta as any).env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface Transaction {
  id: string
  amount: number
  date: string
  type: "Income" | "Expense"
  note?: string | null
  categoryId: string
  destinationCategoryId?: string | null
  category?: Category
}

export interface Category {
  id: string
  name: string
  type: "Income" | "Expense"
}

export interface Budget {
  id: string
  limit: number
  categoryId: string
  month: string
  category?: Category
}
